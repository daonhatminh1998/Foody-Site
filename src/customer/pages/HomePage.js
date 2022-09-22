import React from "react";
import About from "../components/About";
import Blog from "../components/Blog";
import Features from "../components/Features";
import Firm from "../components/Firm";
import HomeHeader from "../components/HomeHeader";
import Store from "../components/ourProducts/Store";
import Testimonial from "../components/Testimonial";

const HomePage = () => {
  return (
    <>
      <HomeHeader />
      <About />
      <Features />
      <Store />
      <Firm />
      <Testimonial />
      <Blog />
    </>
  );
};

export default HomePage;
