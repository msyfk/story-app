import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth"; // Sesuaikan path ini jika berbeda

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!getToken(); // Memeriksa apakah token ada

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
