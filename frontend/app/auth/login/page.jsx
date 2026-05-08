'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/authService';

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const role = 'patient';

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    const result = await login(email, password, role);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'ورود ناموفق بود');
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
    >
      <div className="max-w-md w-full space-y-6 bg-white p-6 rounded-lg shadow">

        <h2 className="text-center text-2xl font-bold">
          ورود کاربر
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>

        </form>

        <p className="text-center text-sm text-gray-600">
          حساب کاربری ندارید؟{' '}
          <Link
            href="/auth/register"
            className="text-emerald-600 hover:underline"
          >
            ثبت‌نام
          </Link>
        </p>

      </div>
    </div>
  );
}
