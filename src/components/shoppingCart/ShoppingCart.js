import {
  Button,
  Col,
  Form,
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
  const { closeCart, cartItem, productDetail, deleteAll } = useCart();

  const userInfo = useSelector((state) => state.auth.userInfo);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isWaiting, setIsWaiting] = useState(false);
  const dispatch = useDispatch();

  //-------------------------Show Receiver Modal-------------------------------------------------

  const [receiverModal, setReceiverModal] = useState(false);
  const closeReceiverModal = () => setReceiverModal(false);
  const showReceiverModal = () => setReceiverModal(true);

  //-------------------------Receiver (get add update delete)-------------------------------------------------

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
    if (data.id === 0) {
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
          handleModalClose();
        } else {
          toast.error("Add Failed");
        }
      });
    } else {
      setIsWaiting(true);

      userService.updateReceiver(data.id, data).then((res) => {
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
    if (e) e.preventDefault();

    userService.deleteReceiver(id).then((res) => {
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
        toast.error("Delete Failed");
      }
    });
  };

  //-------------------------Order Submit-------------------------------------------------

  const formiks = useFormik({
    initialValues: {
      id: 0,
    },

    onSubmit: (values) => {
      orderSubmit(values);
    },
  });

  const orderSubmit = (e) => {
    if (e) e.preventDefault();

    userService.order(formiks.values.id).then((res) => {
      if (res.errorCode === 0) {
        const newInfo = {
          ...userInfo,
          cart: res.data.cart,
          order: res.data.order,
        };
        dispatch(
          updateInfo({
            userInfo: newInfo,
          })
        );
        closeReceiverModal();
      }
    });
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
                  {formatCurrency(
                    cartItem.reduce((total, cartItem) => {
                      const item = productDetail.find(
                        (i) => i.ProDe_Id === cartItem.id
                      );
                      return total + (item?.Pro_Price || 0) * cartItem.quantity;
                    }, 0)
                  )}
                </span>
              </Col>
            </Row>

            <Button onClick={showReceiverModal} disabled={!cartItem.length}>
              Book Item
            </Button>
          </Stack>
        </Offcanvas.Body>
      </Offcanvas>
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
              {isLoggedIn ? (
                <>
                  {userInfo.receiver.length !== 0 ? (
                    <>
                      {userInfo.receiver.map((list) => (
                        <tr key={list.id}>
                          <td className="py-3">
                            {list.is_Default ? (
                              <Form.Check
                                type="radio"
                                name="receiver"
                                value={list.id}
                                defaultChecked
                                onChange={(e) => {
                                  formiks.setFieldValue("id", e.target.value);
                                }}
                              />
                            ) : (
                              <Form.Check
                                type="radio"
                                name="receiver"
                                value={list.id}
                                // onChange={hello}
                                onChange={(e) => {
                                  formiks.setFieldValue("id", e.target.value);
                                }}
                              />
                            )}
                          </td>
                          <td className="border-bottom border-dark py-3">
                            <Row sm={1}>
                              <Col>
                                {list.name} | {list.phone}
                              </Col>
                              <Col className="text-muted fs-6">
                                {list.address}
                              </Col>
                              {list.is_Default ? (
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

                          <td className=" py-3" style={{ width: "50px" }}>
                            <a
                              href="/#"
                              onClick={(e) => showEditModal(e, list.id)}
                            >
                              <i className="bi-pencil-square text-primary" />
                            </a>
                            <a
                              href="/#"
                              onClick={(e) => handleDelete(e, list.id)}
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
                </>
              ) : (
                <h5 className="text-center">
                  Please Login to use this function
                </h5>
              )}
              {isLoggedIn ? (
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
              ) : (
                <></>
              )}
            </tbody>
          </Table>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeReceiverModal}>
            Close
          </Button>
          {isLoggedIn ? (
            <Button type="submit" variant="primary" onClick={orderSubmit}>
              Confirm
            </Button>
          ) : (
            <></>
          )}
        </Modal.Footer>
      </Modal>
      {/* -------------------------funcion Receiver Modal (get add update delete)------------------------------------------------- */}

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
                checkReceiver.touched.address && checkReceiver.errors.address
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
  );
}
