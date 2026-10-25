import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export const PublicRoute = () => {
  const user = useAuthStore((state) => state.user);

  if (user?.role === "SERVANT") {
    return <Navigate to="/" replace />;
  }

  if (user?.role === "CUSTOMER") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
