import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CardHeader from "react-bootstrap/esm/CardHeader";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

import userService from "../services/userService";

import CustomButton from "../components/CustomButton";

import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const SignUp = () => {
  const navigate = useNavigate();
  const [isWaiting, setIsWaiting] = useState(false);

  const usernameRef = React.useRef();
  const nameRef = React.useRef();
  const emailRef = React.useRef();
  const passwordRef = React.useRef();
  const confirmPasswordRef = React.useRef();

  const formik = useFormik({
    initialValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      username: Yup.string().required("Required").min(6),
      name: Yup.string().required("Required"),
      email: Yup.string().required("Required").email("abc@Email.com"),
      password: Yup.string().required("Required").min(6),
      confirmPassword: Yup.string()
        .required("Required")
        .min(6)
        .oneOf([Yup.ref("password")], "Your confirm password does not match."),
    }),

    onSubmit: (values) => {
      handleFormSubmit(values);
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    setIsWaiting(true);
    userService
      .register(username, name, email, password, confirmPassword)
      .then((res) => {
        setIsWaiting(false);

        if (res.errorCode === 0) {
          toast.success("Register successful");
          formik.resetForm();
          navigate("/Login");
          window.scrollTo(0, 0);
        } else {
          toast.error(res.message);
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
                  <Row className="row-cols-2">
                    <Col className="align-self-center">
                      <i className="bi-grid-3x3-gap-fill" /> Sign Up
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
                <Form onSubmit={handleFormSubmit}>
                  <Form.Group as={Row} className="mb-2">
                    <Form.Label className="required" as={Col} sm={7} lg={3}>
                      Username
                    </Form.Label>
                    <Col sm={11} lg={8}>
                      <Form.Control
                        ref={usernameRef}
                        placeholder="Enter user name"
                        type="text"
                        {...formik.getFieldProps("username")}
                        isValid={
                          formik.touched.username && !formik.errors.username
                        }
                        isInvalid={
                          formik.touched.username && formik.errors.username
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.username}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-2">
                    <Form.Label className="required" as={Col} sm={7} lg={3}>
                      name
                    </Form.Label>
                    <Col sm={11} lg={8}>
                      <Form.Control
                        ref={nameRef}
                        placeholder="Enter name"
                        type="text"
                        {...formik.getFieldProps("name")}
                        isValid={formik.touched.name && !formik.errors.name}
                        isInvalid={formik.touched.name && formik.errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.name}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-2">
                    <Form.Label className="required" as={Col} sm={7} lg={3}>
                      email
                    </Form.Label>
                    <Col sm={11} lg={8}>
                      <Form.Control
                        ref={emailRef}
                        placeholder="Enter email"
                        type="email"
                        {...formik.getFieldProps("email")}
                        isValid={formik.touched.email && !formik.errors.email}
                        isInvalid={formik.touched.email && formik.errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.email}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-2">
                    <Form.Label className="required" as={Col} sm={7} lg={3}>
                      Password
                    </Form.Label>
                    <Col sm={11} lg={8}>
                      <Form.Control
                        ref={passwordRef}
                        type="password"
                        placeholder="Enter password"
                        {...formik.getFieldProps("password")}
                        isValid={
                          formik.touched.password && !formik.errors.password
                        }
                        isInvalid={
                          formik.touched.password && formik.errors.password
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.password}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label className="required" as={Col} sm={7} lg={3}>
                      Confirm Password
                    </Form.Label>
                    <Col sm={11} lg={8}>
                      <Form.Control
                        ref={confirmPasswordRef}
                        type="password"
                        placeholder="Enter confirm password"
                        {...formik.getFieldProps("confirmPassword")}
                        isValid={
                          formik.touched.confirmPassword &&
                          !formik.errors.confirmPassword
                        }
                        isInvalid={
                          formik.touched.confirmPassword &&
                          formik.errors.confirmPassword
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>

                  <CustomButton
                    type="submit"
                    color="primary"
                    className="me-2 py-2 px-3 "
                    disabled={isWaiting}
                    isLoading={isWaiting}
                  >
                    Sign Up
                  </CustomButton>

                  <Button
                    as={NavLink}
                    to="/Login"
                    color="primary"
                    className="me-2 px-3 "
                  >
                    Sign in
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

export default SignUp;
