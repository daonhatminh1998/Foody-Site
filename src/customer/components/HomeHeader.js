import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
const HomeHeader = () => {
  return (
    <>
      <div
        id="top"
        className="container-fluid p-0 mb-5 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div
          id="header-carousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                className="w-100"
                src={`${process.env.PUBLIC_URL}/img/carousel-1.jpg`}
                alt=""
              />

              <div className="carousel-caption">
                <div className="container">
                  <div className="row justify-content-start">
                    <div className="col-lg-7">
                      <h1 className="display-2 mb-5 animated slideInDown">
                        Organic Food Is Good For Health
                      </h1>
                      <Row sm={"auto"}>
                        <Col>
                          <Link
                            to="/OurProducts"
                            className="btn btn-primary rounded-pill py-sm-3 px-sm-5"
                          >
                            Products
                          </Link>
                        </Col>
                        <Col>
                          <Link
                            to="/ContactUs"
                            className="btn btn-secondary rounded-pill py-sm-3 px-sm-5 ms-3"
                          >
                            Contact Us
                          </Link>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img
                className="w-100"
                src={`${process.env.PUBLIC_URL}/img/carousel-2.jpg`}
                alt=""
              />
              <div className="carousel-caption">
                <div className="container">
                  <div className="row justify-content-start">
                    <div className="col-lg-7">
                      <h1 className="display-2 mb-5 animated slideInDown">
                        Natural Food Is Always Healthy
                      </h1>
                      <Link
                        to="/OurProducts"
                        className="btn btn-primary rounded-pill py-sm-3 px-sm-5"
                      >
                        Products
                      </Link>
                      <a
                        href="/#"
                        className="btn btn-secondary rounded-pill py-sm-3 px-sm-5 ms-3"
                      >
                        Services
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </>
  );
};
export default HomeHeader;
