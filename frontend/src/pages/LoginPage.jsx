import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const user = await login(formData);
      const defaultRoute = user.role === "admin" ? "/admin" : "/member";
      const from = location.state?.from?.pathname;
      navigate(from && from !== "/login" ? from : defaultRoute, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Invalid username or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white/95 shadow-panel lg:grid-cols-[1.15fr,0.85fr]">
        <div className="relative hidden overflow-hidden bg-brand-900 px-10 py-12 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(191,219,254,0.18),transparent_28%)]" />
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.3em] text-brand-300">Task Manager</div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">
              Secure task coordination for admin and employee teams.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-brand-200">
              Manage projects, assign tasks, and track progress in one place.
            </p>

            <div className="mt-12 grid gap-4">
              <div className="rounded-[24px] border border-brand-700 bg-brand-800/70 p-5">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">Admin Flow</h2>
                <p className="mt-3 text-sm leading-6 text-brand-100">
                  Create projects, manage members, and assign tasks.
                </p>
              </div>
              <div className="rounded-[24px] border border-brand-700 bg-brand-800/70 p-5">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">Member Flow</h2>
                <p className="mt-3 text-sm leading-6 text-brand-100">
                   View tasks, update status, and add progress notes.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-10 sm:px-10 lg:px-12">
          <div className="mx-auto w-full max-w-md">
            <div className="eyebrow">Welcome Back</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Login to your workspace</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Create a new account with sign up, or log in with your existing admin/member credentials.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
                <input
                  className="field"
                  value={formData.username}
                  onChange={(event) => setFormData((current) => ({ ...current, username: event.target.value }))}
                  placeholder="Enter username"
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
                  placeholder="Enter password"
                  required
                />
              </div>

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <button type="submit" className="btn-primary w-full" disabled={submitting}>
                {submitting ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="mt-8 rounded-[22px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
              New here?{" "}
              <Link to="/signup" className="font-semibold text-brand-700 hover:text-brand-800">
                Create an account
              </Link>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
