'use client';

import { useEffect, useMemo, useState } from 'react';
import { Phone, PhoneCall, X } from 'lucide-react';
import { getLabs } from '@/lib/api';

function normalizePhone(phone) {
  return String(phone || '').trim();
}

function getEnvContacts() {
  const raw = process.env.NEXT_PUBLIC_CONTACT_NUMBERS;
  if (!raw) return [];

  return raw
    .split(',')
    .map((item, index) => {
      const [name, phone] = item.split(':');
      const normalizedPhone = normalizePhone(phone || name);

      if (!normalizedPhone) return null;

      return {
        id: `env-${index}`,
        name: phone ? name.trim() || `تماس ${index + 1}` : `تماس ${index + 1}`,
        phone: normalizedPhone,
      };
    })
    .filter(Boolean);
}

export default function ContactBubble() {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadContacts() {
      try {
        const labs = await getLabs();
        if (!active) return;

        const labContacts = (Array.isArray(labs) ? labs : [])
          .filter((lab) => lab?.phone)
          .map((lab) => ({
            id: lab.id,
            name: lab.name || 'آزمایشگاه',
            phone: normalizePhone(lab.phone),
          }));

        setContacts(labContacts);
      } catch (error) {
        if (!active) return;
        console.error('Failed to load contact numbers:', error);
        setContacts([]);
      }
    }

    loadContacts();

    return () => {
      active = false;
    };
  }, []);

  const visibleContacts = useMemo(() => {
    const envContacts = getEnvContacts();
    const source = contacts.length > 0 ? contacts : envContacts;

    return source.filter((item, index, array) => {
      const phone = normalizePhone(item.phone);
      return phone && array.findIndex((entry) => normalizePhone(entry.phone) === phone) === index;
    });
  }, [contacts]);

  return (
    <div className="fixed bottom-24 left-4 z-[60] md:bottom-6 md:left-6">
      {open ? (
        <div className="mb-3 w-[min(88vw,320px)] overflow-hidden rounded-[26px] border border-emerald-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-l from-emerald-600 to-teal-500 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">تماس با ما</p>
              <p className="text-xs text-emerald-50">برای تماس مستقیم روی شماره بزنید</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-white/15 p-2 transition hover:bg-white/25"
              aria-label="بستن"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3 p-3">
            {visibleContacts.length > 0 ? (
              visibleContacts.map((contact) => (
                <a
                  key={contact.id}
                  href={`tel:${contact.phone}`}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
                    <p dir="ltr" className="mt-1 text-left text-sm text-emerald-700">{contact.phone}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 p-3 text-emerald-700">
                    <PhoneCall size={18} />
                  </span>
                </a>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-500">
                هنوز شماره تماسی ثبت نشده است.
              </div>
            )}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-xl transition hover:scale-105"
        aria-label="تماس با ما"
      >
        <Phone size={22} />
      </button>
    </div>
  );
}
