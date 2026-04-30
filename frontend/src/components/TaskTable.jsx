import { formatDate, isOverdue } from "../utils/formatters";
import { PriorityBadge, StatusBadge } from "./StatusBadge";

export default function TaskTable({ tasks, showAssignee = false, actionSlot }) {
  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <th className="px-5 py-4">Task</th>
              {showAssignee ? <th className="px-5 py-4">Employee</th> : null}
              <th className="px-5 py-4">Due Date</th>
              <th className="px-5 py-4">Priority</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Project</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {tasks.length ? (
              tasks.map((task) => (
                <tr key={task.id} className={isOverdue(task) ? "bg-rose-50/60" : ""}>
                  <td className="px-5 py-4 align-top">
                    <div className="font-semibold text-slate-900">{task.title}</div>
                    <div className="mt-1 max-w-md text-sm leading-6 text-slate-500">{task.description}</div>
                  </td>
                  {showAssignee ? (
                    <td className="px-5 py-4 align-top text-sm text-slate-700">
                      <div>{task.assigned_member?.full_name}</div>
                      <div className="text-xs text-slate-500">{task.assigned_member?.employee_id}</div>
                    </td>
                  ) : null}
                  <td className="px-5 py-4 align-top text-sm text-slate-700">{formatDate(task.due_date)}</td>
                  <td className="px-5 py-4 align-top">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-5 py-4 align-top">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-5 py-4 align-top text-sm text-slate-700">{task.project_name || "-"}</td>
                  <td className="px-5 py-4 align-top">{actionSlot ? actionSlot(task) : null}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={showAssignee ? 7 : 6}
                  className="px-5 py-10 text-center text-sm text-slate-500"
                >
                  No tasks available yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
