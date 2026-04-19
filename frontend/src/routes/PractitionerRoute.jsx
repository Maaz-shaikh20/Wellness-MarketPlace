import { Navigate } from "react-router-dom";

export default function PractitionerRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const practitioner = JSON.parse(
    localStorage.getItem("practitioner")
  );

  // 🔒 Not logged in or not practitioner
  if (!token || role !== "PRACTITIONER") {
    return <Navigate to="/login" replace />;
  }

  // ⛔ Practitioner profile missing or not verified
  if (!practitioner || practitioner.verified !== true) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Verified practitioner
  return children;
}
