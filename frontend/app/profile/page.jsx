'use client';

import { useEffect, useState } from 'react';
import { getRole, getToken } from '@/lib/authService';
import BottomNav from '@/app/_components/BottomNav';
import SamplerBottomNav from '@/app/_components/SamplerBottomNav';
import LocationPicker from '@/components/location-picker';
import {
  getPatientByUserId,
  getSamplerProfile,
  updateSamplerProfile,
  upsertPatientProfile,
} from '@/lib/api';

const insuranceOptions = [
  { value: 'SOCIAL_SECURITY', label: 'تامین اجتماعی' },
  { value: 'SELF_PAY', label: 'آزاد' },
  { value: 'ARMED_FORCES', label: 'بیمه نیروهای مسلح' },
  { value: 'HEALTH_INSURANCE', label: 'بیمه سلامت' },
];

const medicalOptions = [
  { value: 'diabetes', label: 'دیابت' },
  { value: 'hypertension', label: 'فشار خون' },
  { value: 'heart_disease', label: 'بیماری قلبی' },
  { value: 'thyroid', label: 'اختلال تیروئید' },
  { value: 'asthma', label: 'آسم' },
  { value: 'allergy', label: 'آلرژی' },
];

const patientSteps = [
  { id: 1, title: 'اطلاعات فردی' },
  { id: 2, title: 'بیمه' },
  { id: 3, title: 'سوابق پزشکی' },
];

