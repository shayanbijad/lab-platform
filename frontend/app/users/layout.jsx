'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/app/_components/AdminSidebar';
import AdminHeader from '@/app/_components/AdminHeader';
import { getRole } from '@/lib/authService';

export default function UsersLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = getRole();
    
    // Check if user is authenticated and has admin role
    if (role === 'LAB_ADMIN' || role === 'SUPER_ADMIN') {
      setIsAuthorized(true);
    } else {
      // Redirect to login if not authenticated
      router.push('/auth/login');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div dir="rtl" className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
