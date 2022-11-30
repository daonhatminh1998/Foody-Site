import React from "react";
import { Container, Row } from "react-bootstrap";
import OtherHeader from "../components/header/OtherHeader";
import Store from "../components/ourProducts/Store";

const OurProducts = () => {
  return (
    <>
      <OtherHeader label="Products" />
      <Container className="container-xxl py-5">
        <div className="tab-content">
          <Row className="g-4">
            <Store loading={true} />
          </Row>
        </div>
      </Container>
    </>
  );
};

export default OurProducts;
