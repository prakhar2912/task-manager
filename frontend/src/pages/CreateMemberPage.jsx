import { useEffect, useState } from "react";

import API from "../api/client";

const initialForm = {
  username: "",
  password: "",
  full_name: "",
  employee_id: "",
  email: "",
  department: "",
  phone: "",
};

export default function CreateMemberPage() {
  const [formData, setFormData] = useState(initialForm);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function fetchMembers() {
    try {
      const response = await API.get("/members/");
      setMembers(response.data);
    } catch {
      setError("Unable to load employee list.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      await API.post("/members/", formData);
      setMessage("Member account created successfully. Share the username and password offline.");
      setFormData(initialForm);
      fetchMembers();
    } catch (requestError) {
      const details = requestError.response?.data;
      setError(typeof details === "object" ? JSON.stringify(details) : "Unable to create member.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
      <section className="panel p-6">
        <h3 className="text-lg font-semibold text-slate-900">Create Employee Account</h3>
        <p className="mt-1 text-sm text-slate-500">
          Members do not sign up themselves. Admin creates and distributes credentials manually.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
              <input
                className="field"
                value={formData.full_name}
                onChange={(event) => setFormData((current) => ({ ...current, full_name: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Employee ID</label>
              <input
                className="field"
                value={formData.employee_id}
                onChange={(event) => setFormData((current) => ({ ...current, employee_id: event.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
              <input
                className="field"
                value={formData.username}
                onChange={(event) => setFormData((current) => ({ ...current, username: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                className="field"
                value={formData.password}
                onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              className="field"
              value={formData.email}
              onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
              <input
                className="field"
                value={formData.department}
                onChange={(event) => setFormData((current) => ({ ...current, department: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
              <input
                className="field"
                value={formData.phone}
                onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
                required
              />
            </div>
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
            {submitting ? "Creating..." : "Create Member"}
          </button>
        </form>
      </section>

      <section className="panel p-6">
        <h3 className="text-lg font-semibold text-slate-900">Employee Directory</h3>
        <p className="mt-1 text-sm text-slate-500">Use this list to confirm accounts and assignment ownership.</p>

        <div className="mt-5 space-y-4">
          {loading ? (
            <div className="text-sm text-slate-500">Loading employees...</div>
          ) : members.length ? (
            members.map((member) => (
              <div key={member.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">{member.full_name}</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {member.username} • {member.employee_id}
                    </p>
                  </div>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {member.department}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <div>Email: {member.email}</div>
                  <div>Phone: {member.phone}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              No employees created yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
