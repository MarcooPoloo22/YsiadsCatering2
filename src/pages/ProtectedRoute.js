import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role }) => {
  const userRole = localStorage.getItem("role"); // Assuming role is stored in localStorage

  if (userRole !== role) {
    // Redirect to home page if the user is not an admin
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;