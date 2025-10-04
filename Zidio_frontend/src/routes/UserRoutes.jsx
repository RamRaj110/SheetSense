// components/UserRoute.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {jwtDecode} from "jwt-decode";

export default function UserRoute({ children }) {
  const token = useSelector((state) => state.auth.token);

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.isAdmin) {
      return <Navigate to="/unauthorized" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return children;
}
