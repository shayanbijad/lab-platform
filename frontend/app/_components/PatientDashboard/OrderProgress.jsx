export default function OrderProgress({ step }) {
  const steps = [
    "تخصیص نمونه‌گیر",
    "نمونه‌گیر در مسیر",
    "نمونه جمع‌آوری شد",
    "تحویل آزمایشگاه",
    "نتیجه آماده است",
  ];

  return (
    <div dir="rtl" className="flex items-center justify-between mt-4 text-xs">
      {steps.map((label, i) => (
        <div key={i} className="flex-1 text-center">
          <div
            className={`mb-1 ${
              i <= step ? "text-emerald-600 font-semibold" : "text-gray-400"
            }`}
          >
            {label}
          </div>

          {i < steps.length - 1 && (
            <div
              className={`h-1 ${
                i < step ? "bg-emerald-600" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
