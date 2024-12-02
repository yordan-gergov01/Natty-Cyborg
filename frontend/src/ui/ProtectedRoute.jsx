import { Navigate, Outlet } from "react-router";
import AppLayout from "./AppLayout";

function ProtectedRoute() {
  const isAuthenticated = !!localStorage.getItem("jwtToken");
  return isAuthenticated ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/intro" />
  );
}

export default ProtectedRoute;
