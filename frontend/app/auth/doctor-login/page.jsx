'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/authService';

export default function DoctorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const role = 'doctor';

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password, role);

    if (res.success) {
      router.push('/doctor/dashboard');
    } else {
      setError(res.error || 'ورود ناموفق بود');
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">ورود پزشک</h1>
          <p className="text-gray-500 text-sm mt-1">به پنل مدیریت بیماران خوش آمدید</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
            <input
              type="email"
              placeholder="example@clinic.com"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
          >
            {loading ? 'در حال ورود...' : 'ورود به پنل'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          دسترسی مخصوص پزشکان
        </p>
      </div>
    </div>
  );
}
