import React from "react";
import { Row, Col, Container, Pagination } from "react-bootstrap";
import Product from "./Product";
import { Link } from "react-router-dom";
import { useCart } from "../../store/Cart";

// product page
const Store = ({ loading }) => {
  const { pagingItems, productDetail } = useCart();

  if (loading) {
    return (
      <Container className="container-xxl py-5">
        {/* {console.log("This is Product's Page")} */}
        <Row className=" g-0 gx-5 align-items-end">
          <Col lg={6}>
            <div
              className="section-header text-start mb-5 wow fadeInUp"
              data-wow-delay="0.1s"
              style={{ maxWidth: "500px" }}
            >
              <h1 className="display-5 mb-3"> Our Products</h1>
              <p>
                Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum
                diam justo sed rebum vero dolor duo.
              </p>
            </div>
          </Col>
        </Row>

        <Row className="g-3">
          <Row className="g-3">
            {console.log(productDetail)}
            {productDetail.map((product) => (
              <Col
                md={4}
                xl={3}
                key={product.ProDe_Id}
                className="product-item position-relative bg-light overflow-hidden list-group-item"
              >
                <Product key={product.ProDe_Id} product={product} />
              </Col>
            ))}
          </Row>
          <Pagination className="mt-3 mb-0 justify-content-end">
            {pagingItems}
          </Pagination>
        </Row>
      </Container>
    );
  }
  return (
    <Container className="container-xxl py-5">
      {/* {console.log("This is Product's Page")} */}
      <Row className=" g-0 gx-5 align-items-end">
        <Col lg={6}>
          <div
            className="section-header text-start mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="display-5 mb-3"> Our Products</h1>
            <p>
              Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam
              justo sed rebum vero dolor duo.
            </p>
          </div>
        </Col>
      </Row>

      <Row className="g-3">
        {productDetail.slice(0, 8).map((product) => (
          <Col
            md={4}
            xl={3}
            key={product.ProDe_Id}
            className="product-item position-relative bg-light overflow-hidden list-group-item"
          >
            <Product key={product.ProDe_Id} product={product} />
          </Col>
        ))}
      </Row>

      <Row className="text-center pt-2">
        <Col>
          <Link
            className="btn btn-primary rounded-pill py-3 px-5"
            to="/OurProducts"
            onClick={() => {
              window.scrollTo(0, 0);
            }}
          >
            Browse More Products
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Store;
