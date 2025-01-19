import React from "react";
import { Navigate } from "react-router-dom";

const ManagerPrivateRoute = ({ element: component }) => {
  const AccessToken = localStorage.getItem("Authtoken");

  if (!AccessToken) {
    return <Navigate to="/login" replace />;
  }

  return component;
};

export default ManagerPrivateRoute;
