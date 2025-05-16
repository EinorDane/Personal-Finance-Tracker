/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React, { useState, useMemo, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import routes from "./routes";
import SignIn from "views/SignIn";
import SignUp from "views/SignUp";
import Dashboard from "views/Dashboard";
import Transactions from "views/Transactions";
import Budgets from "views/Budgets";
import Reports from "views/Reports";
import Goals from "views/Goals";
import ProtectedRoute from "components/ProtectedRoute";
import { useMaterialUIController } from "context";

export default function App() {
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const location = useLocation();
  const hideSidenav = location.pathname.startsWith("/authentication");

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {!hideSidenav && (
        <>
          <Sidenav color={sidenavColor} brandName="Material Dashboard 2" routes={routes} />
          <Configurator />
        </>
      )}
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budgets"
          element={
            <ProtectedRoute>
              <Budgets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          }
        />
        <Route path="/authentication/sign-in" element={<SignIn />} />
        <Route path="/authentication/sign-up" element={<SignUp />} />
        <Route path="/" element={<Navigate to="/authentication/sign-in" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </ThemeProvider>
  );
}
