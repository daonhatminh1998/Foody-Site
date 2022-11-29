import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import CardHeader from "react-bootstrap/esm/CardHeader";
import { Card, Col, Container, Form, Row } from "react-bootstrap";

import userService from "../services/userService";
import cartService from "../services/cartServices";
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
                ProDe_Id: item.ProDe_Id,
                quantity: item.CartDe_Quantity,
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
                  <i className="bi-grid-3x3-gap-fill" /> Login
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
                    label="User name"
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
                    className="me-2"
                    disabled={isWaiting}
                    isLoading={isWaiting}
                  >
                    Sign in
                  </CustomButton>

                  <CustomButton
                    type="button"
                    color="primary"
                    className="px-3"
                    onClick={handleBack}
                  >
                    Back
                  </CustomButton>
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
