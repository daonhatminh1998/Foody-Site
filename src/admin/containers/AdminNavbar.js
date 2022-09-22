import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/reducers/auth";
import { Container, Navbar, Nav } from "react-bootstrap";

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [expanded, setExpanded] = useState(false);

  const scrollOnTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Navbar
        expanded={expanded}
        className="bg-light"
        sticky="top"
        expand="xl"
        onClick={scrollOnTop}
      >
        <Container>
          <Navbar.Brand
            as={NavLink}
            to="/admin/AdminPage"
            onClick={() => setExpanded(false)}
          >
            <h1 className="fw-bold text-primary m-0">Admin Page</h1>
          </Navbar.Brand>

          <Navbar.Toggle
            className="me-4"
            onClick={() => setExpanded(expanded ? false : "expanded")}
          />
          <Navbar.Collapse onClick={() => setExpanded(false)}>
            <Nav className="h4 bg-light ms-auto">
              <Nav.Link as={NavLink} to="/admin/ProductDetail">
                Product Detail
              </Nav.Link>
              <Nav.Link as={NavLink} to="/admin/Products">
                Products
              </Nav.Link>
              <Nav.Link as={NavLink} to="/admin/Customers">
                Customers
              </Nav.Link>
              <Nav.Link as={NavLink} to="/admin/Orders">
                Orders
              </Nav.Link>
              <Nav.Link as={NavLink} to="/admin/OrderDetail">
                Order Detail
              </Nav.Link>

              <ul className="navbar-nav bg-light">
                <li className="nav-item">
                  <Nav.Link as={NavLink} to="/">
                    Welcome to {userInfo.fullName}
                  </Nav.Link>
                </li>
                <li className="nav-item">
                  <Nav.Link
                    onClick={() => dispatch(logout())}
                    as={NavLink}
                    to="/"
                  >
                    <i className="bi-box-arrow-right" />
                  </Nav.Link>
                </li>
              </ul>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
