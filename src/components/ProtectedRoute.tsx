import { Navigate } from "react-router-dom";

import React from "react";
import axios from "axios";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const AuthenticateRoute = ({ children }: ProtectedRouteProps) => {
  // Cek login dari localStorage (atau context/state)
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
 const IsAuthenticatedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export { AuthenticateRoute, IsAuthenticatedRoute };
