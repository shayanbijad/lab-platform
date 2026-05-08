'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import SamplerBottomNav from '@/app/_components/SamplerBottomNav'
import { getSamplerMissions } from '@/lib/api'
import { getOrderStatusLabel } from '@/lib/order-status'

function statusLabel(status) {
  switch (status) {
    case 'ASSIGNED':
      return 'اختصاص داده شده'
    case 'COLLECTED':
      return 'نمونه جمع آوری شد'
    case 'CANCELLED':
      return 'لغو شده'
    default:
      return 'در انتظار تخصیص'
  }
}

export default function MissionsPage() {
  const [missions, setMissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadMissions() {
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
        setError('دریافت ماموریت ها انجام نشد.')
      } finally {
        setLoading(false)
      }
    }

    loadMissions()
  }, [])

  const nextMission = useMemo(
    () => missions.find((mission) => mission.status !== 'COLLECTED' && mission.status !== 'CANCELLED') || missions[0],
    [missions],
  )

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-4 pb-24">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-[28px] bg-gradient-to-l from-slate-900 via-slate-800 to-emerald-700 p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold">ماموریت های نمونه گیری</h2>
          <p className="mt-2 text-sm text-slate-200">
ماموریت های خود را از اینجا ببینید.          </p>
        </div>

        {loading ? <div className="rounded-3xl bg-white p-6 shadow-sm">در حال بارگذاری...</div> : null}
        {error ? <div className="rounded-3xl bg-red-50 p-6 text-red-600 shadow-sm">{error}</div> : null}

        {!loading && !error && nextMission ? (
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">ماموریت بعدی</h3>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {statusLabel(nextMission.status)}
              </span>
            </div>
            <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
              <p>بیمار: {nextMission.order?.patient?.firstName} {nextMission.order?.patient?.lastName}</p>
              <p>زمان ثبت: {new Date(nextMission.createdAt).toLocaleString('fa-IR')}</p>
              <p>شهر: {nextMission.address?.city || '-'}</p>
              <p>تلفن بیمار: {nextMission.order?.patient?.user?.phone || '-'}</p>
            </div>
          </div>
        ) : null}

        {!loading && !error && missions.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 shadow-sm text-slate-600">
            هنوز ماموریتی به حساب شما اختصاص داده نشده است.
          </div>
        ) : null}

        {!loading && !error && missions.length > 0 ? (
          <div className="space-y-4">
            {missions.map((mission) => {
              const tests = mission.order?.orderTests?.map((item) => item.labTest?.name).filter(Boolean) || []
              return (
                <Link
                  key={mission.id}
                  href={`/missions/${mission.id}`}
                  className="block rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-semibold text-slate-900">
                          {mission.order?.patient?.firstName} {mission.order?.patient?.lastName}
                        </h4>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                          {statusLabel(mission.status)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">آزمایش ها: {tests.join('، ') || 'بدون تست ثبت شده'}</p>
                      <p className="text-sm text-slate-500">
                        آدرس: {mission.address?.city || '-'}، {mission.address?.street || '-'}
                        {mission.address?.building ? `، پلاک ${mission.address.building}` : ''}
                      </p>
                      <p className="text-sm text-emerald-700">
                        وضعیت سفارش: {getOrderStatusLabel(mission.order, { missionStatus: mission.status })}
                      </p>
                    </div>

                    <div className="text-sm text-slate-500 md:text-left">
                      <p>{new Date(mission.scheduledAt).toLocaleString('fa-IR')}</p>
                      <p className="mt-2 text-emerald-700">مشاهده جزئیات</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : null}
      </div>

      <SamplerBottomNav />
    </div>
  )
}
