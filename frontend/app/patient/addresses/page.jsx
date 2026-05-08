'use client';

import { useState, useEffect } from 'react';
import AddressForm from '@/components/AddressForm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function PatientAddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        setError('Please log in first');
        return;
      }

      const user = JSON.parse(userData);
      const res = await fetch(
        `${API_BASE_URL}/addresses/patient/${user.id}`
      );

      if (res.ok) {
        const data = await res.json();
        setAddresses(Array.isArray(data) ? data : []);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setLoading(false);
    }
  };

  const handleAddressSelect = async (address) => {
    try {
      const userData = localStorage.getItem('user');
      const user = JSON.parse(userData);

      const res = await fetch(`${API_BASE_URL}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...address,
          patientId: user.id,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save address');
      }

      setSuccess('آدرس با موفقیت ذخیره شد');
      setShowForm(false);
      fetchAddresses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('آیا مطمئن هستید؟')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/addresses/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete address');
      }

      setSuccess('آدرس حذف شد');
      fetchAddresses();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">آدرس‌های من</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
          >
            {showForm ? 'لغو' : 'افزودن آدرس'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
            {success}
          </div>
        )}

        {showForm && (
          <div className="mb-8">
            <AddressForm onAddressSelect={handleAddressSelect} />
          </div>
        )}

        {loading ? (
          <div className="text-center p-8">در حال بارگذاری...</div>
        ) : addresses.length === 0 ? (
          <div className="text-center p-8 text-gray-600">
            هیچ آدرسی ثبت نشده است
          </div>
        ) : (
          <div className="grid gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white rounded-lg shadow p-6 flex justify-between items-start"
              >
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {address.label || 'بدون برچسب'}
                  </h3>
                  <p className="text-gray-600">
                    {address.city} - {address.street}
                  </p>
                  {address.building && (
                    <p className="text-gray-600">ساختمان: {address.building}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    مختصات: {address.latitude?.toFixed(4)},{' '}
                    {address.longitude?.toFixed(4)}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
