import React, { useState } from "react";
import { useCart } from "../store/Cart";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout } from ".././store/reducers/auth";
import {
  faSearch,
  faUser,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";

import { Navbar, Nav, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux/es/exports";
import { useDispatch } from "react-redux";

const Navbars = () => {
  const { openCart, cartQuantity, totalItem } = useCart();
  const [expanded, setExpanded] = useState(false);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();

  const scrollOnTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <Navbar
      expanded={expanded}
      sticky="top"
      expand="xl"
      className="py-lg-0 px-lg-5 bg-light bg-icon"
    >
      <Navbar.Brand className="ms-4 ms-lg-0">
        <Link to="/HomePage" onClick={scrollOnTop}>
          <h1 className="fw-bold text-primary m-0">
            F<span className="text-secondary">oo</span>dy
          </h1>
        </Link>
      </Navbar.Brand>

      <Navbar.Toggle
        onClick={() => setExpanded(expanded ? false : "expanded")}
        className="me-4"
      />
      <Navbar.Collapse onClick={() => setExpanded(false)}>
        <Nav className="ms-auto p-4 p-lg-0 h4 bg-light">
          <Row
            xs={"auto"}
            className="align-items-center justify-content-evenly"
          >
            <Col xs="12" xl="auto" onClick={scrollOnTop}>
              <Nav.Link as={NavLink} to="/">
                Home
              </Nav.Link>
            </Col>
            <Col xs="12" xl="auto" onClick={scrollOnTop}>
              <Nav.Link as={NavLink} to="/AboutUs">
                About Us
              </Nav.Link>
            </Col>
            <Col xs="12" xl="auto" onClick={scrollOnTop}>
              <Nav.Link as={NavLink} to="/OurProducts">
                Products
              </Nav.Link>
            </Col>
            <Col xs="12" xl="auto" onClick={scrollOnTop}>
              <Nav.Link as={NavLink} to="/ContactUs">
                Contact Us
              </Nav.Link>
            </Col>

            <Col xs="auto" onClick={scrollOnTop}>
              <Button
                as={NavLink}
                to="/HomePage"
                variant="outline-primary"
                className="rounded-circle"
              >
                <FontAwesomeIcon icon={faSearch} size="1x" color="#3cb815" />
              </Button>
            </Col>

            {isLoggedIn ? (
              <>
                <Col className="navbar-nav pt-2 bg-light" onClick={scrollOnTop}>
                  <Nav.Item>
                    Welcome{" "}
                    <Link to="/User" className="text-secondary">
                      {userInfo.name}
                    </Link>
                    <i
                      onClick={() => dispatch(logout())}
                      className="bi-box-arrow-right text-primary ms-2"
                    />
                  </Nav.Item>
                </Col>
              </>
            ) : (
              <>
                <Col xs="auto" onClick={scrollOnTop}>
                  <Button
                    as={NavLink}
                    to="/Login"
                    variant="outline-primary"
                    className="rounded-circle"
                  >
                    <FontAwesomeIcon icon={faUser} size="1x" color="#3cb815" />
                  </Button>
                </Col>
              </>
            )}

            <Col xs="auto">
              <Button
                onClick={openCart}
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  position: "relative",
                }}
                variant="outline-primary"
                className="rounded-circle "
              >
                <FontAwesomeIcon
                  icon={faShoppingBag}
                  size="1x"
                  color="#3cb815"
                />
                <div
                  className="rounded-circle d-flex justify-content-center bg-danger align-items-center"
                  style={{
                    color: "white",
                    width: "1.25rem",
                    height: "1.25rem",
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    transform: "translate(25%,25%)",
                  }}
                >
                  {cartQuantity}
                </div>
              </Button>
            </Col>

            <Col xs="auto">
              <Button
                onClick={openCart}
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  position: "relative",
                }}
                variant="outline-primary"
                className="rounded-circle "
              >
                <FontAwesomeIcon
                  icon={faShoppingBag}
                  size="1x"
                  color="#3cb815"
                />
                <div
                  className="rounded-circle d-flex justify-content-center bg-danger align-items-center"
                  style={{
                    color: "white",
                    width: "1.25rem",
                    height: "1.25rem",
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    transform: "translate(25%,25%)",
                  }}
                >
                  {totalItem}
                </div>
              </Button>
            </Col>
          </Row>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navbars;
