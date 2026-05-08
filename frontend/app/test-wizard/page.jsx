"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import LocationPicker from "@/components/location-picker";
import { getPatientByUserId, upsertPatientProfile, getLabTests } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const API = {
  createOrder: `${API_BASE}/orders`,
  uploadPrescription: `${API_BASE}/orders/prescription/upload`,
  login: `${API_BASE}/auth/login`,
  register: `${API_BASE}/auth/register`,
};

const insuranceOptions = [
  { value: "SOCIAL_SECURITY", label: "تامین اجتماعی" },
  { value: "SELF_PAY", label: "آزاد" },
  { value: "ARMED_FORCES", label: "بیمه نیروهای مسلح" },
  { value: "HEALTH_INSURANCE", label: "بیمه سلامت" },
];

// ─── Symptom → Test Package Mapping ───────────────────────────────────────
// Each symptom group maps to a package of recommended lab tests.
// Packages are defined by test name keywords that match against the DB.

const SYMPTOM_PACKAGES = [
  {
    id: "fatigue",
    icon: "😴",
    label: "خستگی مزمن و بی‌حالی",
    description: "احساس خستگی مداوم، کمبود انرژی، خواب‌آلودگی",
    testKeywords: ["CBC", "FBC", "VIT_D", "B12", "IRON", "FERRITIN", "TSH", "THYROID"],
    packageName: "بررسی علل خستگی",
  },
  {
    id: "weight",
    icon: "⚖️",
    label: "تغییر وزن (افزایش یا کاهش)",
    description: "افزایش یا کاهش وزن بدون دلیل، تغییر اشتها",
    testKeywords: ["TSH", "THYROID", "FBS", "BS", "BLOOD_SUGAR", "CBC", "LIPID", "CHOLESTEROL"],
    packageName: "بررسی متابولیسم و تیروئید",
  },
  {
    id: "digestive",
    icon: "🤢",
    label: "مشکلات گوارشی",
    description: "دل درد، نفخ، سوء هاضمه، یبوست یا اسهال",
    testKeywords: ["CBC", "LFT", "LIVER", "ALT", "AST", "FBS", "BS"],
    packageName: "بررسی گوارش و کبد",
  },
  {
    id: "heart",
    icon: "❤️",
    label: "علائم قلبی و عروقی",
    description: "تپش قلب، تنگی نفس، درد قفسه سینه، فشار خون",
    testKeywords: ["LIPID", "CHOLESTEROL", "LDL", "HDL", "TG", "FBS", "BS", "CBC"],
    packageName: "پروفایل قلب و عروق",
  },
  {
    id: "diabetes",
    icon: "🩸",
    label: "علائم دیابت و قند خون",
    description: "تشنگی زیاد، تکرر ادرار، کاهش وزن، زخم دیر بهبود",
    testKeywords: ["FBS", "BS", "BLOOD_SUGAR", "HB_A1C", "A1C", "LIPID", "CHOLESTEROL"],
    packageName: "غربالگری دیابت",
  },
  {
    id: "bone",
    icon: "🦴",
    label: "درد استخوان و مفاصل",
    description: "درد مفاصل، کمر درد، پوکی استخوان، شکستگی",
    testKeywords: ["VIT_D", "25OHD", "CALCIUM", "CA", "MAGNESIUM", "MG", "URIC_ACID", "UA"],
    packageName: "بررسی سلامت استخوان و مفاصل",
  },
  {
    id: "anemia",
    icon: "💉",
    label: "علائم کم‌خونی",
    description: "رنگ‌پریدگی، سرگیجه، تنگی نفس، سردی دست و پا",
    testKeywords: ["CBC", "FBC", "IRON", "FER", "FERRITIN", "B12", "VIT_D"],
    packageName: "بررسی کم‌خونی",
  },
  {
    id: "skin",
    icon: "🧴",
    label: "مشکلات پوستی و ریزش مو",
    description: "ریزش مو، خشکی پوست، جوش، تغییر رنگ پوست",
    testKeywords: ["VIT_D", "25OHD", "B12", "IRON", "FERRITIN", "TSH", "THYROID", "CBC"],
    packageName: "بررسی پوست و مو",
  },
  {
    id: "urinary",
    icon: "🚽",
    label: "مشکلات کلیوی و ادراری",
    description: "سوزش ادرار، تکرر ادرار، درد پهلو، ورم",
    testKeywords: ["RFT", "CREATININE", "BUN", "KIDNEY", "URIC_ACID", "UA", "CBC"],
    packageName: "بررسی کلیه و مجاری ادراری",
  },
  {
    id: "general",
    icon: "🔬",
    label: "چکاپ کامل سالیانه",
    description: "بدون علامت خاص، بررسی دوره‌ای سلامت",
    testKeywords: ["CBC", "FBS", "LIPID", "CHOLESTEROL", "LFT", "LIVER", "RFT", "KIDNEY", "VIT_D", "TSH", "THYROID"],
    packageName: "چکاپ کامل سالیانه",
  },
];

