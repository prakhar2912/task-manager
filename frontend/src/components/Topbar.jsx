import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const mobileLinks =
    user?.role === "admin"
      ? [
          { to: "/admin", label: "Dashboard" },
          { to: "/admin/projects", label: "Projects" },
          { to: "/admin/members", label: "Employees" },
          { to: "/admin/tasks/new", label: "Tasks" },
        ]
      : [
          { to: "/member", label: "Tasks" },
          { to: "/member/projects", label: "Projects" },
        ];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/92 px-4 py-4 backdrop-blur-md md:px-6 lg:px-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="eyebrow">Workspace</div>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              {user?.role === "admin" ? "Admin Dashboard" : "Member Dashboard"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {user?.role === "admin"
                ? "Manage employees, assign work, and review progress."
                : "Review your assignments and update work status."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right sm:block">
              <div className="text-sm font-semibold text-slate-900">{user?.full_name || user?.username}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{user?.role}</div>
            </div>
            <button type="button" onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto lg:hidden">
          {mobileLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin" || link.to === "/member"}
              className={({ isActive }) =>
                [
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-brand-800 text-white"
                    : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100",
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
