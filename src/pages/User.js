import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Col,
  Row,
  Nav,
  ListGroup,
  Tab,
  Form,
  CardGroup,
  Table,
  Button,
  Modal,
} from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from ".././store/reducers/auth";
import userService from "../services/userService";
import ordersServices from "../services/ordersServices";

import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import CustomButton from "../components/CustomButton";
import Input from "../components/Input";

const User = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [isWaiting, setIsWaiting] = useState(false);
  const navigate = useNavigate();

  //-------------------------Change Password-------------------------------------------
  const passwordRef = React.useRef();
  const newPasswordRef = React.useRef();
  const confirmPasswordRef = React.useRef();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      password: Yup.string().required("Required").min(6),
      newPassword: Yup.string().required("Required").min(6),
      confirmPassword: Yup.string()
        .required("Required")
        .min(6)
        .oneOf([Yup.ref("newPassword")], "Your new password do not match."),
    }),

    onSubmit: (values) => {
      handleFormSubmit(values);
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const password = passwordRef.current.value;
    const newPassword = newPasswordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    setIsWaiting(true);

    userService
      .changePassword(password, newPassword, confirmPassword)
      .then((res) => {
        setIsWaiting(false);
        if (res.errorCode === 0) {
          toast.success("Change password successful");
          formik.resetForm();
          dispatch(logout());
          navigate("/Login");
        } else {
          toast.error(res.message);
        }
      });
  };

  //-------------------------Change User Info-------------------------------------------
  const nameRef = React.useRef();
  const emailRef = React.useRef();

  const changeInfo = useFormik({
    initialValues: {
      name: "",
      email: "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string().required("Required").email("abc@Email.com"),
    }),

    onSubmit: (values) => {
      infoSubmit(values);
    },
  });

  const editProfile = (e) => {
    if (e) e.preventDefault();
    changeInfo.setValues(userInfo);
  };

  const infoSubmit = (e) => {
    e.preventDefault();

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    setIsWaiting(true);

    userService.changeInfor(name, email).then((res) => {
      setIsWaiting(false);
      if (res.errorCode === 0) {
        toast.success("update profile successful");
      } else {
        toast.error(res.message);
      }
    });
  };

  //-------------------------Receiver (get add update delete)-------------------------------------------
  const [modalShow, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const checkReceiver = useFormik({
    initialValues: {
      id: 0,
      name: "",
      phone: "",
      address: "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      phone: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
    }),

    onSubmit: (values) => {
      receiverSubmit(values);
    },
  });

  const receiverSubmit = (data) => {
    console.log(data);
    if (data.id === 0) {
      setIsWaiting(true);

      userService.newReceiver(data).then((res) => {
        setIsWaiting(false);
        if (res.errorCode === 0) {
          toast.success("Add Successful");
          // loadData();
          handleModalClose();
        } else {
          toast.error("Add Failed");
        }
      });
    } else {
      setIsWaiting(true);
      console.log(data.id);
      userService.updateReceiver(data.id, data).then((res) => {
        setIsWaiting(false);
        if (res.errorCode === 0) {
          toast.success("Update Successful");
          // loadData();
          handleModalClose();
        } else {
          toast.error("Update Failed");
        }
      });
    }
  };

  const showEditModal = (e, id) => {
    if (e) e.preventDefault();

    if (id > 0) {
      userService.getReceiver(id).then((res) => {
        if (res.errorCode === 0) {
          checkReceiver.setValues(res.data);
          handleModalShow();
        }
      });
    } else {
      checkReceiver.resetForm();
      handleModalShow();
    }
  };

  const handleDelete = (e, id) => {
    e.preventDefault();

    userService.deleteReceiver(id).then((res) => {
      if (res.errorCode === 0) {
        toast.success("Delete Successful");
        loadData();
      } else {
        toast.error("Delete Failed");
      }
    });
  };

  const loadData = () => {
    // dispatch(login());
  };

  useEffect(() => {}, []);

  //-------------------------Show Order Info-------------------------------------------------
  const [orderInfoModal, setOrderInfoModal] = useState(false);
  const closeOrderInfo = () => setOrderInfoModal(false);
  const showOrderInfo = () => setOrderInfoModal(true);

  const orderFormik = useFormik({
    // initialValues: {
    //   id: 0,
    //   name: "",
    //   phone: "",
    //   address: "",
    // },

    // validationSchema: Yup.object({
    //   name: Yup.string().required("Required"),
    //   phone: Yup.string().required("Required"),
    //   address: Yup.string().required("Required"),
    // }),

    onSubmit: (values) => {
      orderFormik(values);
    },
  });

  const showOrderInfoModal = (e, OR_Id) => {
    if (e) e.preventDefault();
    ordersServices.get(OR_Id).then((res) => {
      if (res.errorCode === 0) {
        orderFormik.setValues(res.data);
        showOrderInfo();
      }
    });

    showOrderInfo();
  };

  return (
    <>
      {isLoggedIn ? (
        <section className=" my-5 bg-icon">
          <Container>
            <CardGroup className="bg-white shadow rounded-4 d-block d-sm-flex">
              <Tab.Container defaultActiveKey="account">
                <Row className="pb-3">
                  <Col md={5} lg={4} className="rounded-5">
                    <Card className="profile-tab-nav rounded-5 border-0">
                      <Card.Img
                        src={userInfo.bgimg}
                        className=" img-fluid rounded-4"
                      />
                      <Card.ImgOverlay>
                        <div className="img-circle text-center mb-3">
                          <Card.Img src={userInfo.avatar} className="shadow" />
                        </div>
                      </Card.ImgOverlay>

                      <Card.Title className="text-center ">
                        <h1>{userInfo.name} </h1>
                      </Card.Title>
                      <Card.Subtitle className="mb-2 text-muted text-center">
                        UId: {userInfo.Mem_Id}
                      </Card.Subtitle>

                      <Nav className="flex-column" variant="pills">
                        <ListGroup variant="flush">
                          <ListGroup.Item>
                            <Nav.Link eventKey="account">
                              <i className="fa fa-home text-center pe-4" />
                              Account
                            </Nav.Link>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <Nav.Link eventKey="change-password">
                              <i className="fa fa-key pe-1" />
                              Password
                            </Nav.Link>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <Nav.Link
                              eventKey="edit-profile"
                              onClick={editProfile}
                            >
                              <i className="bi-pencil-square pe-1" />
                              Edit Profile
                            </Nav.Link>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <Nav.Link eventKey="receiver">
                              <i className="bi-pencil-square pe-1" />
                              Receiver
                            </Nav.Link>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <Nav.Link eventKey="order-history">
                              <i className="bi-pencil-square pe-1" />
                              History
                            </Nav.Link>
                          </ListGroup.Item>
                        </ListGroup>
                      </Nav>
                    </Card>
                  </Col>

                  <Col>
                    <Card className=" border-0 pt-4 ">
                      <Tab.Content>
                        <Tab.Pane
                          eventKey="account"
                          className="px-lg-5 pt-lg-2 px-sm-2"
                        >
                          <h1 className="pt-lg-2">Account</h1>
                          <Container className="bg-light bg-icon rounded-4 py-5">
                            <Row sm={1}>
                              <Col>
                                <Row sm={2}>
                                  <Col sm={4}>Join date: </Col>
                                  <Col>{userInfo.created_at}</Col>
                                </Row>
                              </Col>

                              <Col>
                                <Row sm={2}>
                                  <Col sm={4}>Last seen: </Col>
                                  <Col>{userInfo.updated_at}</Col>
                                </Row>
                              </Col>

                              <Col>
                                <Row sm={2}>
                                  <Col sm={4}>Username: </Col>
                                  <Col>{userInfo.username}</Col>
                                </Row>
                              </Col>

                              <Col>
                                <Row sm={2}>
                                  <Col sm={4}>email: </Col>
                                  <Col>{userInfo.email}</Col>
                                </Row>
                              </Col>
                            </Row>
                          </Container>
                        </Tab.Pane>

                        <Tab.Pane
                          eventKey="change-password"
                          className="px-lg-5 pt-lg-2 px-sm-2"
                        >
                          <h1 className="pt-lg-2">Change Password</h1>
                          <Form
                            onSubmit={handleFormSubmit}
                            className="px-lg-5 pt-lg-5 pt-sm-2 px-sm-4"
                          >
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label
                                className="required"
                                as={Col}
                                sm={7}
                                lg={3}
                              >
                                Password
                              </Form.Label>
                              <Col sm={11} lg={8}>
                                <Form.Control
                                  ref={passwordRef}
                                  type="password"
                                  placeholder="Enter password"
                                  {...formik.getFieldProps("password")}
                                  isValid={
                                    formik.touched.password &&
                                    !formik.errors.password
                                  }
                                  isInvalid={
                                    formik.touched.password &&
                                    formik.errors.password
                                  }
                                />
                                <Form.Control.Feedback type="invalid">
                                  {formik.errors.password}
                                </Form.Control.Feedback>
                              </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2">
                              <Form.Label
                                className="required"
                                as={Col}
                                sm={7}
                                lg={3}
                              >
                                New Password
                              </Form.Label>
                              <Col sm={11} lg={8}>
                                <Form.Control
                                  ref={newPasswordRef}
                                  type="password"
                                  placeholder="Enter new password"
                                  {...formik.getFieldProps("newPassword")}
                                  isValid={
                                    formik.touched.newPassword &&
                                    !formik.errors.newPassword
                                  }
                                  isInvalid={
                                    formik.touched.newPassword &&
                                    formik.errors.newPassword
                                  }
                                />
                                <Form.Control.Feedback type="invalid">
                                  {formik.errors.newPassword}
                                </Form.Control.Feedback>
                              </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                              <Form.Label
                                className="required"
                                as={Col}
                                sm={7}
                                lg={3}
                              >
                                Confirm Password
                              </Form.Label>
                              <Col sm={11} lg={8}>
                                <Form.Control
                                  ref={confirmPasswordRef}
                                  type="password"
                                  placeholder="Enter password"
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
                              disabled={isWaiting}
                              isLoading={isWaiting}
                            >
                              Save
                            </CustomButton>
                          </Form>
                        </Tab.Pane>

                        <Tab.Pane
                          eventKey="edit-profile"
                          className="px-lg-5 pt-lg-2 px-sm-2"
                        >
                          <h1 className="pt-lg-2">Edit Profile</h1>
                          <Form
                            onSubmit={infoSubmit}
                            className="px-lg-5 pt-lg-5 pt-sm-2 px-sm-4"
                          >
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label
                                className="required"
                                as={Col}
                                sm={7}
                                lg={3}
                              >
                                name
                              </Form.Label>
                              <Col sm={11} lg={8}>
                                <Form.Control
                                  ref={nameRef}
                                  type="text"
                                  {...changeInfo.getFieldProps("name")}
                                  isValid={
                                    changeInfo.touched.name &&
                                    !changeInfo.errors.name
                                  }
                                  isInvalid={
                                    changeInfo.touched.name &&
                                    changeInfo.errors.name
                                  }
                                />
                                <Form.Control.Feedback type="invalid">
                                  {changeInfo.errors.name}
                                </Form.Control.Feedback>
                              </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2">
                              <Form.Label
                                className="required"
                                as={Col}
                                sm={7}
                                lg={3}
                              >
                                email
                              </Form.Label>
                              <Col sm={11} lg={8}>
                                <Form.Control
                                  ref={emailRef}
                                  type="email"
                                  {...changeInfo.getFieldProps("email")}
                                  isValid={
                                    changeInfo.touched.email &&
                                    !changeInfo.errors.email
                                  }
                                  isInvalid={
                                    changeInfo.touched.email &&
                                    changeInfo.errors.email
                                  }
                                />
                                <Form.Control.Feedback type="invalid">
                                  {changeInfo.errors.email}
                                </Form.Control.Feedback>
                              </Col>
                            </Form.Group>

                            <CustomButton
                              type="submit"
                              color="primary"
                              disabled={isWaiting}
                              isLoading={isWaiting}
                            >
                              Save
                            </CustomButton>
                          </Form>
                        </Tab.Pane>

                        <Tab.Pane
                          eventKey="receiver"
                          className="px-lg-5 pt-lg-2 px-sm-2"
                        >
                          <h1 className="pt-lg-2 pb-3">Receiver</h1>

                          <Table
                            responsive
                            borderless
                            className="bg-light rounded-4 bg-icon"
                          >
                            <tbody>
                              {userInfo.receiver.length !== 0 ? (
                                <>
                                  {userInfo.receiver.map((list) => (
                                    <tr key={list.id}>
                                      <td className="py-3">{list.is_Chosen}</td>
                                      <td className="border-bottom border-dark py-3">
                                        <Row sm={1}>
                                          <Col>
                                            {list.name} | {list.phone}
                                          </Col>
                                          <Col className="text-muted fs-6">
                                            {list.address}
                                          </Col>
                                          {list.is_Chosen ? (
                                            <Col sm={12} className=" fs-6 pt-2">
                                              <span className="text-danger border border-2 border-danger px-2">
                                                Default
                                              </span>
                                            </Col>
                                          ) : (
                                            <></>
                                          )}
                                        </Row>
                                      </td>

                                      <td
                                        className=" py-3"
                                        style={{ width: "50px" }}
                                      >
                                        <a
                                          href="/#"
                                          onClick={(e) =>
                                            showEditModal(e, list.id)
                                          }
                                        >
                                          <i className="bi-pencil-square text-primary" />
                                        </a>
                                        <a
                                          href="/#"
                                          onClick={(e) =>
                                            handleDelete(e, list.id)
                                          }
                                        >
                                          <i className="bi-trash text-danger" />
                                        </a>
                                      </td>
                                    </tr>
                                  ))}
                                </>
                              ) : (
                                <tr className="text-center ">
                                  <td colSpan={3} className="py-3">
                                    <h1>You don't have any receiver!</h1>
                                  </td>
                                </tr>
                              )}

                              <tr className="text-center ">
                                <td colSpan={3} className="py-3">
                                  <Button
                                    variant="primary"
                                    type="button"
                                    onClick={() => showEditModal(null, 0)}
                                  >
                                    <i className="bi-plus-lg" /> Add More
                                  </Button>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </Tab.Pane>

                        <Tab.Pane
                          eventKey="order-history"
                          className="px-lg-5 pt-lg-2 px-sm-2 "
                        >
                          <h1 className="pt-lg-2 pb-3">History</h1>

                          <Table
                            responsive
                            bordered
                            className="bg-light bg-icon text-center "
                          >
                            <thead>
                              <tr className="bg-primary align-middle">
                                <th>Id</th>
                                <th>Receiver</th>
                                <th>Date Order</th>
                                <th>Order Info</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userInfo.order.length !== 0 ? (
                                <>
                                  {userInfo.order.map((list) => (
                                    <tr key={list.ORD_Id}>
                                      <td>{list.ORD_Code}</td>
                                      <td>{list.ORD_Name}</td>
                                      <td>{list.ORD_DateTime}</td>
                                      <td>
                                        <Row sm={1}>
                                          <Col>View more</Col>
                                          <Col>
                                            <a
                                              href="/#"
                                              onClick={(e) =>
                                                showOrderInfoModal(
                                                  e,
                                                  list.ORD_Id
                                                )
                                              }
                                            >
                                              <i className="bi bi-eye-fill text-primary pe-2" />
                                            </a>
                                          </Col>
                                        </Row>
                                      </td>
                                    </tr>
                                  ))}
                                </>
                              ) : (
                                <tr className="text-center ">
                                  <td colSpan={3} className="py-3">
                                    <h1>You don't have any order!</h1>
                                  </td>
                                </tr>
                              )}

                              {/* <tr className="text-center ">
                                <td colSpan={3} className="py-3">
                                  <Button
                                    variant="primary"
                                    type="button"
                                    onClick={() => showEditModal(null, 0)}
                                  >
                                    <i className="bi-plus-lg" /> Add More
                                  </Button>
                                </td>
                              </tr> */}
                            </tbody>
                          </Table>
                        </Tab.Pane>
                      </Tab.Content>
                    </Card>
                  </Col>
                </Row>
              </Tab.Container>
            </CardGroup>
          </Container>

          <Modal show={modalShow} onHide={handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                Receiver
                <small className="text-muted">
                  {checkReceiver.values.id === 0 ? " new" : " edit"}
                </small>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Input
                  label="name"
                  maxLength="50"
                  required
                  formField={checkReceiver.getFieldProps("name")}
                  errMessage={
                    checkReceiver.touched.name && checkReceiver.errors.name
                  }
                />
                <Input
                  label="phone"
                  maxLength="50"
                  required
                  formField={checkReceiver.getFieldProps("phone")}
                  errMessage={
                    checkReceiver.touched.phone && checkReceiver.errors.phone
                  }
                />
                <Input
                  label="address"
                  maxLength="50"
                  required
                  formField={checkReceiver.getFieldProps("address")}
                  errMessage={
                    checkReceiver.touched.address &&
                    checkReceiver.errors.address
                  }
                />
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Close
              </Button>

              <CustomButton
                type="submit"
                color="primary"
                disabled={isWaiting}
                isLoading={isWaiting}
                onClick={checkReceiver.handleSubmit}
              >
                Save
              </CustomButton>
            </Modal.Footer>
          </Modal>

          <Modal
            dialogClassName="modal-90w"
            show={orderInfoModal}
            onHide={closeOrderInfo}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Order{" "}
                <small className="text-muted">
                  {/* {console.log(orderFormik.values.ORD_Code)} */}
                  {orderFormik.values.ORD_Code}
                </small>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Input
                  label="name"
                  maxLength="50"
                  required
                  formField={checkReceiver.getFieldProps("name")}
                  errMessage={
                    checkReceiver.touched.name && checkReceiver.errors.name
                  }
                />
                <Input
                  label="phone"
                  maxLength="50"
                  required
                  formField={checkReceiver.getFieldProps("phone")}
                  errMessage={
                    checkReceiver.touched.phone && checkReceiver.errors.phone
                  }
                />
                <Input
                  label="address"
                  maxLength="50"
                  required
                  formField={checkReceiver.getFieldProps("address")}
                  errMessage={
                    checkReceiver.touched.address &&
                    checkReceiver.errors.address
                  }
                />
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeOrderInfo}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </section>
      ) : (
        navigate("/")
      )}
    </>
  );
};

export default User;
