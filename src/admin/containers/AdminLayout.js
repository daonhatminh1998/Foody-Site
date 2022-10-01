import React from "react";

import AdminNavBar from "./AdminNavbar";
import { Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import adminRoutes from "../routes";
import { useSelector } from "react-redux";

const AdminLayout = () => {
  const path = "/admin/login";
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <>
      {isLoggedIn ? (
        <>
          <AdminNavBar />
          <Container>
            <Routes>
              {adminRoutes.map((route, idx) => (
                <Route key={idx} path={route.path} element={route.component} />
              ))}
            </Routes>
          </Container>
        </>
      ) : (
        <Navigate to={path} />
      )}
    </>
  );
};

export default AdminLayout;
