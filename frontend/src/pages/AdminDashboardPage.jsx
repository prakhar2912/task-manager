import { useEffect, useState } from "react";

import API from "../api/client";
import SummaryCard from "../components/SummaryCard";
import TaskTable from "../components/TaskTable";

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await API.get("/dashboard/admin/");
        setDashboard(response.data);
      } catch {
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="panel p-6 text-sm text-slate-500">Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="panel border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>;
  }

  const summary = dashboard?.summary || {};

  return (
    <div className="space-y-6">
      <section className="panel overflow-hidden p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="eyebrow">Overview</div>
            <h2 className="mt-2 page-title">Team performance at a glance</h2>
            <p className="page-copy">
              Track active workload, overdue items, and project allocation without leaving the dashboard.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="panel-muted p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Projects</div>
              <div className="mt-2 text-xl font-semibold text-slate-900">{summary.total_projects || 0}</div>
            </div>
            <div className="panel-muted p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Members</div>
              <div className="mt-2 text-xl font-semibold text-slate-900">
                {(dashboard?.member_task_overview || []).length}
              </div>
            </div>
            <div className="panel-muted p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Overdue</div>
              <div className="mt-2 text-xl font-semibold text-amber-700">{summary.overdue_tasks || 0}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <SummaryCard label="Total Projects" value={summary.total_projects || 0} tone="accent" />
        <SummaryCard label="Total Tasks" value={summary.total_tasks || 0} />
        <SummaryCard label="Pending" value={summary.pending_tasks || 0} tone="default" />
        <SummaryCard label="In Progress" value={summary.in_progress_tasks || 0} tone="accent" />
        <SummaryCard label="Completed" value={summary.completed_tasks || 0} tone="success" />
        <SummaryCard label="Overdue" value={summary.overdue_tasks || 0} tone="warning" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_460px]">
        <div className="panel p-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Recent Tasks</h3>
            <p className="mt-1 text-sm text-slate-500">
              Latest assignments with employee ownership and live status.
            </p>
          </div>
          <div className="mt-5">
            <TaskTable tasks={dashboard?.recent_tasks || []} showAssignee />
          </div>
        </div>

        <div className="panel p-6">
          <h3 className="text-lg font-semibold text-slate-900">Employee Overview</h3>
          <p className="mt-1 text-sm text-slate-500">Member-wise workload and completion snapshot.</p>

          <div className="mt-5 space-y-4">
            {(dashboard?.member_task_overview || []).length ? (
              dashboard.member_task_overview.map((member) => (
                <div key={member.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">{member.full_name}</h4>
                      <p className="mt-1 text-sm text-slate-500">
                        {member.employee_id}
                        {member.department ? ` | ${member.department}` : ""}
                      </p>
                    </div>
                    <div className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-900">
                      {member.total_tasks} Tasks
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="rounded-2xl bg-white p-3">
                      <div className="font-semibold text-slate-900">{member.pending_tasks}</div>
                      <div className="mt-1 text-slate-500">Pending</div>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <div className="font-semibold text-slate-900">{member.in_progress_tasks}</div>
                      <div className="mt-1 text-slate-500">In Progress</div>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <div className="font-semibold text-slate-900">{member.completed_tasks}</div>
                      <div className="mt-1 text-slate-500">Completed</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                No members created yet.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="panel p-6">
        <h3 className="text-lg font-semibold text-slate-900">Projects</h3>
        <p className="mt-1 text-sm text-slate-500">Current project space with team allocation and task count.</p>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(dashboard?.project_overview || []).length ? (
            dashboard.project_overview.map((project) => (
              <div key={project.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-5 transition hover:border-brand-200 hover:shadow-sm">
                <h4 className="font-semibold text-slate-900">{project.name}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">{project.description}</p>
                <div className="mt-4 text-sm text-slate-500">{project.task_count || 0} tasks linked</div>
              </div>
            ))
          ) : (
            <div className="rounded-[22px] border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              No projects created yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
