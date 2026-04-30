import { priorityLabel, statusLabel } from "../utils/formatters";

export function StatusBadge({ status }) {
  const toneMap = {
    pending: "bg-slate-100 text-slate-700",
    in_progress: "bg-amber-100 text-amber-800",
    completed: "bg-emerald-100 text-emerald-800",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneMap[status] || toneMap.pending}`}>
      {statusLabel(status)}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const toneMap = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-sky-100 text-sky-800",
    high: "bg-rose-100 text-rose-800",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneMap[priority] || toneMap.medium}`}>
      {priorityLabel(priority)}
    </span>
  );
}
