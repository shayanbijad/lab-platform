'use client';

import { useState, useEffect } from 'react';
import { calculateDistance } from '@/lib/mapUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function AddressForm({ onAddressSelect }) {
  const [address, setAddress] = useState({
    city: '',
    street: '',
    building: '',
    latitude: null,
    longitude: null,
  });

  const [loading, setLoading] = useState(false);
  const [closestSampler, setClosestSampler] = useState(null);
  const [error, setError] = useState('');

  // Get current location
  const handleGetLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setAddress({ ...address, latitude, longitude });
          
          // Find closest sampler
          await fetchClosestSampler(latitude, longitude);
          setLoading(false);
        },
        (error) => {
          setError('Unable to get your location: ' + error.message);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  };

  const fetchClosestSampler = async (lat, lon) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/samplers/closest?latitude=${lat}&longitude=${lon}`
      );
      const data = await res.json();
      if (data.id) {
        setClosestSampler({
          ...data,
          distance: calculateDistance(lat, lon, data.latitude, data.longitude),
        });
      }
    } catch (err) {
      console.error('Error fetching closest sampler:', err);
    }
  };

  const handleSubmit = () => {
    if (!address.city || !address.street || address.latitude === null) {
      setError('Please fill all fields and set location');
      return;
    }
    onAddressSelect(address);
  };

  return (
    <div dir="rtl" className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">آدرس خود را وارد کنید</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">شهر</label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="مثال: تهران"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">خیابان</label>
          <input
            type="text"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="نام خیابان"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            ساختمان/پلاک (اختیاری)
          </label>
          <input
            type="text"
            value={address.building}
            onChange={(e) => setAddress({ ...address, building: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="شماره ساختمان/پلاک"
          />
        </div>

        <button
          onClick={handleGetLocation}
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'در حال بارگذاری موقعیت...' : 'موقعیت فعلی را دریافت کن'}
        </button>

        {address.latitude && address.longitude && (
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-sm text-gray-600">
              مختصات: {address.latitude.toFixed(4)}, {address.longitude.toFixed(4)}
            </p>
          </div>
        )}

        {closestSampler && (
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h3 className="font-semibold text-green-900 mb-2">
              نمونه‌گیر نزدیکترین
            </h3>
            <p className="text-sm text-green-800">
              نام: {closestSampler.user?.email}
            </p>
            <p className="text-sm text-green-800">
              فاصله: {closestSampler.distance?.toFixed(2)} کیلومتر
            </p>
            <p className="text-sm text-green-800">
              تلفن: {closestSampler.user?.phone}
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          تایید آدرس
        </button>
      </div>
    </div>
  );
}
