import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    
    // If route requires admin access
    if (adminOnly && !decoded.isAdmin) {
      return <Navigate to="/unauthorized" replace />;
    }

    // If route is for normal users only
    if (!adminOnly && decoded.isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
  } catch (err) {
    console.error("Invalid token:", err);
    return <Navigate to="/login" replace />;
  }
}