import { useEffect, useState } from "react";

import API from "../api/client";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  description: "",
  member_ids: [],
};

export default function ProjectManagementPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function fetchData() {
    try {
      const [projectsResponse, membersResponse] = await Promise.all([
        API.get("/projects/"),
        API.get("/members/"),
      ]);
      setProjects(projectsResponse.data);
      setMembers(membersResponse.data);
    } catch {
      setError("Unable to load project data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function toggleMember(memberId) {
    setFormData((current) => {
      const exists = current.member_ids.includes(memberId);
      return {
        ...current,
        member_ids: exists
          ? current.member_ids.filter((id) => id !== memberId)
          : [...current.member_ids, memberId],
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      await API.post("/projects/", formData);
      setFormData(initialForm);
      setMessage("Project created successfully.");
      await fetchData();
    } catch (requestError) {
      const details = requestError.response?.data;
      setError(typeof details === "object" ? JSON.stringify(details) : "Unable to create project.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
      <section className="panel p-6">
        <div className="eyebrow">Projects</div>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">
          {isAdmin ? "Create Project" : "Project Access"}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {isAdmin
            ? "Create projects, attach members, and keep task assignment organized."
            : "Review the projects where you are included as a team member."}
        </p>

        {isAdmin ? (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Project Name</label>
              <input
                className="field"
                value={formData.name}
                onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                className="field min-h-28"
                value={formData.description}
                onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                required
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700">Assign Team Members</label>
              <div className="grid gap-3">
                {members.map((member) => (
                  <label
                    key={member.id}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-brand-300 hover:bg-brand-50/40"
                  >
                    <input
                      type="checkbox"
                      checked={formData.member_ids.includes(member.id)}
                      onChange={() => toggleMember(member.id)}
                    />
                    <span className="text-sm text-slate-700">
                      {member.full_name} ({member.employee_id})
                    </span>
                  </label>
                ))}
                {!members.length ? (
                  <div className="rounded-[22px] border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                    Create members first, then assign them to a project.
                  </div>
                ) : null}
              </div>
            </div>

            {message ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}
            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Creating..." : "Create Project"}
            </button>
          </form>
        ) : (
          <div className="mt-6 rounded-[22px] border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            Project membership is managed by admins. You can still review the projects assigned to you from the panel on the right.
          </div>
        )}
      </section>

      <section className="panel p-6">
        <h3 className="text-lg font-semibold text-slate-900">Project List</h3>
        <p className="mt-1 text-sm text-slate-500">Projects, member allocation, and related workload overview.</p>

        <div className="mt-5 space-y-4">
          {loading ? (
            <div className="text-sm text-slate-500">Loading projects...</div>
          ) : projects.length ? (
            projects.map((project) => (
              <div
                key={project.id}
                className="rounded-[22px] border border-slate-200 p-5 transition hover:border-brand-200 hover:shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">{project.name}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{project.description}</p>
                  </div>
                  <div className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-900">
                    {project.task_count || 0} Tasks
                  </div>
                </div>

                <div className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">Team Members</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.members?.length ? (
                    project.members.map((member) => (
                      <span
                        key={member.id}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {member.full_name}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">No members assigned yet.</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[22px] border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              No projects available yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
