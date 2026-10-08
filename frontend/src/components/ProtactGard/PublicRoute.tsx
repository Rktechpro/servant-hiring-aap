import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export const PublicRoute = () => {
  const user = useAuthStore((state) => state.user);

  console.log("PUBLIC ROUTE USER:", user);
  console.log("PUBLIC ROUTE ROLE:", user?.role);

  if (user?.role === "SERVANT") {
    return <Navigate to="/dashboard-servant" replace />;
  }

  if (user?.role === "CUSTOMER") {
    return <Navigate to="/dashboard-customer" replace />;
  }

  return <Outlet />;
};
