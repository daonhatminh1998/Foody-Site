import {
  Button,
  Card,
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
import orderCusService from "../../services/orderCusService";

import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useSelector } from "react-redux";
import receiverService from "../../services/receiverService";

import CustomButton from "../CustomButton";
import Input from "../Input";
import { Item } from "./ItemSelect";
import { useNavigate } from "react-router-dom";
import orderMemService from "../../services/orderMemService";

export function ShoppingCart({ isOpen }) {
  const {
    closeCart,
    cartItems,
    items,
    clearCart,
    removeItem,
    receiver,
    loadData,
  } = useCart();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isWaiting, setIsWaiting] = useState(false);

  //-------------------------Show Customer Modal + Order-------------------------------------------------
  const [customerModal, setCustomerModal] = useState(false);
  const closeCustomerModal = () => setCustomerModal(false);
  const showCustomerModal = () => setCustomerModal(true);

  var phoneRegEx =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const formik = useFormik({
    initialValues: {
      Cus_Id: 0,
      ORD_Name: "",
      ORD_Address: "",
      Cus_Email: "",
      Cus_Phone: "",
    },

    validationSchema: Yup.object({
      ORD_Name: Yup.string().required("Required"),
      ORD_Address: Yup.string().required("Address cannot be empty"),
      Cus_Email: Yup.string().email("abc@Email.com"),
      Cus_Phone: Yup.string()
        .required("Required")
        .matches(phoneRegEx, "Invalid Phone format")
        .min(10, "Too short")
        .max(10, "Too long"),
    }),

    onSubmit: (values) => {
      cusOrderSubmit(values);
      formik.resetForm();
    },
  });

  const cusOrderSubmit = (data) => {
    const details = [];
    cartItems.map((item) =>
      item.select
        ? details.push({
            id: item.id,
            ORDe_Quantity: item.quantity,
          })
        : 0
    );

    const order = {
      ORD_Name: data.ORD_Name,
      ORD_Address: data.ORD_Address,
      ORD_CusNote: data.ORD_CusNote,
      customer: {
        Cus_Email: data.Cus_Email,
        Cus_Phone: data.Cus_Phone,
      },
      details: details,
    };

    orderCusService.add(order).then((res) => {
      // console.log(res);
      if (res.errorCode === 0) {
        toast.success("Order submitted");

        removeItem();
        closeOrderModal();
        closeCustomerModal();

        // localStorage.removeItem("shopping-cart");
        navigate("/", window.scrollTo(0, 0));
      } else {
        toast.error(res.message);
      }
    });
  };

  //-------------------------Receiver (get add update delete)-------------------------------------------------

  const [receiverFunctionModal, setReceiverFunctionModal] = useState(false);
  const closeReceiverFunctionModal = () => setReceiverFunctionModal(false);
  const showReceiverFunctionModal = () => setReceiverFunctionModal(true);

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
          checkChosen.setFieldValue("Re_Id", res.data.Re_Id);
          loadData();

          closeReceiverFunctionModal();
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
          if (res.data.is_Default && res.data.is_Chosen) {
            checkChosen.setFieldValue("Re_Id", res.data.Re_Id);
          }
          loadData();

          closeReceiverFunctionModal();
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
          showReceiverFunctionModal();
        } else {
          toast.error(res.message);
        }
      });
    } else {
      checkReceiver.resetForm();
      checkReceiver.setFieldValue("Re_Id", Re_Id);
      showReceiverFunctionModal();
    }
  };

  const handleDelete = (e, Re_Id) => {
    if (e) e.preventDefault();

    receiverService.deleteReceiver(Re_Id).then((res) => {
      if (res.errorCode === 0) {
        if (res.data) {
          setReceiverOrder([]);
        }
        loadData();
        toast.success("Delete Successful");
      } else {
        toast.error(res.message);
      }
    });
  };

  //-------------------------Show Receiver Modal-------------------------------------------------

  const [receiverModal, setReceiverModal] = useState(false);
  const closeReceiverModal = () => setReceiverModal(false);
  const showReceiverModal = () => setReceiverModal(true);

  const [receiverOrder, setReceiverOrder] = useState([]);
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
    // console.log(data.Re_Id);
    receiverService.chosenReceiver(data.Re_Id).then((res) => {
      setIsWaiting(false);
      if (res.errorCode === 0) {
        toast.success("Select Successful");
        loadData();
        setReceiverOrder(res.data);

        closeReceiverModal();
        showOrderModal();
      } else {
        toast.error(res.message);
      }
    });
  };

  //-------------------------Show Member Order Modal-------------------------------------------------

  const [orderModal, setOrderModal] = useState(false);
  const closeOrderModal = () => setOrderModal(false);
  const showOrderModal = () => setOrderModal(true);

  const resetReceiver = () => {
    receiverService.reset().then((res) => {
      if (res.errorCode === 0) {
        if (res.data) {
          setReceiverOrder(res.data);
        } else {
          setReceiverOrder([]);
        }
        loadData();
        showOrderModal();
      }
    });
  };

  const order = useFormik({
    initialValues: {
      ORD_CusNote: "",
    },

    onSubmit: (values) => {
      orderSubmit(values);
      // order.resetForm();
    },
  });

  const orderSubmit = (data) => {
    const details = [];
    cartItems.map((item) =>
      item.select
        ? details.push({
            id: item.id,
            quantity: item.quantity,
          })
        : 0
    );

    const order = {
      Re_Id: receiverOrder.Re_Id,
      ORD_CusNote: data.ORD_CusNote,
      details: details,
    };

    // const cart = { cartItem: cartItems };
    // cartService.updateCart(cart);

    orderMemService.order(order).then((res) => {
      console.log(res);
      if (res.errorCode === 0) {
        toast.success("Order submitted");
        loadData();
        removeItem();
        closeOrderModal();
        closeCustomerModal();
        navigate("/", window.scrollTo(0, 0));
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
            onClick={() => clearCart()}
            disabled={!cartItems.length}
          >
            Clear All
          </Button>
        </Offcanvas.Header>

        <Offcanvas.Body className="justify-content-center">
          <Stack gap={3}>
            {cartItems.map((item, index) => (
              <CartItem key={index} {...item} />
            ))}
            <Row>
              <Col>
                <span className=" fw-bold fs-5">Total:</span>
              </Col>
              <Col sm="auto">
                <span className="fw-bold fs-5">
                  {formatCurrency(
                    cartItems.reduce((total, cartItem) => {
                      const item = items.find(
                        (i) =>
                          i.ProDe_Id === cartItem.id && cartItem.select === 1
                      );
                      return total + (item?.Pro_Price || 0) * cartItem.quantity;
                    }, 0)
                  )}
                </span>
              </Col>
            </Row>

            <Button
              onClick={() =>
                isLoggedIn ? resetReceiver() : showCustomerModal()
              }
              disabled={
                !cartItems.reduce((count, cartItem) => {
                  if (cartItem.select === 1) count++;
                  return count;
                }, 0)
              }
            >
              Book Item
            </Button>
          </Stack>
        </Offcanvas.Body>
      </Offcanvas>

      {isLoggedIn ? (
        <>
          {/* -------------------------Receiver Modal------------------------------------------------- */}

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
                  {receiver.length !== 0 ? (
                    <>
                      {receiver.map((list) => (
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

                      {receiver.map((list) => (
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

          <Modal
            show={receiverFunctionModal}
            onHide={closeReceiverFunctionModal}
          >
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
              <Button variant="secondary" onClick={closeReceiverFunctionModal}>
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
        <>
          {/* -------------------------Customer Infor Modal------------------------------------------------- */}

          <Modal
            show={customerModal}
            onHide={closeCustomerModal}
            scrollable="true"
          >
            <Modal.Header closeButton>
              <Modal.Title>Delivery Information</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      {...formik.getFieldProps("ORD_Name")}
                      isValid={
                        formik.touched.ORD_Name && !formik.errors.ORD_Name
                      }
                      isInvalid={
                        formik.touched.ORD_Name && formik.errors.ORD_Name
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.ORD_Name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="6">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      {...formik.getFieldProps("Cus_Phone")}
                      isValid={
                        formik.touched.Cus_Phone && !formik.errors.Cus_Phone
                      }
                      isInvalid={
                        formik.touched.Cus_Phone && formik.errors.Cus_Phone
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.Cus_Phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      {...formik.getFieldProps("ORD_Address")}
                      isValid={
                        formik.touched.ORD_Address && !formik.errors.ORD_Address
                      }
                      isInvalid={
                        formik.touched.ORD_Address && formik.errors.ORD_Address
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.ORD_Address}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      {...formik.getFieldProps("Cus_Email")}
                      isValid={
                        formik.touched.Cus_Email && !formik.errors.Cus_Email
                      }
                      isInvalid={
                        formik.touched.Cus_Email && formik.errors.Cus_Email
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.Cus_Email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group>
                    <Form.Label>Note</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      type="text"
                      {...formik.getFieldProps("ORD_CusNote")}
                    />
                  </Form.Group>
                </Row>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={closeCustomerModal}>
                Close
              </Button>

              <Button
                type="submit"
                variant="primary"
                disabled={!formik.dirty || !formik.isValid}
                onClick={() => {
                  showOrderModal();
                  closeCustomerModal();
                }}
              >
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}

      {/* -------------------------Order Modal------------------------------------------------- */}

      <Modal
        show={orderModal}
        onHide={closeOrderModal}
        scrollable={true}
        // dialogClassName="modal-80w"
      >
        <Modal.Header closeButton>
          <Modal.Title>Order</Modal.Title>
        </Modal.Header>

        {isLoggedIn ? (
          <Modal.Body>
            {receiverOrder.length !== 0 ? (
              <>
                <Card
                  as={Button}
                  onClick={() => {
                    checkChosen.setFieldValue("Re_Id", receiverOrder.Re_Id);
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
                        {receiverOrder.name} |
                        <span className="h4"> Phone: </span>
                        {receiverOrder.phone}
                      </Col>

                      <Col>
                        <span className="h4">Address: </span>
                        {receiverOrder.address}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
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
            <Row className="mb-3">
              <Form>
                <Form.Group>
                  <Form.Label>Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    type="text"
                    {...order.getFieldProps("ORD_CusNote")}
                  />
                </Form.Group>
              </Form>
            </Row>
            {cartItems.map((item, index) => (
              <Item key={index} {...item} />
            ))}
          </Modal.Body>
        ) : (
          <Modal.Body>
            <Card className="bg-light text-black border-dark bg-icon text-start">
              <Card.Body>
                <Card.Title as="h4" className="text-center">
                  Receiver
                </Card.Title>
                <Row className="row-cols-1">
                  <Col>
                    <span className="h4">Name: </span>
                    {formik.values.ORD_Name} |
                    <span className="h4"> Phone: </span>
                    {formik.values.Cus_Phone}
                  </Col>

                  <Col>
                    <span className="h4">Address: </span>
                    {formik.values.ORD_Address}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {cartItems.map((item, index) => (
              <Item key={index} {...item} />
            ))}
          </Modal.Body>
        )}

        <Modal.Footer>
          <Button variant="secondary" onClick={closeOrderModal}>
            Close
          </Button>

          {isLoggedIn ? (
            <Button
              type="submit"
              variant="primary"
              onClick={order.handleSubmit}
            >
              Confirm
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              disabled={!formik.dirty || !formik.isValid}
              onClick={formik.handleSubmit}
            >
              Confirm
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
