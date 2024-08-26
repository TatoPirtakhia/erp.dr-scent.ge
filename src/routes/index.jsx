import React from "react";
import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { protectedRoutes, publicRoutes } from "../configs/RoutesConfig";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AppRoute from "./AppRoute";
import { useSelector } from "react-redux";
import ErrorOne from "../views/auth-views/errors/error-page-1";

const Routes = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <>
      <RouterRoutes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute />}>
          {publicRoutes.map((route) => (
            <Route
              key={route.key}
              path={route.path}
              element={
                <AppRoute
                  routeKey={route.key}
                  component={route.component}
                  {...route.meta}
                />
              }
            />
          ))}
        </Route>

        {/* Redirect root to the authenticated entry point */}
        <Route path="*" element={<Navigate  to={'/'} replace />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute />}>
          {protectedRoutes.map((route, index) => (
            <Route
              key={route.key + index}
              path={route.path}
              element={
                !user || !route.user_type.includes(user?.user_type) ? (
                  <ErrorOne />
                ) : (
                  <AppRoute
                    routeKey={route.key}
                    component={route.component}
                    {...route.meta}
                  />
                )
              }
            />
          ))}
          {/* Handle unknown protected routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </RouterRoutes>
    </>
  );
};

export default Routes;
