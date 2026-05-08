'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import SamplerBottomNav from '@/app/_components/SamplerBottomNav'
import { getSamplerMissions } from '@/lib/api'
import { getOrderStatusLabel } from '@/lib/order-status'

function missionStatusLabel(status) {
  switch (status) {
    case 'COLLECTED':
      return 'ماموریت تکمیل شد'
    case 'CANCELLED':
      return 'ماموریت لغو شد'
    default:
      return 'ماموریت ثبت شد'
  }
}

export default function HistoryPage() {
  const [missions, setMissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadHistory() {
      try {
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        if (!user?.id) {
          setError('ابتدا با حساب نمونه گیر وارد شوید.')
          setLoading(false)
          return
        }

        const data = await getSamplerMissions(user.id)
        setMissions(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setError('دریافت تاریخچه ماموریت ها انجام نشد.')
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  const historyItems = useMemo(
    () => missions.filter((mission) => mission.status === 'COLLECTED' || mission.status === 'CANCELLED'),
    [missions],
  )

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-4 pb-24">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">تاریخچه ماموریت ها</h1>
          <p className="mt-2 text-sm text-slate-500">ماموریت های تکمیل شده و لغو شده شما در این بخش نمایش داده می شود.</p>
        </div>

        {loading ? <div className="rounded-3xl bg-white p-6 shadow-sm">در حال بارگذاری...</div> : null}
        {error ? <div className="rounded-3xl bg-red-50 p-6 text-red-600 shadow-sm">{error}</div> : null}

        {!loading && !error && historyItems.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 shadow-sm text-slate-600">هنوز آیتمی در تاریخچه شما ثبت نشده است.</div>
        ) : null}

        {!loading && !error && historyItems.length > 0 ? historyItems.map((mission) => (
          <Link key={mission.id} href={`/missions/${mission.id}`} className="block rounded-3xl bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900">
                  {mission.order?.patient?.firstName} {mission.order?.patient?.lastName}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {mission.address?.city || '-'}، {mission.address?.street || '-'}
                </p>
                <p className="text-sm text-slate-500">
                  {mission.order?.orderTests?.map((item) => item.labTest?.name).filter(Boolean).join('، ') || 'بدون تست ثبت شده'}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                    {missionStatusLabel(mission.status)}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                    {getOrderStatusLabel(mission.order, { missionStatus: mission.status })}
                  </span>
                </div>
              </div>
              <div className="text-left text-sm text-slate-500">
                <p>{new Date(mission.collectedAt || mission.createdAt).toLocaleString('fa-IR')}</p>
                <p className="mt-2 font-medium text-slate-700">
                  {mission.status === 'COLLECTED' ? 'جمع آوری نمونه انجام شد' : 'ماموریت بسته شد'}
                </p>
              </div>
            </div>
          </Link>
        )) : null}
      </div>

      <SamplerBottomNav />
    </div>
  )
}
