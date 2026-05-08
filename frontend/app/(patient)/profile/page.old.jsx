'use client';

import { useState, useEffect } from 'react';
import { getToken } from '@/lib/authService';

export default function PatientProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center p-8">در حال بارگذاری...</div>;
  }

  if (!user) {
    return <div className="text-center p-8">لطفا ابتدا وارد شوید</div>;
  }

  return (
    <div dir="rtl" className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">پروفایل بیمار</h1>
      
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="text-gray-600">ایمیل</label>
          <p className="text-lg font-medium">{user.email}</p>
        </div>
        
        <div>
          <label className="text-gray-600">شماره تلفن</label>
          <p className="text-lg font-medium">{user.phone}</p>
        </div>
        
        <div>
          <label className="text-gray-600">نقش</label>
          <p className="text-lg font-medium">{user.role}</p>
        </div>
      </div>
    </div>
  );
}
