export default function SummaryCard({ label, value, tone = "default" }) {
  const toneClasses = {
    default: "border-slate-200 bg-white text-slate-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    accent: "border-brand-200 bg-brand-50 text-brand-900",
  };

  return (
    <div className={`panel border ${toneClasses[tone] || toneClasses.default} p-5`}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </div>
  );
}
