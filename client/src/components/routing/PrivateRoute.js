import React from "react";
import { useSelector } from "react-redux";
import { Route, Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const auth = useSelector(state => state.auth);

  return auth.isAuthenticated ? children : <Navigate to='/login' />;
}

export default PrivateRoute;
