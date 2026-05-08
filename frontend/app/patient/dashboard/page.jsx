'use client';

import { useState, useEffect } from 'react';
import WelcomeCard from "@/app/_components/PatientDashboard/WelcomeCard";
import StatusSummary from "@/app/_components/PatientDashboard/StatusSummary";
import ActiveOrders from "@/app/_components/PatientDashboard/ActiveOrders";
import UpcomingVisit from "@/app/_components/PatientDashboard/UpcomingVisit";
import RecentResults from "@/app/_components/PatientDashboard/RecentResults";
import HealthTips from "@/app/_components/PatientDashboard/HealthTips";
import BlogArticles from "@/app/_components/PatientDashboard/BlogArticles";
import BottomNav from "@/app/_components/BottomNav";
import { getPatientByUserId, getOrdersByPatient } from '@/lib/api';

export default function DashboardPage() {
  const [patient, setPatient] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = localStorage.getItem('user');
        if (!userData) {
          setError('User not found');
          return;
        }

        const user = JSON.parse(userData);
        
        // Fetch patient data by userId
        const patientData = await getPatientByUserId(user.id);
        setPatient(patientData);

        // Fetch orders for this patient
        if (patientData && patientData.id) {
          const ordersData = await getOrdersByPatient(patientData.id);
          setOrders(ordersData || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">در حال بارگذاری داشبورد...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-sm p-8 max-w-sm">
          <span className="text-4xl">😕</span>
          <p className="text-red-600 mt-4">خطا: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-xl hover:bg-emerald-700 transition"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              داشبورد سلامت
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              خلاصه‌ای از وضعیت سلامت و آزمایش‌های شما
            </p>
          </div>
        </div>

        {/* Welcome Card */}
        <WelcomeCard patient={patient} />

        {/* Status Summary */}
        <StatusSummary orders={orders} />

        {/* Two-column layout for mid-section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Orders */}
          <ActiveOrders orders={orders} />

          {/* Upcoming Visit */}
          <UpcomingVisit orders={orders} />
        </div>

        {/* Two-column layout for health insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Tips */}
          <HealthTips orders={orders} />

          {/* Blog Articles */}
          <BlogArticles />
        </div>

        {/* Recent Results */}
        <RecentResults orders={orders} />
      </div>

      <BottomNav />
    </div>
  );
}
