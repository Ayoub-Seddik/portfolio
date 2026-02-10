import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { isAdminLoggedIn } from "./adminAuth";
import AdminLogin from "./AdminLogin";

export default function AdminGuard() {
  const navigate = useNavigate();

  if (!isAdminLoggedIn()) {
    return <AdminLogin onSuccess={() => navigate("/admin/dashboard")} />;
  }

  return <Outlet />;
}
