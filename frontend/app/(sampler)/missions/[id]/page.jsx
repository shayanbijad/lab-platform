'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import SamplerBottomNav from '@/app/_components/SamplerBottomNav'
import { getMissionById, startMission, updateMissionStatus } from '@/lib/api'
import { getOrderStatusLabel, getOrderWorkflowStage } from '@/lib/order-status'

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

export default function MissionDetails() {
  const { id } = useParams()
  const [mission, setMission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadMission() {
      try {
        const data = await getMissionById(id)
        setMission(data)
      } catch (err) {
        console.error(err)
        setError('جزئیات ماموریت بارگذاری نشد.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadMission()
    }
  }, [id])

  const tests = useMemo(
    () => mission?.order?.orderTests?.map((item) => item.labTest?.name).filter(Boolean) || [],
    [mission],
  )
  const orderStage = mission?.order
    ? getOrderWorkflowStage(mission.order, { missionStatus: mission.status })
    : 'ASSIGNED'

  const beginMission = async () => {
    try {
      setSaving(true)
      const updated = await startMission(id)
      setMission(updated)
    } catch (err) {
      console.error(err)
      setError('شروع ماموریت انجام نشد.')
    } finally {
      setSaving(false)
    }
  }

  const markCollected = async () => {
    try {
      setSaving(true)
      const updated = await updateMissionStatus(id, 'COLLECTED')
      setMission(updated)
    } catch (err) {
      console.error(err)
      setError('به روزرسانی وضعیت ماموریت انجام نشد.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-4 pb-24">
      <div className="mx-auto max-w-3xl space-y-5">
        <Link href="/missions" className="inline-flex text-sm text-emerald-700 hover:text-emerald-800">
          بازگشت به ماموریت ها
        </Link>

        {loading ? <div className="rounded-3xl bg-white p-6 shadow-sm">در حال بارگذاری...</div> : null}
        {error ? <div className="rounded-3xl bg-red-50 p-6 text-red-600 shadow-sm">{error}</div> : null}

        {mission ? (
          <>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">جزئیات ماموریت</h2>
                  <p className="mt-2 text-sm text-slate-500">شناسه ماموریت: {mission.id}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    وضعیت سفارش: {getOrderStatusLabel(mission.order, { missionStatus: mission.status })}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {statusLabel(mission.status)}
                </span>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">اطلاعات بیمار</h3>
              <p>نام: {mission.order?.patient?.firstName} {mission.order?.patient?.lastName}</p>
              <p>تلفن: {mission.order?.patient?.user?.phone || '-'}</p>
              <p>آدرس: {mission.address?.city || '-'}، {mission.address?.street || '-'}{mission.address?.building ? `، پلاک ${mission.address.building}` : ''}</p>
              <p>مختصات: {mission.address?.latitude ?? '-'} ، {mission.address?.longitude ?? '-'}</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">جزئیات سفارش</h3>
              <p>شناسه سفارش: {mission.order?.id}</p>
              <p>زمان ماموریت: {new Date(mission.scheduledAt).toLocaleString('fa-IR')}</p>
              <p>آزمایش ها: {tests.join('، ') || 'بدون تست ثبت شده'}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                <button
                  onClick={beginMission}
                disabled={saving || orderStage === 'ON_THE_WAY' || mission.status === 'COLLECTED'}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {mission.status === 'COLLECTED'
                  ? 'ماموریت تکمیل شده'
                  : orderStage === 'ON_THE_WAY'
                    ? 'ماموریت شروع شده'
                    : 'شروع ماموریت'}
              </button>
              <button
                onClick={markCollected}
                disabled={saving || mission.status === 'COLLECTED'}
                className="w-full rounded-2xl bg-slate-900 py-3 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {mission.status === 'COLLECTED' ? 'نمونه ثبت شده است' : saving ? 'در حال ثبت...' : 'ثبت جمع آوری نمونه'}
              </button>
            </div>

            <div className="space-y-2">
              <Link href={`/missions/${id}/checklist`} className="block rounded-2xl border bg-white p-4 shadow-sm">
                چک لیست
              </Link>
              <Link href={`/missions/${id}/upload`} className="block rounded-2xl border bg-white p-4 shadow-sm">
                آپلود مدارک
              </Link>
            </div>
          </>
        ) : null}
      </div>

      <SamplerBottomNav />
    </div>
  )
}