const emptyPatientForm = {
  firstName: '',
  lastName: '',
  nationalId: '',
  age: '',
  gender: '',
  insuranceId: '',
  insuranceType: '',
  address: {
    city: '',
    street: '',
    building: '',
    unit: '',
    latitude: null,
    longitude: null,
  },
  medicalConditions: [],
};

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const showMessage = (type, text) => setMessage({ type, text });
  const [step, setStep] = useState(1);
  const [samplerForm, setSamplerForm] = useState({
    email: '',
    phone: '',
    city: '',
    street: '',
    building: '',
    latitude: '',
    longitude: '',
  });
  const [patientForm, setPatientForm] = useState(emptyPatientForm);

  useEffect(() => {
    async function loadProfile() {
      const token = getToken();
      const userData = localStorage.getItem('user');
      const currentRole = getRole();
      setRole(currentRole);

      if (!token || !userData) {
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      try {
        if (currentRole === 'SAMPLER') {
          const samplerProfile = await getSamplerProfile(parsedUser.id);
          setSamplerForm({
            email: samplerProfile.user?.email || parsedUser.email || '',
            phone: samplerProfile.user?.phone || parsedUser.phone || '',
            city: samplerProfile.city || '',
            street: samplerProfile.street || '',
            building: samplerProfile.building || '',
            latitude: samplerProfile.latitude ?? '',
            longitude: samplerProfile.longitude ?? '',
          });
        } else {
          const patientProfile = await getPatientByUserId(parsedUser.id);
          const primaryAddress =
            patientProfile?.addresses?.find((item) => item.label === 'profile-primary') ||
            patientProfile?.addresses?.[0];

          setPatientForm({
            firstName: patientProfile?.firstName || '',
            lastName: patientProfile?.lastName || '',
            nationalId: patientProfile?.nationalId || '',
            age: patientProfile?.age ? String(patientProfile.age) : '',
            gender: patientProfile?.gender || '',
            insuranceId: patientProfile?.insuranceId || '',
            insuranceType: patientProfile?.insuranceType || '',
            address: {
              city: primaryAddress?.city || '',
              street: primaryAddress?.street || '',
              building: primaryAddress?.building || '',
              unit: primaryAddress?.unit || '',
              latitude: primaryAddress?.latitude ?? null,
              longitude: primaryAddress?.longitude ?? null,
            },
            medicalConditions: patientProfile?.medicalConditions || [],
          });
        }
      } catch (error) {
        console.error(error);
        showMessage('error', currentRole === 'SAMPLER' ? 'بارگذاری اطلاعات نمونه گیر انجام نشد.' : 'بارگذاری پروفایل بیمار انجام نشد.');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const syncCurrentLocation = () => {
    if (!navigator.geolocation) {
      showMessage('error', 'مرورگر شما موقعیت مکانی را پشتیبانی نمی کند.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSamplerForm((current) => ({
          ...current,
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
        }));
        showMessage('success', 'مختصات فعلی شما ثبت شد.');
      },
      () => showMessage('error', 'دریافت موقعیت مکانی انجام نشد.'),
    );
  };

  const parseCoordinate = (value) => {
    if (value === '') return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : NaN;
  };

  const saveSamplerProfile = async () => {
    if (!user?.id) return;

    const latitude = parseCoordinate(samplerForm.latitude);
    const longitude = parseCoordinate(samplerForm.longitude);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      showMessage('error', 'عرض و طول جغرافیایی باید به صورت عددی وارد شوند.');
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const updated = await updateSamplerProfile(user.id, {
        email: samplerForm.email,
        phone: samplerForm.phone,
        city: samplerForm.city,
        street: samplerForm.street,
        building: samplerForm.building,
        latitude,
        longitude,
      });

      const updatedUser = {
        ...(user || {}),
        email: updated.user?.email || samplerForm.email,
        phone: updated.user?.phone || samplerForm.phone,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('authChanged'));
      showMessage('success', 'پروفایل نمونه گیر با موفقیت ذخیره شد.');
    } catch (error) {
      console.error(error);
      showMessage('error', 'ذخیره تغییرات انجام نشد.');
    } finally {
      setSaving(false);
    }
  };

  const updatePatientField = (key, value) => {
    setPatientForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const updatePatientAddress = (key, value) => {
    setPatientForm((current) => ({
      ...current,
      address: {
        ...current.address,
        [key]: value,
      },
    }));
  };

  const toggleMedicalCondition = (value) => {
    setPatientForm((current) => ({
      ...current,
      medicalConditions: current.medicalConditions.includes(value)
        ? current.medicalConditions.filter((item) => item !== value)
        : [...current.medicalConditions, value],
    }));
  };

  const validatePatientStep = () => {
    if (step === 1) {
      if (
        !patientForm.firstName ||
        !patientForm.lastName ||
        !patientForm.nationalId ||
        !patientForm.age ||
        !patientForm.gender
      ) {
        showMessage('error', 'لطفا همه فیلدهای اطلاعات فردی را کامل کنید.');
        return false;
      }
    }

    if (step === 2) {
      if (!patientForm.insuranceType || !patientForm.insuranceId) {
        showMessage('error', 'نوع بیمه و شناسه بیمه الزامی است.');
        return false;
      }
    }

    if (step === 3) {
      if (!patientForm.address.city || !patientForm.address.street) {
        showMessage('error', 'حداقل شهر و خیابان آدرس را وارد کنید.');
        return false;
      }
    }

    setMessage(null);
    return true;
  };

  const savePatientProfile = async () => {
    if (!user?.id) return;

    if (!patientForm.firstName || !patientForm.lastName || !patientForm.nationalId || !patientForm.gender) {
      showMessage('error', 'اطلاعات اصلی بیمار کامل نیست.');
      return;
    }

    if (!patientForm.insuranceType || !patientForm.insuranceId) {
      showMessage('error', 'اطلاعات بیمه کامل نیست.');
      return;
    }

    if (!patientForm.address.city || !patientForm.address.street) {
      showMessage('error', 'آدرس بیمار کامل نیست.');
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const ageValue = Number(patientForm.age);
      if (!Number.isFinite(ageValue) || ageValue < 0) {
        showMessage('error', 'سن باید به صورت عددی معتبر وارد شود.');
        return;
      }

      await upsertPatientProfile(user.id, {
        firstName: patientForm.firstName,
        lastName: patientForm.lastName,
        nationalId: patientForm.nationalId,
        age: ageValue,
        gender: patientForm.gender,
        insuranceId: patientForm.insuranceId,
        insuranceType: patientForm.insuranceType,
        address: patientForm.address,
        medicalConditions: patientForm.medicalConditions,
      });

      showMessage('success', 'اطلاعات بیمار با موفقيت ثبت شد.');
    } catch (error) {
      console.error(error);
      showMessage('error', 'ذخیره اطلاعات بیمار انجام نشد.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">در حال بارگذاری...</div>;
  }

  if (!user) {
    return <div className="text-center p-8">لطفا ابتدا وارد شوید</div>;
  }

  if (role === 'SAMPLER') {
    return (
      <div dir="rtl" className="mx-auto max-w-3xl p-6 pb-24">
        <div className="rounded-[28px] bg-gradient-to-l from-slate-900 via-slate-800 to-emerald-700 p-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold">پروفایل نمونه گیر</h1>
          <p className="mt-2 text-sm text-slate-200">
            اطلاعات تماس و موقعیت خود را ثبت کنید تا سفارش ها به نزدیک ترین نمونه گیر تخصیص داده شوند.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-900">
          <p className="font-semibold">موقعیت ثبت شده شما مبنای تخصیص نزدیک ترین ماموریت است.</p>
          <p className="mt-2">
            مختصات فعلی:
            {' '}
            {samplerForm.latitude || '-'}
            {' / '}
            {samplerForm.longitude || '-'}
          </p>
        </div>

        {message ? (
          <div
            className={`mt-4 rounded-2xl border p-4 text-sm shadow-sm ${
              message.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : message.type === 'error'
                  ? 'border-rose-200 bg-rose-50 text-rose-900'
                  : 'border-sky-200 bg-sky-50 text-sky-900'
            }`}
          >
            {message.text}
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-gray-600">ایمیل</label>
            <input className="w-full rounded-xl border p-3" value={samplerForm.email} onChange={(e) => setSamplerForm({ ...samplerForm, email: e.target.value })} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-600">شماره تلفن</label>
            <input className="w-full rounded-xl border p-3" value={samplerForm.phone} onChange={(e) => setSamplerForm({ ...samplerForm, phone: e.target.value })} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-600">شهر</label>
            <input className="w-full rounded-xl border p-3" value={samplerForm.city} onChange={(e) => setSamplerForm({ ...samplerForm, city: e.target.value })} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-600">خیابان</label>
            <input className="w-full rounded-xl border p-3" value={samplerForm.street} onChange={(e) => setSamplerForm({ ...samplerForm, street: e.target.value })} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-600">پلاک / ساختمان</label>
            <input className="w-full rounded-xl border p-3" value={samplerForm.building} onChange={(e) => setSamplerForm({ ...samplerForm, building: e.target.value })} />
          </div>
          <div className="flex items-end">
            <button onClick={syncCurrentLocation} className="w-full rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">
              استفاده از موقعیت فعلی
            </button>
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-600">Latitude</label>
            <input className="w-full rounded-xl border p-3" value={samplerForm.latitude} onChange={(e) => setSamplerForm({ ...samplerForm, latitude: e.target.value })} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-600">Longitude</label>
            <input className="w-full rounded-xl border p-3" value={samplerForm.longitude} onChange={(e) => setSamplerForm({ ...samplerForm, longitude: e.target.value })} />
          </div>
        </div>

        <button
          onClick={saveSamplerProfile}
          disabled={saving}
          className="mt-6 w-full rounded-2xl bg-slate-900 py-3 text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {saving ? 'در حال ذخیره...' : 'ذخیره اطلاعات نمونه گیر'}
        </button>

        <SamplerBottomNav />
      </div>
    );
  }

  return (
    <div dir="rtl" className="mx-auto max-w-4xl p-6 pb-24">
      <div className="rounded-[30px] bg-gradient-to-l from-emerald-700 via-emerald-600 to-teal-500 p-6 text-white shadow-lg">
        <p className="text-sm text-emerald-50">پروفایل بیمار</p>
        <h1 className="mt-2 text-3xl font-bold">تکمیل اطلاعات هویتی، بیمه و سابقه پزشکی</h1>
        <p className="mt-3 max-w-2xl text-sm text-emerald-50">
          این فرم در ۳ مرحله اطلاعات لازم برای ثبت سفارش، بررسی پوشش بیمه و سابقه پزشکی شما را نگهداری می کند.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {patientSteps.map((item) => {
          const isActive = item.id === step;
          const isDone = item.id < step;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setStep(item.id)}
              className={`rounded-3xl border p-4 text-right transition ${
                isActive
                  ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                  : isDone
                    ? 'border-emerald-200 bg-white'
                    : 'border-gray-200 bg-white'
              }`}
            >
              <div className="text-xs text-gray-500">مرحله {item.id}</div>
              <div className="mt-2 text-lg font-semibold text-gray-900">{item.title}</div>
            </button>
          );
        })}
      </div>

      {message ? (
        <div
          className={`mt-4 rounded-2xl border p-4 text-sm shadow-sm ${
            message.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : message.type === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-900'
                : 'border-sky-200 bg-sky-50 text-sky-900'
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <div className="mt-6 rounded-[28px] bg-white p-6 shadow-sm">
        {step === 1 ? (
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-600">نام</label>
              <input className="w-full rounded-xl border p-3" value={patientForm.firstName} onChange={(e) => updatePatientField('firstName', e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-600">نام خانوادگی</label>
              <input className="w-full rounded-xl border p-3" value={patientForm.lastName} onChange={(e) => updatePatientField('lastName', e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-600">کد ملی</label>
              <input className="w-full rounded-xl border p-3" value={patientForm.nationalId} onChange={(e) => updatePatientField('nationalId', e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-600">سن</label>
              <input type="number" min="0" className="w-full rounded-xl border p-3" value={patientForm.age} onChange={(e) => updatePatientField('age', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-600">جنسیت</label>
              <div className="flex flex-wrap gap-3">
                {['مرد', 'زن', 'سایر'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updatePatientField('gender', option)}
                    className={`rounded-full border px-5 py-2 text-sm ${
                      patientForm.gender === option
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-3 block text-sm text-gray-600">نوع بیمه</label>
              <div className="grid gap-3 md:grid-cols-2">
                {insuranceOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updatePatientField('insuranceType', option.value)}
                    className={`rounded-2xl border p-4 text-right ${
                      patientForm.insuranceType === option.value
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-600">شناسه / کد بیمه</label>
              <input className="w-full rounded-xl border p-3" value={patientForm.insuranceId} onChange={(e) => updatePatientField('insuranceId', e.target.value)} />
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-6">
            <div>
              <label className="mb-3 block text-sm text-gray-600">سوابق پزشکی</label>
              <div className="grid gap-3 md:grid-cols-3">
                {medicalOptions.map((option) => {
                  const selected = patientForm.medicalConditions.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleMedicalCondition(option.value)}
                      className={`rounded-2xl border p-4 text-right ${
                        selected
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-gray-600">شهر</label>
                <input className="w-full rounded-xl border p-3" value={patientForm.address.city} onChange={(e) => updatePatientAddress('city', e.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-600">خیابان</label>
                <input className="w-full rounded-xl border p-3" value={patientForm.address.street} onChange={(e) => updatePatientAddress('street', e.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-600">ساختمان / پلاک</label>
                <input className="w-full rounded-xl border p-3" value={patientForm.address.building} onChange={(e) => updatePatientAddress('building', e.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-600">واحد</label>
                <input className="w-full rounded-xl border p-3" value={patientForm.address.unit} onChange={(e) => updatePatientAddress('unit', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-gray-600">انتخاب موقعیت روی نقشه</label>
                <LocationPicker
                  value={patientForm.address}
                  onChange={({ latitude, longitude }) => {
                    updatePatientAddress('latitude', latitude);
                    updatePatientAddress('longitude', longitude);
                  }}
                />
                {patientForm.address.latitude && patientForm.address.longitude ? (
                  <p className="mt-2 text-xs text-gray-500">
                    موقعیت انتخاب‌شده: {Number(patientForm.address.latitude).toFixed(4)} ، {Number(patientForm.address.longitude).toFixed(4)}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:justify-between">
        <button
          type="button"
          onClick={() => setStep((current) => Math.max(1, current - 1))}
          disabled={step === 1}
          className="rounded-2xl border border-gray-200 px-6 py-3 text-gray-700 disabled:opacity-40"
        >
          مرحله قبل
        </button>

        <div className="flex gap-3">
          {step < patientSteps.length ? (
            <button
              type="button"
              onClick={() => {
                if (!validatePatientStep()) return;
                setStep((current) => Math.min(patientSteps.length, current + 1));
              }}
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-white"
            >
              ادامه
            </button>
          ) : (
            <button
              type="button"
              onClick={savePatientProfile}
              disabled={saving}
              className="rounded-2xl bg-slate-900 px-6 py-3 text-white disabled:opacity-60"
            >
              {saving ? 'در حال ذخیره...' : 'ذخیره پروفایل بیمار'}
            </button>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
