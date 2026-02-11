import { AuthContext } from "./context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";


function AdminRoute() {
  const { user } = useContext(AuthContext);

  // Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Logged in but not admin
  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  // Admin user
  return <Outlet />;
}

export default AdminRoute;
