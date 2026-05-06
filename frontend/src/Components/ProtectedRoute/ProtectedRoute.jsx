import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function ProtectedRoute() {
  const { isAuth, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}