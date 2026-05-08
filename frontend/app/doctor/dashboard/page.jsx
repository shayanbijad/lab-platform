'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isDoctor, logout, getToken } from '@/lib/authService';
import {
  getOrderStatusBadgeClass,
  getOrderStatusLabel,
  getOrderWorkflowStage,
  isOrderResultsReady,
} from '@/lib/order-status';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function DoctorDashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!isDoctor()) {
      router.push('/auth/doctor-login');
      return;
    }

    const fetchData = async () => {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      try {
        const [patientsRes, ordersRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/doctor-crm/patients`, { headers, cache: 'no-store' }),
          fetch(`${API_BASE}/doctor-crm/orders`, { headers, cache: 'no-store' }),
          fetch(`${API_BASE}/doctor-crm/stats`, { headers, cache: 'no-store' }),
        ]);

        if (patientsRes.ok) setPatients(await patientsRes.json());
        if (ordersRes.ok) setOrders(await ordersRes.json());
        if (statsRes.ok) setStats(await statsRes.json());
      } catch (err) {
        console.error('Error fetching CRM data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/auth/doctor-login');
  };

  const getStatusBadge = (order) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusBadgeClass(order, { audience: 'doctor' })}`}>
        {getOrderStatusLabel(order, { audience: 'doctor' })}
      </span>
    );
  };

  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase();
    const phone = p.user?.phone || '';
    return fullName.includes(searchTerm.toLowerCase()) || phone.includes(searchTerm);
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter((order) => getOrderWorkflowStage(order) === 'ASSIGNED');
  const completedOrders = orders.filter((order) => isOrderResultsReady(order));

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">پنل پزشک</h1>
                <p className="text-xs text-gray-500">داشبورد مدیریت بیماران</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === 'dashboard'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            داشبورد
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === 'patients'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            بیماران
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === 'orders'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            سفارش‌ها
          </button>
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">کل بیماران</p>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.totalPatients || 0}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">کل سفارش‌ها</p>
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.totalOrders || 0}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">پزشک تخصیص داده شد</p>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.pendingOrders || 0}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">نتیجه آماده</p>
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.completedOrders || 0}</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">سفارش‌های اخیر</h2>
            </div>
            {stats?.recentOrders?.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {order.patient?.firstName} {order.patient?.lastName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(order.createdAt)} - {formatTime(order.createdAt)}
                      </p>
                    </div>
                    {getStatusBadge(order)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-8 text-center text-gray-400 text-sm">
                هیچ سفارشی ثبت نشده است
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">دسترسی سریع</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('patients')}
                className="p-4 border border-gray-200 rounded-xl text-center hover:bg-blue-50 hover:border-blue-200 transition"
              >
                <p className="text-sm font-medium text-gray-800">مشاهده بیماران</p>
                <p className="text-xs text-gray-400 mt-1">{patients.length} بیمار</p>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className="p-4 border border-gray-200 rounded-xl text-center hover:bg-blue-50 hover:border-blue-200 transition"
              >
                <p className="text-sm font-medium text-gray-800">سفارش‌های تخصیص‌شده</p>
                <p className="text-xs text-gray-400 mt-1">{pendingOrders.length} سفارش</p>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className="p-4 border border-gray-200 rounded-xl text-center hover:bg-blue-50 hover:border-blue-200 transition"
              >
                <p className="text-sm font-medium text-gray-800">نتایج آماده</p>
                <p className="text-xs text-gray-400 mt-1">{completedOrders.length} سفارش</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patients Tab */}
      {activeTab === 'patients' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute right-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="جستجوی بیماران (نام، شماره تلفن)..."
                className="w-full p-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Patients List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">لیست بیماران</h2>
              <span className="text-sm text-gray-400">{filteredPatients.length} بیمار</span>
            </div>

            {filteredPatients.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-400 text-sm">
                {searchTerm ? 'بیماری با این مشخصات یافت نشد' : 'هیچ بیماری ثبت نشده است'}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="px-6 py-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {(patient.firstName?.[0] || '?')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {patient.firstName || 'بدون نام'} {patient.lastName || ''}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                            {patient.user?.phone && <span>📱 {patient.user.phone}</span>}
                            {patient.user?.email && <span>✉️ {patient.user.email}</span>}
                            {patient.age && <span>🎂 {patient.age} سال</span>}
                            {patient.gender && <span>{patient.gender === 'male' || patient.gender === 'مرد' ? '👨' : '👩'}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-700">
                          {patient.orders?.length || 0} سفارش
                        </p>
                        <p className="text-xs text-gray-400">
                          {patient.addresses?.[0]?.city || 'آدرس نامشخص'}
                        </p>
                      </div>
                    </div>

                    {/* Show patient's orders */}
                    {patient.orders?.length > 0 && (
                      <div className="mt-3 mr-13 pr-4 border-r-2 border-blue-100 space-y-2">
                        {patient.orders.slice(0, 3).map((order) => (
                          <div key={order.id} className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-400 text-xs">{formatDate(order.createdAt)}</span>
                              <span className="text-gray-600">
                                {order.orderTests?.map((ot) => ot.labTest?.name).filter(Boolean).join('، ') || 'آزمایش'}
                              </span>
                            </div>
                              {getStatusBadge(order)}
                          </div>
                        ))}
                        {patient.orders.length > 3 && (
                          <p className="text-xs text-blue-500">+ {patient.orders.length - 3} سفارش دیگر</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">همه سفارش‌ها</h2>
              <div className="flex gap-2">
                <span className="text-sm text-gray-400">کل: {orders.length}</span>
                <span className="text-sm text-sky-600">تخصیص شده: {pendingOrders.length}</span>
                <span className="text-sm text-emerald-600">نتیجه آماده: {completedOrders.length}</span>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-400 text-sm">
                هیچ سفارشی ثبت نشده است
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <div key={order.id} className="px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xs font-mono">
                          #{order.id.slice(0, 4)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">
                            {order.patient?.firstName || 'نامشخص'} {order.patient?.lastName || ''}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(order.createdAt)} - {formatTime(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <p className="text-xs text-gray-500">
                            {order.orderTests?.map((ot) => ot.labTest?.name).filter(Boolean).join(', ') || '—'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {order.address?.city || ''} {order.address?.street || ''}
                          </p>
                        </div>
                        {getStatusBadge(order)}
                      </div>
                    </div>

                    {/* Show results if available */}
                    {order.orderTests?.some((ot) => ot.result) && (
                      <div className="mt-2 mr-12">
                        <details className="text-xs">
                          <summary className="text-blue-500 cursor-pointer hover:text-blue-700">
                            مشاهده نتایج آزمایش
                          </summary>
                          <div className="mt-2 space-y-1">
                            {order.orderTests.filter((ot) => ot.result).map((ot) => (
                              <div key={ot.id} className="text-gray-600">
                                {ot.labTest?.name}: {ot.result?.value} {ot.result?.unit || ''}
                                {ot.result?.reference && <span className="text-gray-400 mr-2">(مرجع: {ot.result.reference})</span>}
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-xs text-gray-400">
          پنل مدیریت پزشک &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
