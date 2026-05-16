'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/authService';

export default function SamplerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const role = 'SAMPLER';
  
const submit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  const res = await login(email, password, "sampler");

  if (!res.success) {
    setError(res.error || "ورود ناموفق بود");
    setLoading(false);
    return;
  }

  if (res.role !== "SAMPLER") {
    setError("این حساب نمونه‌گیر نیست");
    setLoading(false);
    return;
  }

  router.push("/missions");
};


  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="space-y-4 w-80">

        <h1 className="text-xl font-bold text-center">ورود نمونه‌گیر</h1>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input
          placeholder="ایمیل"
          className="border p-2 w-full"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="رمز عبور"
          className="border p-2 w-full"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="bg-blue-600 text-white py-2 rounded w-full">
          ورود
        </button>
      </form>
    </div>
  );
}
