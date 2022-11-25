import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Modal,
  Offcanvas,
  Row,
  Stack,
  Table,
} from "react-bootstrap";
import { useCart } from "../../store/Cart";
import { CartItem } from "./CartItem";
import { useState } from "react";

import formatCurrency from "../../utilities/formatCurrency";

import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import userService from "../../services/userService";
import { updateInfo } from ".././../store/reducers/auth";

import CustomButton from "../CustomButton";
import Input from "../Input";

export function ShoppingCart({ isOpen }) {
  const { closeCart, cartItem, deleteAll } = useCart();

  const userInfo = useSelector((state) => state.auth.userInfo);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isWaiting, setIsWaiting] = useState(false);
  const dispatch = useDispatch();

  //-------------------------Show Receiver Modal-------------------------------------------------

  const [receiverModal, setReceiverModal] = useState(false);
  const closeReceiverModal = () => setReceiverModal(false);
  const showReceiverModal = () => setReceiverModal(true);

  const checkChosen = useFormik({
    initialValues: {
      Re_Id: 0,
    },

    onSubmit: (values) => {
      chosenSubmit(values);
    },
  });

  const chosenSubmit = (data) => {
    setIsWaiting(true);
    console.log(data.Re_Id);
    userService.chosenReceiver(data.Re_Id).then((res) => {
      setIsWaiting(false);
      if (res.errorCode === 0) {
        toast.success("Add Successful");
        const newInfo = {
          ...userInfo,
          receiver: res.data.receiver,
        };
        dispatch(
          updateInfo({
            userInfo: newInfo,
          })
        );

        closeReceiverModal();
        showOrderModal();
      } else {
        toast.error(res.message);
      }
    });
  };

  //-------------------------Receiver (get add update delete)-------------------------------------------------

  const [modalShow, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

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

      userService.newReceiver(data).then((res) => {
        setIsWaiting(false);
        if (res.errorCode === 0) {
          toast.success("Add Successful");
          const newInfo = {
            ...userInfo,
            receiver: res.data.receiver,
          };
          dispatch(
            updateInfo({
              userInfo: newInfo,
            })
          );
          if (data.is_Default) {
            showOrderModal();
            handleModalClose();
          }
          handleModalClose();
        } else {
          toast.error(res.message);
        }
      });
    } else {
      setIsWaiting(true);

      userService.updateReceiver(data.Re_Id, data).then((res) => {
        setIsWaiting(false);
        if (res.errorCode === 0) {
          toast.success("Update Successful");
          const newInfo = {
            ...userInfo,
            receiver: res.data.receiver,
          };
          dispatch(
            updateInfo({
              userInfo: newInfo,
            })
          );
          handleModalClose();
        } else {
          toast.error(res.message);
        }
      });
    }
  };

  const showEditModal = (e, Re_Id) => {
    if (e) e.preventDefault();

    if (Re_Id > 0) {
      userService.getReceiver(Re_Id).then((res) => {
        if (res.errorCode === 0) {
          checkReceiver.setValues(res.data);
          handleModalShow();
        } else {
          toast.error(res.message);
        }
      });
    } else {
      checkReceiver.resetForm();
      checkReceiver.setFieldValue("Re_Id", Re_Id);
      handleModalShow();
    }
  };

  const handleDelete = (e, Re_Id) => {
    if (e) e.preventDefault();

    userService.deleteReceiver(Re_Id).then((res) => {
      if (res.errorCode === 0) {
        toast.success("Delete Successful");
        const newInfo = {
          ...userInfo,
          receiver: res.data.receiver,
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

  //-------------------------Show Order Modal-------------------------------------------------

  const [orderModal, setOrderModal] = useState(false);
  const closeOrderModal = () => setOrderModal(false);
  const showOrderModal = () => setOrderModal(true);

  const resetReceiver = () => {
    if (isLoggedIn) {
      userService.reset().then((res) => {
        if (res.errorCode === 0) {
          const newInfo = {
            ...userInfo,
            receiver: res.data.receiver,
          };
          dispatch(
            updateInfo({
              userInfo: newInfo,
            })
          );
        }
        showOrderModal();
      });
    }
  };

  const orderSubmit = (e, Re_Id) => {
    if (e) e.preventDefault();
    console.log(Re_Id);
    // userService.order(Re_Id).then((res) => {
    //   if (res.errorCode === 0) {
    //     const newInfo = {
    //       ...userInfo,
    //       cart: res.data.cart,
    //       order: res.data.order,
    //     };
    //     dispatch(
    //       updateInfo({
    //         userInfo: newInfo,
    //       })
    //     );
    //     closeReceiverModal();
    //   }
    // });
  };

  return (
    <>
      <Offcanvas
        show={isOpen}
        onHide={closeCart}
        scroll={true}
        placement="end"
        backdrop={true}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="h2">Cart </Offcanvas.Title>
          <Button
            variant="warning"
            onClick={() => deleteAll()}
            disabled={!cartItem.length}
          >
            Clear All
          </Button>
        </Offcanvas.Header>

        <Offcanvas.Body className="justify-content-center">
          <Stack gap={3}>
            {cartItem.map((item, index) => (
              <CartItem key={index} {...item} />
            ))}
            <Row>
              <Col>
                <span className=" fw-bold fs-5">Total:</span>
              </Col>
              <Col sm="auto">
                <span className="fw-bold fs-5">
                  {isLoggedIn
                    ? formatCurrency(userInfo.cart.total)
                    : formatCurrency(0)}
                </span>
              </Col>
            </Row>

            <Button onClick={resetReceiver} disabled={!cartItem.length}>
              Book Item
            </Button>
          </Stack>
        </Offcanvas.Body>
      </Offcanvas>

      {/* -------------------------Show Order Modal------------------------------------------------- */}
      {isLoggedIn ? (
        <>
          <Modal
            show={orderModal}
            onHide={closeOrderModal}
            scrollable={true}
            // dialogClassName="modal-80w"
          >
            <Modal.Header closeButton>
              <Modal.Title>Order</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {userInfo.cart.total !== 0 ? (
                <>
                  {userInfo.receiver.length !== 0 ? (
                    <>
                      {userInfo.receiver.map((list) => (
                        <div key={list.Re_Id}>
                          {list.is_Chosen ? (
                            <Card
                              as={Button}
                              onClick={() => {
                                checkChosen.setFieldValue("Re_Id", list.Re_Id);
                                showReceiverModal();
                                closeOrderModal();
                              }}
                              className="bg-light text-black border-dark bg-icon text-start"
                            >
                              <Card.Body>
                                <Card.Title as="h4" className="text-center">
                                  Receiver
                                </Card.Title>
                                <Row className="row-cols-1">
                                  <Col>
                                    <span className="h4">Name: </span>
                                    {list.name} |
                                    <span className="h4"> Phone: </span>
                                    {list.phone}
                                  </Col>

                                  <Col>
                                    <span className="h4">Address: </span>
                                    {list.address}
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          ) : (
                            ""
                          )}
                        </div>
                      ))}
                      {/* --------------------------------------adddddadddadadadasddasdadad */}
                      {userInfo.receiver.map((list) => (
                        <div key={list.Re_Id}>
                          {!list.is_Default ? (
                            <Row className="text-center pb-3">
                              <h1>Please chose receiver!</h1>
                              <Button
                                variant="primary"
                                onClick={() => {
                                  showReceiverModal();
                                  closeOrderModal();
                                }}
                              >
                                Select Receiver
                              </Button>
                            </Row>
                          ) : (
                            ""
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <Row className="text-center pb-3">
                      <h1>Please chose receiver!</h1>
                      <Button
                        variant="primary"
                        onClick={() => {
                          showReceiverModal();
                          closeOrderModal();
                        }}
                      >
                        Select Receiver
                      </Button>
                    </Row>
                  )}

                  {userInfo.cart.cart_detail.map((item) => (
                    <div key={item.ProDe_Id}>
                      {item.is_Selected ? (
                        <>
                          <Row className="d-flex align-items-center p-2 bg-light ">
                            <Col>
                              <Row sm={3}>
                                <Col className="p-0">
                                  <Image
                                    src={item.product_detail.Pro_Avatar}
                                    className="img-fluid"
                                  />
                                </Col>

                                <Col className="px-2 ">
                                  <Col>{item.product_detail.Pro_Name}</Col>
                                  <Col>x {item.CartDe_Quantity}</Col>
                                  <Col className="fs-6">
                                    {formatCurrency(item.CartDe_Price)}
                                  </Col>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <h4 className="text-center">
                  You haven't chosen any product yet. Please go back and select
                  at least one product.
                </h4>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={closeOrderModal}>
                Close
              </Button>
              {userInfo.cart.total !== 0 ? (
                <>
                  {userInfo.receiver.length !== 0 ? (
                    <>
                      {userInfo.receiver.map((list) => (
                        <span key={list.Re_Id}>
                          {list.is_Default ? (
                            <Button
                              type="submit"
                              variant="primary"
                              onClick={(e) => orderSubmit(e, list.Re_Id)}
                            >
                              Confirm
                            </Button>
                          ) : (
                            ""
                          )}
                        </span>
                      ))}
                    </>
                  ) : (
                    <>
                      <Button type="submit" variant="primary" disabled>
                        Confirm
                      </Button>
                    </>
                  )}
                </>
              ) : (
                ""
              )}
            </Modal.Footer>
          </Modal>

          {/* -------------------------Show Receiver Modal------------------------------------------------- */}

          <Modal
            show={receiverModal}
            onHide={closeReceiverModal}
            scrollable="true"
            dialogClassName="modal-80w"
          >
            <Modal.Header closeButton>
              <Modal.Title>Receiver</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Table responsive borderless className=" rounded-4 bg-icon">
                <tbody>
                  {userInfo.receiver.length !== 0 ? (
                    <>
                      {userInfo.receiver.map((list) => (
                        <tr key={list.Re_Id}>
                          {list.is_Default ? (
                            <>
                              <td className="py-3">
                                <Form.Check
                                  type="radio"
                                  name="receiver"
                                  value={list.Re_Id}
                                  defaultChecked
                                  onChange={(e) => {
                                    checkChosen.setFieldValue(
                                      "Re_Id",
                                      e.target.value
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

                                  <Col sm={12} className=" fs-6 pt-2">
                                    <span className="text-danger border border-2 border-danger px-2">
                                      Default
                                    </span>
                                  </Col>
                                </Row>
                              </td>

                              <td className=" py-3" style={{ width: "50px" }}>
                                <a
                                  href="/#"
                                  onClick={(e) => showEditModal(e, list.Re_Id)}
                                >
                                  <i className="bi-pencil-square text-primary" />
                                </a>
                                <a
                                  href="/#"
                                  onClick={(e) => handleDelete(e, list.Re_Id)}
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

                      {userInfo.receiver.map((list) => (
                        <tr key={list.Re_Id}>
                          {!list.is_Default && list.is_Chosen ? (
                            <>
                              <td className="py-3">
                                <Form.Check
                                  type="radio"
                                  name="receiver"
                                  defaultChecked
                                  value={list.Re_Id}
                                  onChange={(e) => {
                                    checkChosen.setFieldValue(
                                      "Re_Id",
                                      e.target.value
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

                              <td className=" py-3" style={{ width: "50px" }}>
                                <a
                                  href="/#"
                                  onClick={(e) => showEditModal(e, list.Re_Id)}
                                >
                                  <i className="bi-pencil-square text-primary" />
                                </a>
                                <a
                                  href="/#"
                                  onClick={(e) => handleDelete(e, list.Re_Id)}
                                >
                                  <i className="bi-trash text-danger" />
                                </a>
                              </td>
                            </>
                          ) : (
                            <>
                              {!list.is_Default && !list.is_Chosen ? (
                                <>
                                  <td className="py-3">
                                    <Form.Check
                                      type="radio"
                                      name="receiver"
                                      value={list.Re_Id}
                                      onChange={(e) => {
                                        checkChosen.setFieldValue(
                                          "Re_Id",
                                          e.target.value
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
                            </>
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
                </tbody>
              </Table>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  closeReceiverModal();
                  showOrderModal();
                }}
              >
                Close
              </Button>

              <Button
                type="submit"
                variant="primary"
                onClick={checkChosen.handleSubmit}
              >
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>

          {/* -------------------------Receiver Modal (get add update delete)------------------------------------------------- */}

          <Modal show={modalShow} onHide={handleModalClose}>
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
                    checkReceiver.touched.address &&
                    checkReceiver.errors.address
                  }
                />

                <Form.Check
                  type="switch"
                  label="default"
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
        </>
      ) : (
        <h5 className="text-center">Please Login to use this function</h5>
      )}
    </>
  );
}
