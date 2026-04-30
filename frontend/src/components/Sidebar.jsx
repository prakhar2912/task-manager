import { NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const adminLinks = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/members", label: "Employees" },
  { to: "/admin/tasks/new", label: "Assign Task" },
];

const memberLinks = [
  { to: "/member", label: "My Tasks" },
  { to: "/member/projects", label: "Projects" },
];

export default function Sidebar() {
  const { user } = useAuth();
  const links = user?.role === "admin" ? adminLinks : memberLinks;

  return (
    <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-slate-200 bg-brand-900 px-6 py-8 text-white lg:flex">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-brand-300">Task Manager</div>
        <h1 className="mt-4 text-2xl font-semibold text-white">Operations Workspace</h1>
        <p className="mt-3 text-sm leading-6 text-brand-200">
          Track tasks, employee assignments, and work progress from one secure dashboard.
        </p>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/admin" || link.to === "/member"}
            className={({ isActive }) =>
              [
                "rounded-xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-white text-brand-900"
                  : "text-brand-100 hover:bg-brand-800 hover:text-white",
              ].join(" ")
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-[22px] border border-brand-700 bg-brand-800/80 p-4">
        <div className="text-xs uppercase tracking-[0.25em] text-brand-300">Logged in as</div>
        <div className="mt-2 text-base font-semibold">{user?.full_name || user?.username}</div>
        <div className="mt-1 text-sm text-brand-200">{user?.role === "admin" ? "Administrator" : "Member"}</div>
      </div>
    </aside>
  );
}
