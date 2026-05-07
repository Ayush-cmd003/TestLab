import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import {Loader} from "../Loader/Loader"

export default function ProtectedRoute() {
  const { isAuth, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}