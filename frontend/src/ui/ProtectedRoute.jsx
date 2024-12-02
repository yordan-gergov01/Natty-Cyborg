import { Navigate, Outlet } from "react-router";

function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem("jwToken");
  return isAuthenticated ? <Outlet /> : <Navigate to="/intro" />;
}

export default ProtectedRoute;
