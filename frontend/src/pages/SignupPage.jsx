import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../api/client";

const initialForm = {
  username: "",
  password: "",
  full_name: "",
  employee_id: "",
  email: "",
  department: "",
  phone: "",
  role: "member",
};

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await API.post("/auth/signup/", formData);
      navigate("/login", { replace: true });
    } catch (requestError) {
      const details = requestError.response?.data;

      if (typeof details === "object" && details !== null) {
        const formatted = Object.entries(details)
          .map(([key, value]) => {
            const message = Array.isArray(value) ? value.join(", ") : value;
            return `${key}: ${message}`;
          })
          .join(" | ");

        setError(formatted || "Unable to create account.");
      } else {
        setError(requestError.response?.data?.detail || "Unable to create account.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-panel sm:p-10">
        <div className="eyebrow">Create Account</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          Sign up for Task Manager
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Create your account to manage or complete team tasks.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
              <input
                className="field"
                value={formData.full_name}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, full_name: event.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
              <select
                className="field"
                value={formData.role}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, role: event.target.value }))
                }
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
              <input
                className="field"
                value={formData.username}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, username: event.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                className="field"
                value={formData.password}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, password: event.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Employee ID</label>
              <input
                className="field"
                value={formData.employee_id}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, employee_id: event.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                className="field"
                value={formData.email}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, email: event.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
              <input
                className="field"
                value={formData.department}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, department: event.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
              <input
                className="field"
                value={formData.phone}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, phone: event.target.value }))
                }
                required
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" className="btn-primary min-w-44" disabled={submitting}>
              {submitting ? "Creating..." : "Create Account"}
            </button>
            <Link to="/login" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
