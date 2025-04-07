"use client";

import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";

interface ProtectedRouteProps {
  role: "user" | "coordinator" | "admin";
}

const ProtectedRoute = ({ role }: ProtectedRouteProps) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role === "admin" && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (
    role === "coordinator" &&
    user.role !== "coordinator" &&
    user.role !== "admin"
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
