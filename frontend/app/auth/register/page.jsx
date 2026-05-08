'use client';
import { Eye, EyeOff } from "lucide-react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/authService';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const role = 'patient'; // fixed — no sampler signup allowed

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('رمز عبور و تکرار آن یکسان نیست.');
      return;
    }

    if (formData.password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
      return;
    }

    setLoading(true);

    const result = await register(
      formData.email,
      formData.password,
      formData.phone,
      role
    );

    if (result.success) {
      setSuccess('ثبت‌نام با موفقیت انجام شد! در حال انتقال...');
      setTimeout(() => router.push('/auth/login'), 1500);
    } else {
      setError(result.error || 'ثبت‌نام با خطا مواجه شد.');
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-6">

        <h2 className="text-center text-2xl font-bold text-gray-900">
          ایجاد حساب کاربری
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {error && (
            <div className="bg-red-100 text-red-700 text-sm p-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-700 text-sm p-3 rounded">
              {success}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">ایمیل</label>
            <input
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">شماره موبایل</label>
            <input
              type="tel"
              name="phone"
              placeholder="09123456789"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Password */}
          <div>
  <label className="block text-sm text-gray-700 mb-1">رمز عبور</label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="••••••"
      value={formData.password}
      onChange={handleChange}
      required
      className="w-full p-2 border rounded focus:ring-emerald-500 focus:border-emerald-500"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute left-3 top-2 text-gray-500"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>

          {/* Confirm Password */}
          <div>
  <label className="block text-sm text-gray-700 mb-1">تکرار رمز عبور</label>

  <div className="relative">
    <input
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      placeholder="••••••"
      value={formData.confirmPassword}
      onChange={handleChange}
      required
      className="w-full p-2 border rounded focus:ring-emerald-500 focus:border-emerald-500"
    />

    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute left-3 top-2 text-gray-500"
    >
      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? 'در حال ایجاد حساب...' : 'ثبت‌نام'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          قبلاً ثبت‌نام کرده‌اید؟{' '}
          <Link href="/auth/login" className="text-emerald-600 hover:underline">
            ورود
          </Link>
        </p>
      </div>
    </div>
  );
}
