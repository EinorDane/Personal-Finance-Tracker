import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/authentication/sign-in" />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};
