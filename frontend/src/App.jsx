import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CreateMemberPage from "./pages/CreateMemberPage";
import ProjectManagementPage from "./pages/ProjectManagementPage";
import CreateTaskPage from "./pages/CreateTaskPage";
import LoginPage from "./pages/LoginPage";
import MemberDashboardPage from "./pages/MemberDashboardPage";
import SignupPage from "./pages/SignupPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="projects" element={<ProjectManagementPage />} />
        <Route path="members" element={<CreateMemberPage />} />
        <Route path="tasks/new" element={<CreateTaskPage />} />
      </Route>

      <Route
        path="/member"
        element={
          <ProtectedRoute allowedRoles={["member"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MemberDashboardPage />} />
        <Route path="projects" element={<ProjectManagementPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
