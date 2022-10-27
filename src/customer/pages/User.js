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
    <div className="bg-light bg-icon pb-5">
      <Card>
        <Card.Img
          variant="top"
          src={userInfo[0].bgImg}
          style={{ height: "350px" }}
          className=" rounded-5 rounded-top d-block"
        />

        <Card.Img
          variant="top"
          src={userInfo[0].avatar}
          style={{ width: "20%" }}
          className="img-thumbnail img-fluid rounded-circle border-dark"
        />

        <Card.Title className="text-center">
          <span className="text-muted h2">Hello, </span>
          <span className="text-primary display-1">{userInfo[0].fullName}</span>
          <Card.Subtitle className="mb-2 text-muted">
            UId: {userInfo[0].id}
          </Card.Subtitle>
        </Card.Title>
      </Card>

      <Container className="mt-4">
        <Card style={{ width: "100%" }}>
          <Card.Header>
            <Card.Title className="text-center h3">Your Information</Card.Title>
          </Card.Header>

          <Card.Body className="bg-icon">
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
      </Container>
    </div>
  );
};

export default User;
