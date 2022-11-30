import React from "react";
import About from "../components/About";
import Features from "../components/Features";
import Firm from "../components/Firm";
import OtherHeader from "../components/header/OtherHeader";

const AboutUs = () => {
  return (
    <>
      <OtherHeader label="About Us" />
      <About />
      <Firm />
      <Features />
    </>
  );
};

export default AboutUs;