const steps = [
  { id: 1, title: "علائم" },
  { id: 2, title: "اطلاعات فردی" },
  { id: 3, title: "بیمه" },
  { id: 4, title: "نسخه" },
  { id: 5, title: "آدرس و موقعیت" },
  { id: 6, title: "احراز هویت" },
  { id: 7, title: "پرداخت" },
];

const emptyForm = {
  symptoms: [],
  symptomDescription: "",
  firstName: "",
  lastName: "",
  nationalId: "",
  gender: "",
  age: "",
  insuranceId: "",
  insuranceType: "",
  address: {
    street: "",
    city: "",
    building: "",
    unit: "",
    latitude: null,
    longitude: null,
  },
  prescription: {
    type: "upload",
    file: null,
    fileUrl: "",
    fileName: "",
    digitalCode: "",
  },
};

export default function TestWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [auth, setAuth] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const [isAuthed, setIsAuthed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [installmentCount, setInstallmentCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [allLabTests, setAllLabTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [recommendedPackage, setRecommendedPackage] = useState(null);

  // Fetch all lab tests from DB
  useEffect(() => {
    async function fetchTests() {
      try {
        const tests = await getLabTests();
        setAllLabTests(Array.isArray(tests) ? tests : []);
      } catch (err) {
        console.error("Error fetching lab tests:", err);
      }
    }
    fetchTests();
  }, []);

  const visibleSteps = useMemo(
    () => steps.filter((item) => !(item.id === 6 && isAuthed)),
    [isAuthed],
  );

  useEffect(() => {
    async function syncAuthAndProfile() {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "null");
        const authed = Boolean(token && user?.id);

        setIsAuthed(authed);
        setAuth((current) => ({
          ...current,
          email: user?.email || current.email,
          phone: user?.phone || current.phone,
        }));

        if (!authed) {
          return;
        }

        const patient = await getPatientByUserId(user.id);
        if (!patient) {
          return;
        }

        const primaryAddress =
          patient.addresses?.find((item) => item.label === "profile-primary") ||
          patient.addresses?.[0];

        setForm((current) => ({
          ...current,
          firstName: patient.firstName || current.firstName,
          lastName: patient.lastName || current.lastName,
          nationalId: patient.nationalId || current.nationalId,
          gender: patient.gender || current.gender,
          age: patient.age ? String(patient.age) : current.age,
          insuranceId: patient.insuranceId || current.insuranceId,
          insuranceType: patient.insuranceType || current.insuranceType,
          address: {
            ...current.address,
            city: primaryAddress?.city || current.address.city,
            street: primaryAddress?.street || current.address.street,
            building: primaryAddress?.building || current.address.building,
            unit: primaryAddress?.unit || current.address.unit,
            latitude: primaryAddress?.latitude ?? current.address.latitude,
            longitude: primaryAddress?.longitude ?? current.address.longitude,
          },
        }));

        if (step === 6) {
          setStep(7);
        }
      } catch (error) {
        console.error(error);
        setIsAuthed(false);
      }
    }

    syncAuthAndProfile();
    window.addEventListener("authChanged", syncAuthAndProfile);
    return () => window.removeEventListener("authChanged", syncAuthAndProfile);
  }, [step]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateAddress(key, value) {
    setForm((current) => ({
      ...current,
      address: {
        ...current.address,
        [key]: value,
      },
    }));
  }

  function updatePrescription(key, value) {
    setForm((current) => ({
      ...current,
      prescription: {
        ...current.prescription,
        [key]: value,
      },
    }));
  }

  function toggleSymptom(symptomId) {
    setForm((current) => {
      const exists = current.symptoms.includes(symptomId);
      const updated = exists
        ? current.symptoms.filter((s) => s !== symptomId)
        : [...current.symptoms, symptomId];
      return { ...current, symptoms: updated };
    });
  }

  // When symptoms change, update recommended tests
  useEffect(() => {
    if (form.symptoms.length === 0) {
      setRecommendedPackage(null);
      setSelectedTests([]);
      return;
    }

    // Collect all test keywords from selected symptoms
    const matchedKeywords = new Set();
    let bestPackage = null;
    let maxMatch = 0;

    form.symptoms.forEach((symptomId) => {
      const pkg = SYMPTOM_PACKAGES.find((p) => p.id === symptomId);
      if (pkg) {
        pkg.testKeywords.forEach((kw) => matchedKeywords.add(kw.toUpperCase()));
        // Find the best matching package name
        const matchCount = pkg.testKeywords.length;
        if (matchCount > maxMatch) {
          maxMatch = matchCount;
          bestPackage = pkg;
        }
      }
    });

    // Find matching lab tests from DB
    const matched = allLabTests.filter((test) => {
      const name = (test.name || "").toUpperCase();
      const code = (test.code || "").toUpperCase();
      return Array.from(matchedKeywords).some(
        (kw) => name.includes(kw) || code.includes(kw)
      );
    });

    setRecommendedPackage(bestPackage);
    setSelectedTests(matched);
  }, [form.symptoms, allLabTests]);

  function nextStep() {
    setStep((current) => {
      if (current === 5 && isAuthed) return 7;
      return Math.min(7, current + 1);
    });
  }

  function backStep() {
    setStep((current) => {
      if (current === 7 && isAuthed) return 5;
      return Math.max(1, current - 1);
    });
  }

  function validateStep(currentStep) {
    if (currentStep === 1) {
      return form.symptoms.length > 0;
    }

    if (currentStep === 2) {
      return Boolean(
        form.firstName &&
          form.lastName &&
          form.nationalId &&
          form.gender &&
          form.age,
      );
    }

    if (currentStep === 3) {
      return Boolean(form.insuranceType && form.insuranceId);
    }

    if (currentStep === 4) {
      if (form.prescription.type === "upload") {
        return Boolean(form.prescription.file || form.prescription.fileUrl);
      }
      return Boolean(form.prescription.digitalCode);
    }

    if (currentStep === 5) {
      return Boolean(form.address.city && form.address.street);
    }

    if (currentStep === 6) {
      return Boolean(auth.email && auth.phone && auth.password);
    }

    return true;
  }

  async function loginUser() {
    try {
      setLoading(true);
      const res = await fetch(API.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: auth.email,
          password: auth.password,
        }),
      });

      if (!res.ok) {
        throw new Error((await res.text()) || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user?.role || "PATIENT");
      window.dispatchEvent(new Event("authChanged"));
      setStep(7);
    } catch (error) {
      console.error(error);
      alert("خطا در ورود");
    } finally {
      setLoading(false);
    }
  }

  async function registerUser() {
    try {
      setLoading(true);
      const res = await fetch(API.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: auth.email,
          phone: auth.phone,
          password: auth.password,
          role: "PATIENT",
        }),
      });

      if (!res.ok) {
        throw new Error((await res.text()) || "Register failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user?.role || "PATIENT");
      window.dispatchEvent(new Event("authChanged"));
      setStep(7);
    } catch (error) {
      console.error(error);
      alert("خطا در ثبت نام");
    } finally {
      setLoading(false);
    }
  }

  async function uploadPrescriptionFile() {
    if (!form.prescription.file) {
      return {
        fileUrl: form.prescription.fileUrl,
        fileName: form.prescription.fileName,
      };
    }

    const formData = new FormData();
    formData.append("file", form.prescription.file);

    const res = await fetch(API.uploadPrescription, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error((await res.text()) || "Prescription upload failed");
    }

    const uploaded = await res.json();
    updatePrescription("fileUrl", uploaded.url);
    updatePrescription("fileName", uploaded.fileName);
    return {
      fileUrl: uploaded.url,
      fileName: uploaded.fileName,
    };
  }

  async function createOrder() {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (!user?.id) {
        throw new Error("User not found");
      }

      const ageValue = Number(form.age);
      if (!Number.isFinite(ageValue)) {
        throw new Error("Age is invalid");
      }

      await upsertPatientProfile(user.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        nationalId: form.nationalId,
        age: ageValue,
        gender: form.gender,
        insuranceId: form.insuranceId,
        insuranceType: form.insuranceType,
        address: form.address,
        medicalConditions: [],
      });

      let prescriptionPayload = {
        type: form.prescription.type,
        digitalCode: form.prescription.digitalCode,
        fileUrl: form.prescription.fileUrl,
        fileName: form.prescription.fileName,
      };

      if (form.prescription.type === "upload") {
        prescriptionPayload = {
          ...prescriptionPayload,
          ...(await uploadPrescriptionFile()),
        };
      }

      const res = await fetch(API.createOrder, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: user.id,
          testIds: selectedTests.map((t) => t.id),
          wizardData: {
            ...form,
            age: ageValue,
            prescription: prescriptionPayload,
            selectedTestIds: selectedTests.map((t) => t.id),
            selectedTestNames: selectedTests.map((t) => t.name),
            recommendedPackage: recommendedPackage?.packageName || "",
          },
        }),
      });

      if (!res.ok) {
        throw new Error((await res.text()) || "Order creation failed");
      }

      setStep(8);
      setTimeout(() => {
        router.push("/patient/dashboard");
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("خطا در ثبت سفارش");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6" dir="rtl">
      <div className="mb-8 grid grid-cols-4 gap-2 md:grid-cols-7">
        {visibleSteps.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl border p-2 text-center ${
              item.id === step
                ? "border-emerald-500 bg-emerald-50"
                : item.id < step
                  ? "border-emerald-200 bg-white"
                  : "border-gray-200 bg-white"
            }`}
          >
            <div className="text-xs text-gray-500">مرحله {item.id}</div>
            <div className="mt-1 text-xs font-semibold">{item.title}</div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         STEP 1 – Symptoms & Test Package Selection
         ═══════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <span className="text-4xl">🩺</span>
            <h2 className="text-xl font-bold mt-2">چه علائمی دارید؟</h2>
            <p className="text-sm text-gray-500 mt-1">
              یکی یا چند مورد از علائم خود را انتخاب کنید تا بسته آزمایشی مناسب به شما پیشنهاد شود
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {SYMPTOM_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => toggleSymptom(pkg.id)}
                className={`rounded-2xl border p-4 text-right transition ${
                  form.symptoms.includes(pkg.id)
                    ? "border-emerald-500 bg-emerald-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{pkg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800">{pkg.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{pkg.description}</p>
                    {form.symptoms.includes(pkg.id) && (
                      <span className="inline-block mt-2 text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {pkg.packageName}
                      </span>
                    )}
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 ${
                    form.symptoms.includes(pkg.id)
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-gray-300"
                  }`}>
                    {form.symptoms.includes(pkg.id) && (
                      <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Show recommended tests */}
          {selectedTests.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📋</span>
                <p className="font-semibold text-emerald-800">
                  {recommendedPackage ? `بسته پیشنهادی: ${recommendedPackage.packageName}` : "آزمایش‌های پیشنهادی"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTests.map((test) => (
                  <span
                    key={test.id}
                    className="bg-white text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full border border-emerald-200"
                  >
                    {test.name}
                    {test.price ? ` (${test.price.toLocaleString()} تومان)` : ""}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                می‌توانید در ادامه نسخه پزشک خود را نیز اضافه کنید
              </p>
            </div>
          )}

          <Button className="w-full" onClick={nextStep} disabled={!validateStep(1)}>
            ادامه و انتخاب آزمایش‌ها
          </Button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         STEP 2 – Personal Info
         ═══════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">اطلاعات فردی</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="border p-3 rounded-xl" placeholder="نام" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
            <input className="border p-3 rounded-xl" placeholder="نام خانوادگی" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
            <input className="border p-3 rounded-xl" placeholder="کد ملی" value={form.nationalId} onChange={(e) => updateField("nationalId", e.target.value)} />
            <input type="number" className="border p-3 rounded-xl" placeholder="سن" value={form.age} onChange={(e) => updateField("age", e.target.value)} />
            <div className="md:col-span-2 flex gap-3">
              {["مرد", "زن", "سایر"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateField("gender", option)}
                  className={`flex-1 rounded-xl border p-3 ${
                    form.gender === option
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <Button className="w-full" onClick={nextStep} disabled={!validateStep(2)}>
            ادامه
          </Button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         STEP 3 – Insurance
         ═══════════════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">اطلاعات بیمه</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {insuranceOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateField("insuranceType", option.value)}
                className={`rounded-2xl border p-4 text-right ${
                  form.insuranceType === option.value
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <input className="border p-3 rounded-xl w-full" placeholder="شناسه / کد بیمه" value={form.insuranceId} onChange={(e) => updateField("insuranceId", e.target.value)} />
          <Button className="w-full" onClick={nextStep} disabled={!validateStep(3)}>
            ادامه
          </Button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         STEP 4 – Prescription
         ═══════════════════════════════════════════════════════════════ */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">نسخه پزشک</h2>
          <p className="text-sm text-gray-600">
            اگر نسخه تصویر یا PDF دارید آپلود کنید، و اگر نسخه دیجیتال دارید کد آن را وارد کنید.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => updatePrescription("type", "upload")}
              className={`flex-1 rounded-xl border p-3 ${
                form.prescription.type === "upload"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-200"
              }`}
            >
              فایل / عکس نسخه
            </button>
            <button
              type="button"
              onClick={() => updatePrescription("type", "digital")}
              className={`flex-1 rounded-xl border p-3 ${
                form.prescription.type === "digital"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-200"
              }`}
            >
              کد نسخه دیجیتال
            </button>
          </div>

          {form.prescription.type === "upload" ? (
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*,application/pdf"
                className="border p-3 rounded-xl w-full"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  updatePrescription("file", file);
                  updatePrescription("fileName", file?.name || "");
                  updatePrescription("fileUrl", "");
                }}
              />
              {form.prescription.fileName ? (
                <p className="text-sm text-gray-500">فایل انتخاب شده: {form.prescription.fileName}</p>
              ) : null}
            </div>
          ) : (
            <input
              className="border p-3 rounded-xl w-full"
              placeholder="کد نسخه دیجیتال"
              value={form.prescription.digitalCode}
              onChange={(e) => updatePrescription("digitalCode", e.target.value)}
            />
          )}

          <Button className="w-full" onClick={nextStep} disabled={!validateStep(4)}>
            ادامه
          </Button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         STEP 5 – Address & Location
         ═══════════════════════════════════════════════════════════════ */}
      {step === 5 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">آدرس و موقعیت</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input className="border p-3 rounded-xl" placeholder="شهر" value={form.address.city} onChange={(e) => updateAddress("city", e.target.value)} />
            <input className="border p-3 rounded-xl" placeholder="خیابان" value={form.address.street} onChange={(e) => updateAddress("street", e.target.value)} />
            <input className="border p-3 rounded-xl" placeholder="پلاک / ساختمان" value={form.address.building} onChange={(e) => updateAddress("building", e.target.value)} />
            <input className="border p-3 rounded-xl" placeholder="واحد" value={form.address.unit} onChange={(e) => updateAddress("unit", e.target.value)} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">موقعیت را روی نقشه انتخاب کنید:</p>
            <LocationPicker
              value={form.address}
              onChange={({ latitude, longitude }) => {
                updateAddress("latitude", latitude);
                updateAddress("longitude", longitude);
              }}
            />
            {form.address.latitude && form.address.longitude ? (
              <p className="mt-2 text-xs text-gray-500">
                موقعیت: {Number(form.address.latitude).toFixed(4)} ، {Number(form.address.longitude).toFixed(4)}
              </p>
            ) : null}
          </div>
          <Button className="w-full" onClick={nextStep} disabled={!validateStep(5)}>
            ادامه
          </Button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         STEP 6 – Auth (only if not logged in)
         ═══════════════════════════════════════════════════════════════ */}
      {step === 6 && !isAuthed && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">ورود / ثبت‌نام</h2>
          <input className="border p-3 rounded-xl w-full" placeholder="ایمیل" value={auth.email} onChange={(e) => setAuth((current) => ({ ...current, email: e.target.value }))} />
          <input className="border p-3 rounded-xl w-full" placeholder="شماره موبایل" value={auth.phone} onChange={(e) => setAuth((current) => ({ ...current, phone: e.target.value }))} />
          <input type="password" className="border p-3 rounded-xl w-full" placeholder="رمز عبور" value={auth.password} onChange={(e) => setAuth((current) => ({ ...current, password: e.target.value }))} />
          <div className="flex flex-col gap-3">
            <Button onClick={loginUser} disabled={!validateStep(6) || loading}>
              {loading ? "درحال پردازش..." : "ورود"}
            </Button>
            <Button variant="outline" onClick={registerUser} disabled={!validateStep(6) || loading}>
              {loading ? "درحال پردازش..." : "ثبت‌نام"}
            </Button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         STEP 7 – Payment
         ═══════════════════════════════════════════════════════════════ */}
      {step === 7 && (
        <div>
          <h2 className="text-xl font-bold mb-4">روش پرداخت</h2>

          {/* Show selected tests summary */}
          {selectedTests.length > 0 && (
            <div className="bg-gray-50 border rounded-xl p-4 mb-6">
              <p className="font-semibold text-gray-700 mb-2">خلاصه سفارش:</p>
              <ul className="space-y-1">
                {selectedTests.map((test) => (
                  <li key={test.id} className="text-sm text-gray-600 flex justify-between">
                    <span>{test.name}</span>
                    {test.price && <span>{test.price.toLocaleString()} تومان</span>}
                  </li>
                ))}
              </ul>
              {recommendedPackage && (
                <p className="text-xs text-emerald-600 mt-2">
                  بسته: {recommendedPackage.packageName}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3 mb-6">
            <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="ml-3"
              />
              <div>
                <p className="font-semibold">کارت اعتباری</p>
                <p className="text-xs text-gray-500">پرداخت آنلاین با کارت بانکی</p>
              </div>
            </label>

            <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="onsite"
                checked={paymentMethod === "onsite"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="ml-3"
              />
              <div>
                <p className="font-semibold">پرداخت در محل</p>
                <p className="text-xs text-gray-500">پرداخت هنگام مراجعه</p>
              </div>
            </label>

            <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="installment"
                checked={paymentMethod === "installment"}
                 onChange={(e) => setPaymentMethod(e.target.value)}
                className="ml-3"
              />
              <div>
                <p className="font-semibold">پرداخت اقساطی</p>
                <p className="text-xs text-gray-500">پرداخت در چند قسط</p>
              </div>
            </label>
          </div>

          {paymentMethod === "installment" && (
            <div className="mb-6 p-4 border border-emerald-200 bg-emerald-50 rounded-xl">
              <p className="font-semibold text-emerald-800 mb-3">تعداد اقساط</p>
              <div className="flex gap-3">
                {[2, 3, 4, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setInstallmentCount(num)}
                    className={`flex-1 rounded-xl border p-3 text-center ${
                      installmentCount === num
                        ? "border-emerald-500 bg-emerald-100 text-emerald-700"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <span className="font-semibold">{num}</span>
                    <span className="block text-xs text-gray-500">قسط</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                مبلغ هر قسط به صورت مساوی محاسبه خواهد شد
              </p>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4 text-sm text-yellow-800">
            ⚠️ درگاه پرداخت به زودی فعال می‌شود. در حال حضر سفارش شما ثبت می‌شود و همکاران ما برای هماهنگی با شما تماس می‌گیرند.
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={backStep}>
              بازگشت
            </Button>
            <Button className="flex-1" onClick={createOrder} disabled={loading}>
              {loading ? "در حال ثبت..." : "ثبت سفارش"}
            </Button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         STEP 8 – Success
         ═══════════════════════════════════════════════════════════════ */}
      {step === 8 && (
        <div className="text-center py-16">
          <span className="text-6xl">🎉</span>
          <h2 className="text-2xl font-bold mt-4">سفارش شما با موفقیت ثبت شد!</h2>
          <p className="text-gray-500 mt-2">
            همکاران ما به زودی برای هماهنگی با شما تماس خواهند گرفت.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            در حال انتقال به داشبورد...
          </p>
        </div>
      )}
    </div>
  );
}
