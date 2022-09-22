import React from "react";
import Header from "./Header";
import { Routes, Route } from "react-router-dom";
import routes from "../routes";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { CartProvider } from "../store/Cart";

const DefaultLayout = () => {
  return (
    <>
      <CartProvider>
        <Header />
        <Navbar />
        <Routes>
          {routes.map((route, idx) => (
            <Route key={idx} path={route.path} element={route.component} />
          ))}
        </Routes>
        <Footer />
      </CartProvider>
    </>
  );
};

export default DefaultLayout;
