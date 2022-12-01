import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import CardHeader from "react-bootstrap/esm/CardHeader";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

import userService from "../services/userService";
import cartService from "../services/cartService";
import { login } from "../store/reducers/auth";

import Input from "../components/Input";
import CustomButton from "../components/CustomButton";
import { useCart } from "../store/Cart";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const usernameRef = React.useRef();
  const passwordRef = React.useRef();
  const [isWaiting, setIsWaiting] = useState(false);
  const { cartItems, setCartItems } = useCart();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    setIsWaiting(true);
    userService.login(username, password, cartItems).then((res) => {
      setIsWaiting(false);

      if (res.errorCode === 0) {
        dispatch(
          login({
            token: res.data.api_token,
            userInfo: res.data,
          })
        );
        cartService.listCart().then((res) => {
          if (res.errorCode === 0) {
            setCartItems(
              res.data.cart_detail.map((item) => ({
                id: item.ProDe_Id,
                quantity: item.CartDe_Quantity,
                select:
                  cartItems.find((items) => items.id === item.ProDe_Id)
                    ?.select || 0,
              }))
            );
          }
        });
        navigate("/");
        window.scrollTo(0, 0);
      } else {
        setMessage(res.message);
      }
    });
  };

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const handleBack = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="bg-icon bg-light">
      <Container>
        <div style={{ height: "10rem" }} />
        <Row className="justify-content-center align-items-center">
          <Col sm={8} lg={5}>
            <Card bg="primary">
              <CardHeader className=" bg-primary">
                <Card.Title className="mb-0">
                  <Row>
                    <Col className="align-self-center">
                      <i className="bi-grid-3x3-gap-fill" /> Login
                    </Col>
                    <Col className="p-0 text-end">
                      <CustomButton type="button" onClick={handleBack}>
                        <i className="fa fa-times" />
                      </CustomButton>
                    </Col>
                  </Row>
                </Card.Title>
              </CardHeader>

              <Card.Body className=" bg-white bg-icon">
                <p className="text-center text-danger">{message}</p>
                <Form onSubmit={handleFormSubmit}>
                  <Input
                    inputRef={usernameRef}
                    id="txtUserName"
                    autoComplete="off"
                    maxLength="50"
                    label="Username"
                    placeholder="Enter user name"
                  />
                  <Input
                    inputRef={passwordRef}
                    id="txtPassword"
                    label="Password"
                    placeholder="Enter password"
                    type="password"
                  />

                  <CustomButton
                    type="submit"
                    color="primary"
                    className="me-2 py-2 px-3 "
                    disabled={isWaiting}
                    isLoading={isWaiting}
                  >
                    Sign In
                  </CustomButton>

                  <Button as={NavLink} to="/SignUp" color="primary">
                    Sign Up
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div style={{ height: "10rem" }} />
      </Container>
    </div>
  );
};

export default Login;
