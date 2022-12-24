import React, { useState } from "react";
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
  Pagination,
} from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import formatCurrency from "../utilities/formatCurrency";

import { logout, updateInfo } from ".././store/reducers/auth";

import userService from "../services/userService";
import orderMemService from "../services/orderMemService";
import receiverService from "../services/receiverService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import CustomButton from "../components/CustomButton";
import Input from "../components/Input";
import CardHeader from "react-bootstrap/esm/CardHeader";
import { useEffect } from "react";

const User = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();

  // const [receiver, setReceiver] = useState([]);
  const [order, setOrder] = useState([]);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [orderPage, setOrderPage] = useState(0);
  const [orderPageLength] = useState(4);
  const [orderPagingItems, setOrderPagingItems] = useState([]);

  const [receiver, setReceiver] = useState([]);
  const [loadingReceiver, setLoadingReceiver] = useState(false);

  const loadReceiver = () => {
    setLoadingReceiver(true);
    setTimeout(function () {
      receiverService.list().then((res) => {
        console.log("load receiver here");
        setLoadingReceiver(false);
        setReceiver(res.data);
      });
    }, 2000);
  };

  const loadOrder = () => {
    setLoadingOrder(true);

    setTimeout(function () {
      orderMemService.getPaging(orderPage, orderPageLength).then((res) => {
        console.log("load order here");
        if (res.errorCode === 0) {
          setLoadingOrder(false);
          setOrder(res.data);
        }

        const last = res.pagingInfo.totalPages - 1;
        var left = orderPage - 2,
          right = orderPage + 2 + 1,
          range = [],
          rangeWithDots = [];
        let l;
        for (let i = 0; i <= last; i++) {
          if (i === 0 || i === last || (i >= left && i < right)) {
            range.push(i);
          }
        }
        //mũi tên
        if (res.pagingInfo.totalPages > 0) {
          rangeWithDots = [
            <Pagination.First
              key="frist"
              disabled={orderPage === 0}
              onClick={() => setOrderPage(0)}
            />,
            <Pagination.Prev
              key="Previous"
              disabled={orderPage === 0}
              onClick={() => setOrderPage(res.pagingInfo.page - 1)}
            />,
          ];
        }
        for (let i of range) {
          if (l) {
            if (i - l === 4) {
              rangeWithDots.push(<Pagination.Ellipsis key={l + 1} disabled />);
            } else if (i - l !== 1) {
              rangeWithDots.push(<Pagination.Ellipsis key="..." disabled />);
            }
          }
          rangeWithDots.push(
            <Pagination.Item
              key={i}
              active={i === orderPage}
              onClick={() => setOrderPage(i)}
            >
              {i + 1}
            </Pagination.Item>
          );
          l = i;
        }
        //mũi tên cuối
        rangeWithDots.push(
          <Pagination.Next
            key="Next"
            disabled={orderPage === res.pagingInfo.totalPages - 1}
            onClick={() => setOrderPage(res.pagingInfo.page + 1)}
          />,
          <Pagination.Last
            key="last"
            disabled={orderPage === res.pagingInfo.totalPages - 1}
            onClick={() => setOrderPage(res.pagingInfo.totalPages - 1)}
          />
        );
        setOrderPagingItems(rangeWithDots);
      });
    }, 5000);
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderPage]);

  useEffect(() => {
    loadReceiver();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setReceiver]);

  const [isWaiting, setIsWaiting] = useState(false);
  const navigate = useNavigate();

  //-------------------------Change Password-------------------------------------------
  const passwordRef = React.useRef();
  const newPasswordRef = React.useRef();
  const confirmPasswordRef = React.useRef();

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
        .oneOf([Yup.ref("newPassword")], "Your new password does not match."),
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
          navigate("/Login", window.scrollTo(0, 0));
          dispatch(logout());
          // setCartItems([]);
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
    if (e) e.preventDefault();

    const name = nameRef.current.value;
    const email = emailRef.current.value;

    setIsWaiting(true);

    userService.changeInfor(name, email).then((res) => {
      setIsWaiting(false);
      if (res.errorCode === 0) {
        toast.success("update profile successful");
        const newInfo = {
          ...userInfo,
          name: res.data.name,
          email: res.data.email,
        };
        dispatch(
          updateInfo({
            userInfo: newInfo,
          })
        );
      } else {
        toast.error(res.message);
      }
    });
  };

  //-------------------------Receiver (get add update delete)-------------------------------------------

  const [receiverModal, setReceiverModal] = useState(false);
  const closeReceiverModal = () => setReceiverModal(false);
  const showReceiverModal = () => setReceiverModal(true);

  const checkReceiver = useFormik({
    initialValues: {
      Re_Id: 0,
      name: "",
      phone: "",
      address: "",
      is_Default: 0,
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
    if (data.Re_Id === 0) {
      setIsWaiting(true);

      receiverService.newReceiver(data).then((res) => {
        setIsWaiting(false);
        if (res.errorCode === 0) {
          toast.success("Add Successful");

          loadReceiver();
          closeReceiverModal();
        } else {
          toast.error(res.message);
        }
      });
    } else {
      setIsWaiting(true);

      receiverService.updateReceiver(data.Re_Id, data).then((res) => {
        setIsWaiting(false);
        if (res.errorCode === 0) {
          toast.success("Update Successful");

          loadReceiver();
          closeReceiverModal();
        } else {
          toast.error(res.message);
        }
      });
    }
  };

  const showEditModal = (e, Re_Id) => {
    if (e) e.preventDefault();

    if (Re_Id > 0) {
      receiverService.get(Re_Id).then((res) => {
        if (res.errorCode === 0) {
          checkReceiver.setValues(res.data);
          showReceiverModal();
        } else {
          toast.error(res.message);
        }
      });
    } else {
      checkReceiver.resetForm();
      showReceiverModal();
    }
  };

  const handleDelete = (e, Re_Id) => {
    if (e) e.preventDefault();

    receiverService.deleteReceiver(Re_Id).then((res) => {
      if (res.errorCode === 0) {
        toast.success("Delete Successful");

        loadReceiver();
      } else {
        toast.error(res.message);
      }
    });
  };

  //-------------------------Receiver (default)-------------------------------------------

  const [defaultModal, setDefaultModal] = useState(false);
  const closeDefaultModal = () => setDefaultModal(false);
  const showDefaultModal = () => setDefaultModal(true);

  const checkDefault = useFormik({
    initialValues: {
      Re_Id: 0,
      is_Default: "",
    },

    onSubmit: (values) => {
      defaultSubmit(values);
    },
  });

  const defaultReceiver = (e, Re_Id, is_Default) => {
    if (e) e.preventDefault();

    checkDefault.setFieldValue("Re_Id", Re_Id);
    checkDefault.setFieldValue("is_Default", is_Default);
    showDefaultModal();
  };

  const defaultSubmit = (data) => {
    receiverService.defaultReceiver(data.Re_Id).then((res) => {
      if (res.errorCode === 0) {
        toast.success("Change Successful");
        loadReceiver();

        closeDefaultModal();
      } else {
        toast.error(res.message);
      }
    });
  };

  //-------------------------Show Order Info-------------------------------------------------
  const [orderInfoModal, setOrderInfoModal] = useState(false);
  const closeOrderInfo = () => setOrderInfoModal(false);
  const showOrderInfo = () => setOrderInfoModal(true);

  const orderFormik = useFormik({
    initialValues: {
      ORD_Id: 0,
      ORD_Code: "",
      ORD_Name: "",
      ORD_Address: "",
      ORD_Phone: "",
      ORD_CusNote: "",
      details: [],
    },

    onSubmit: (values) => {
      orderFormik(values);
    },
  });

  const showOrderInfoModal = (e, ORD_Id) => {
    if (e) e.preventDefault();

    orderMemService.get(ORD_Id).then((res) => {
      if (res.errorCode === 0) {
        orderFormik.setValues(res.data);

        showOrderInfo();
      }
    });
  };

  if (isLoggedIn) {
    return (
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
                      {/* -------------------------Account Info------------------------------------------- */}

                      <Tab.Pane
                        eventKey="account"
                        className="px-lg-5 pt-lg-2 px-sm-2"
                      >
                        <h1 className="pt-lg-2 ">Account</h1>
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

                      {/* -------------------------Change Password------------------------------------------- */}

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
                      {/* -------------------------Edit Profile------------------------------------------- */}

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

                      {/* -------------------------Receiver------------------------------------------- */}

                      <Tab.Pane
                        eventKey="receiver"
                        className="px-lg-5 pt-lg-2 px-sm-2"
                      >
                        <h1 className="pt-lg-2 pb-3 ">Receiver</h1>

                        <Table
                          responsive
                          borderless
                          className="bg-light rounded-4 bg-icon"
                        >
                          <tbody>
                            {loadingReceiver ? (
                              <tr className="align-middle text-center">
                                <td colSpan="6">
                                  <div className="spinner-border spinner-border-lg text-grey" />
                                </td>
                              </tr>
                            ) : (
                              <>
                                {receiver.length !== 0 ? (
                                  <>
                                    {receiver.map((list) => (
                                      <tr key={list.Re_Id}>
                                        {list.is_Default ? (
                                          <>
                                            <td className="py-3">
                                              <Form
                                                className="bg-primary"
                                                as={Button}
                                                onClick={(e) => {
                                                  defaultReceiver(
                                                    e,
                                                    list.Re_Id,
                                                    1
                                                  );
                                                }}
                                              />
                                            </td>

                                            <td className="border-bottom border-dark py-3">
                                              <Row sm={1}>
                                                <Col>
                                                  {list.name} | {list.phone}
                                                </Col>
                                                <Col className="text-muted fs-6">
                                                  {list.address}
                                                </Col>

                                                <Col
                                                  sm={12}
                                                  className=" fs-6 pt-2"
                                                >
                                                  <span className="text-danger border border-2 border-danger px-2">
                                                    Default
                                                  </span>
                                                </Col>
                                              </Row>
                                            </td>

                                            <td
                                              className=" py-3"
                                              style={{ width: "50px" }}
                                            >
                                              <a
                                                href="/#"
                                                onClick={(e) =>
                                                  showEditModal(e, list.Re_Id)
                                                }
                                              >
                                                <i className="bi-pencil-square text-primary" />
                                              </a>
                                              <a
                                                href="/#"
                                                onClick={(e) =>
                                                  handleDelete(e, list.Re_Id)
                                                }
                                              >
                                                <i className="bi-trash text-danger" />
                                              </a>
                                            </td>
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                      </tr>
                                    ))}

                                    {receiver.map((list) => (
                                      <tr key={list.Re_Id}>
                                        {!list.is_Default ? (
                                          <>
                                            <td className="py-3">
                                              <Form
                                                className="bg-secondary"
                                                as={Button}
                                                onClick={(e) => {
                                                  defaultReceiver(
                                                    e,
                                                    list.Re_Id,
                                                    list.is_Default
                                                  );
                                                }}
                                              />
                                            </td>

                                            <td className="border-bottom border-dark py-3">
                                              <Row sm={1}>
                                                <Col>
                                                  {list.name} | {list.phone}
                                                </Col>
                                                <Col className="text-muted fs-6">
                                                  {list.address}
                                                </Col>
                                              </Row>
                                            </td>

                                            <td
                                              className=" py-3"
                                              style={{ width: "50px" }}
                                            >
                                              <a
                                                href="/#"
                                                onClick={(e) =>
                                                  showEditModal(e, list.Re_Id)
                                                }
                                              >
                                                <i className="bi-pencil-square text-primary" />
                                              </a>
                                              <a
                                                href="/#"
                                                onClick={(e) =>
                                                  handleDelete(e, list.Re_Id)
                                                }
                                              >
                                                <i className="bi-trash text-danger" />
                                              </a>
                                            </td>
                                          </>
                                        ) : (
                                          <></>
                                        )}
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
                              </>
                            )}
                          </tbody>
                        </Table>
                      </Tab.Pane>

                      {/* -------------------------Order History------------------------------------------- */}

                      <Tab.Pane
                        eventKey="order-history"
                        className="px-lg-5 pt-lg-2 px-sm-2 "
                      >
                        <h1 className="pt-lg-2 pb-3">History</h1>

                        <Table
                          responsive
                          bordered
                          className="bg-light bg-icon text-center"
                        >
                          <thead>
                            <tr className="bg-primary align-middle">
                              <th>Order Id</th>
                              <th>Receiver</th>
                              <th>Date Order</th>
                              <th>Order Info</th>
                            </tr>
                          </thead>

                          <tbody>
                            {loadingOrder ? (
                              <tr className="align-middle">
                                <td colSpan="6">
                                  <div className="spinner-border spinner-border-lg text-grey" />
                                </td>
                              </tr>
                            ) : (
                              <>
                                {order.length !== 0 ? (
                                  <>
                                    {order.map((list) => (
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
                                    <td colSpan={4} className="py-3">
                                      <h1>You don't have any order!</h1>
                                    </td>
                                  </tr>
                                )}
                              </>
                            )}
                          </tbody>
                        </Table>
                        <Pagination className="mt-3 mb-0 justify-content-end">
                          {orderPagingItems}
                        </Pagination>
                      </Tab.Pane>
                    </Tab.Content>
                  </Card>
                </Col>
              </Row>
            </Tab.Container>
          </CardGroup>
        </Container>

        {/* -------------------------Modal Default------------------------------------------- */}
        <Modal show={defaultModal} onHide={closeDefaultModal}>
          <Modal.Header closeButton>
            <Modal.Title>Default Receiver</Modal.Title>
          </Modal.Header>
          {checkDefault.values.is_Default ? (
            <Modal.Body>
              <h4 className="text-center">
                Do you want to remove the default?
              </h4>
            </Modal.Body>
          ) : (
            <Modal.Body>
              <h4 className="text-center">
                Do you want this receiver to be the default?
              </h4>
            </Modal.Body>
          )}

          <Modal.Footer>
            <Button variant="secondary" onClick={closeDefaultModal}>
              No
            </Button>

            <Button variant="primary" onClick={checkDefault.handleSubmit}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* -------------------------Modal Receiver (get add update delete)------------------------------------------- */}
        <Modal show={receiverModal} onHide={closeReceiverModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              Receiver
              <small className="text-muted">
                {checkReceiver.values.Re_Id === 0 ? " new" : " edit"}
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
                  checkReceiver.touched.address && checkReceiver.errors.address
                }
              />

              <Form.Check
                type="switch"
                value={checkReceiver.values.is_Default}
                checked={checkReceiver.values.is_Default}
                onChange={() =>
                  checkReceiver.setFieldValue(
                    "is_Default",
                    checkReceiver.values.is_Default ? 0 : 1
                  )
                }
              />
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeReceiverModal}>
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

        {/* -------------------------Modal Order Info------------------------------------------------- */}

        <Modal
          dialogClassName="modal-90w"
          show={orderInfoModal}
          onHide={closeOrderInfo}
        >
          <Modal.Header className="bg-light bg-icon">
            <Modal.Title>
              Order{" "}
              <small className="text-muted">
                {orderFormik.values.ORD_Code}
              </small>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="bg-light bg-icon">
            <Row>
              <Col sm={6} lg={4}>
                <Row className="mb-3">
                  <Col sm="3" md={6}>
                    Receiver Name:
                  </Col>
                  <Col>{orderFormik.values.ORD_Name}</Col>
                </Row>

                <Row className="mb-3">
                  <Col sm="3" md={6}>
                    Phone:
                  </Col>
                  <Col>{orderFormik.values.ORD_Phone}</Col>
                </Row>

                <Row className="mb-3">
                  <Col sm="3" lg={2}>
                    Address:
                  </Col>
                  <Col>{orderFormik.values.ORD_Address}</Col>
                </Row>

                <Row className="mb-3">
                  <Col sm="3" lg={2}>
                    Note:
                  </Col>
                  <Col>{orderFormik.values.ORD_CusNote}</Col>
                </Row>
              </Col>

              <Card as={Col} className="border-primary me-2">
                <CardHeader as={Row} className="pt-3 pb-0">
                  <Card.Title as={Col}>
                    <h3>
                      Order <small className="text-muted">list</small>
                    </h3>
                  </Card.Title>
                </CardHeader>

                <Card.Body>
                  <Table
                    striped
                    responsive
                    bordered
                    hover
                    className="text-center"
                  >
                    <caption>List of Items</caption>
                    <thead>
                      <tr className="table-primary border-primary ">
                        <th style={{ width: "50px" }}>#</th>

                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderFormik.values.details.map((list, index) => (
                        <tr key={list.ORDe_Id}>
                          <td>{index + 1}</td>
                          <td>{list.product_detail.Pro_Name}</td>
                          <td>{list.ORDe_Quantity}</td>
                          <td>{formatCurrency(list.ORDe_Price)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="text-center">
                          Total:
                        </td>
                        <td>
                          {formatCurrency(
                            orderFormik.values.details.reduce(
                              (total, list) =>
                                (total = total + list.ORDe_Price),
                              0
                            )
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </Card.Body>
              </Card>
            </Row>
          </Modal.Body>

          <Modal.Footer className="bg-light bg-icon">
            <Button variant="secondary" onClick={closeOrderInfo}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </section>
    );
  } else {
    return navigate("/");
  }
};

export default User;
