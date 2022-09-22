import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./containers/AdminLayout";

const Admin = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<AdminLayout />} />
      </Routes>
    </>
  );
};

export default Admin;
