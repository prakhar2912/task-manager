import { useEffect, useState } from "react";

import API from "../api/client";

const initialForm = {
  title: "",
  description: "",
  due_date: "",
  priority: "medium",
  assigned_member_id: "",
  project_id: "",
  project_name: "",
  remarks: "",
};

export default function CreateTaskPage() {
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMembers() {
      try {
        const [membersResponse, projectsResponse] = await Promise.all([
          API.get("/members/"),
          API.get("/projects/"),
        ]);
        setMembers(membersResponse.data);
        setProjects(projectsResponse.data);
      } catch {
        setError("Unable to load assignment data.");
      }
    }

    fetchMembers();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      await API.post("/tasks/", formData);
      setMessage("Task assigned successfully.");
      setFormData(initialForm);
    } catch (requestError) {
      const details = requestError.response?.data;
      setError(typeof details === "object" ? JSON.stringify(details) : "Unable to create task.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr,0.85fr]">
      <section className="panel p-6">
        <h3 className="text-lg font-semibold text-slate-900">Assign New Task</h3>
        <p className="mt-1 text-sm text-slate-500">
          Define task details clearly so members can start work without confusion.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
            <input
              className="field"
              value={formData.title}
              onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              className="field min-h-32"
              value={formData.description}
              onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Due Date</label>
              <input
                type="date"
                className="field"
                value={formData.due_date}
                onChange={(event) => setFormData((current) => ({ ...current, due_date: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Priority</label>
              <select
                className="field"
                value={formData.priority}
                onChange={(event) => setFormData((current) => ({ ...current, priority: event.target.value }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Assign Member</label>
              <select
                className="field"
                value={formData.assigned_member_id}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, assigned_member_id: event.target.value }))
                }
                required
              >
                <option value="">Select member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.full_name} ({member.employee_id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Project</label>
              <select
                className="field"
                value={formData.project_id || ""}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    project_id: event.target.value,
                    project_name:
                      projects.find((project) => String(project.id) === event.target.value)?.name || "",
                  }))
                }
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Remarks / Instructions</label>
            <textarea
              className="field min-h-28"
              value={formData.remarks}
              onChange={(event) => setFormData((current) => ({ ...current, remarks: event.target.value }))}
              placeholder="Add detailed instructions, references, or delivery expectations."
            />
          </div>

          {message ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Assigning..." : "Assign Task"}
          </button>
        </form>
      </section>

      <section className="panel p-6">
        <h3 className="text-lg font-semibold text-slate-900">Assignment Notes</h3>
        <p className="mt-1 text-sm text-slate-500">A clear task brief reduces follow-up questions and delays.</p>

        <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
          <div className="rounded-2xl bg-slate-50 p-4">
            Include the exact outcome expected from the member in the description field.
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            Use remarks for process instructions, deliverables, dependencies, or stakeholder notes.
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            High-priority tasks should have precise due dates and concise acceptance criteria.
          </div>
        </div>
      </section>
    </div>
  );
}
