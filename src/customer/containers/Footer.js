import React from "react";
import {
  faEnvelope,
  faLocationDot,
  faPhoneAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faYoutube,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <>
      <div
        className="container-fluid bg-dark footer mt-5 pt-5 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <Container className=" py-5">
          <Row className=" g-5">
            <Col lg={3} md={6}>
              <h1 className="fw-bold text-primary mb-4">
                F<span className="text-secondary">oo</span>dy
              </h1>
              <p>
                Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita
                erat ipsum et lorem et sit, sed stet lorem sit clita
              </p>
              <div className="d-flex pt-2">
                <a
                  className="btn btn-square btn-outline-light rounded-circle me-1"
                  href="https://twitter.com"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a
                  className="btn btn-square btn-outline-light rounded-circle me-1"
                  href="https://facebook.com"
                >
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a
                  className="btn btn-square btn-outline-light rounded-circle me-1"
                  href="https://youtube.com"
                >
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
                <a
                  className="btn btn-square btn-outline-light rounded-circle me-0"
                  href="https://linkedIn.com"
                >
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <h4 className="text-light mb-4">Address</h4>
              <p>
                <FontAwesomeIcon icon={faLocationDot} className="me-3" />
                123 Street, New York, USA
              </p>
              <p>
                <FontAwesomeIcon icon={faPhoneAlt} className="me-3" />
                +012 345 67890
              </p>
              <p>
                <FontAwesomeIcon icon={faEnvelope} className="me-3" />
                info@example.com
              </p>
            </Col>
            <Col lg={3} md={6}>
              <h4 className="text-light mb-4">Quick Links</h4>
              <Link className="btn btn-link" to="/AboutUS">
                About Us
              </Link>
              <Link className="btn btn-link" to="/ContactUs">
                Contact Us
              </Link>
              <Link className="btn btn-link" to="/#">
                Our Services
              </Link>
              <Link className="btn btn-link" to="/#">
                Terms &amp; Condition
              </Link>
              <Link className="btn btn-link" to="/#">
                Support
              </Link>
            </Col>
            <Col lg={3} md={6}>
              <h4 className="text-light mb-4">Newsletter</h4>
              <p>Dolor amet sit justo amet elitr clita ipsum elitr est.</p>
              <div
                className="position-relative mx-auto"
                style={{ maxWidth: "400px" }}
              >
                <input
                  className="form-control bg-transparent w-100 py-3 ps-4 pe-5"
                  type="text"
                  placeholder="Your email"
                />
                <button
                  type="button"
                  className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2"
                >
                  SignUp
                </button>
              </div>
            </Col>
          </Row>
        </Container>
        <div className="container-fluid copyright">
          <Container className="container">
            <Row>
              <Col md={6} className=" text-center text-md-start mb-3 mb-md-0">
                © <a href="/#">Your Site Name</a>, All Right Reserved.
              </Col>
              <Col md={6} className=" text-center text-md-end">
                Designed By <a href="/https://htmlcodex.com">HTML Codex</a>
                <br />
                Distributed By:{" "}
                <a href="/https://themewagon.com" target="_blank">
                  ThemeWagon
                </a>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Footer;
