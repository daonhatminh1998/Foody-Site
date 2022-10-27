import React from "react";
import { Container, Row, Col, Carousel, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import Input from "../../admin/components/Input";
import userService from "../../services/userService";

import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import CustomButton from "../../admin/components/CustomButton";

const User = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const passwordRef = React.useRef();
  const newPasswordRef = React.useRef();

  const formik = useFormik({
    initialValues: {
      username: "",
      fullname: "",
      phone: "",
      email: "",
      newpassword: "",
    },

    onSubmit: (values) => {
      handleFormSubmit(values);
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const password = passwordRef.current.value;
    const newPassword = newPasswordRef.current.value;

    userService.update(userInfo.username, password).then((res) => {
      if (res.errorCode === 0) {
        toast.success("Update Successful");
      } else {
        toast.error("Update Failed");
      }
    });
  };

  return (
    <div className="bg-light">
      <Container className=" bg-icon mt-4 p-3">
        <Row>
          <Col lg={7}>
            <Card>
              <Card.Header>
                <Card.Title className="text-center">
                  <span className="text-muted h2">Hello, </span>
                  <span className="text-primary display-1">
                    {userInfo[0].fullName}
                  </span>
                  <Card.Subtitle className="mb-2 text-muted">
                    UId: {userInfo[0].id}
                  </Card.Subtitle>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Card.Title className="h3">Your Information:</Card.Title>
                <Card.Text> </Card.Text>
                <Card.Text>User Name: {userInfo[0].username}</Card.Text>
                <Card.Text>Phone: {userInfo[0].phone}</Card.Text>
                <Card.Text>Email: {userInfo[0].email}</Card.Text>
                <Card.Text>Token: {userInfo[0].token}</Card.Text>
                <Input
                  inputRef={passwordRef}
                  id="txtPassword"
                  label="Password"
                  placeholder="Enter password"
                  type="password"
                />
                <Input
                  inputRef={newPasswordRef}
                  id="txtNewPassword"
                  label="New Password"
                  placeholder="Enter new password"
                  type="password"
                />

                <CustomButton color="primary" onClick={formik.handleSubmit}>
                  Save
                </CustomButton>
              </Card.Body>
              <Card.Footer className="text-muted">footer</Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default User;
