import { Navigate, useLocation } from "react-router-dom";

export default function AdminRoute({ children }) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log("🛡️ AdminRoute check:", {
    path: location.pathname,
    tokenExists: !!token,
    role,
  });

  // ❌ Not logged in
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // ❌ Logged in but not admin
  if (role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Admin
  return children;
}
