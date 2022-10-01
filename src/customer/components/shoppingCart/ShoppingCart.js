import {
  Button,
  Col,
  Form,
  Modal,
  Offcanvas,
  Row,
  Stack,
} from "react-bootstrap";
import { useCart } from "../../store/Cart";
import { CartItem } from "./CartItem";
import { useState } from "react";

import formatCurrency from "../../utilities/formatCurrency";
import ordersServices from "../../../services/ordersServices";

import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

export function ShoppingCart({ isOpen }) {
  const { closeCart, cartItems, products, clearCart } = useCart();

  const [modalShow, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);
  const navigate = useNavigate();

  const handleFormSubmit = (data) => {
    const details = cartItems.map((item) => ({
      ProDe_Id: item.id,
      ORDe_Quantity: item.quantity,
    }));

    const order = {
      ORD_FirstName: data.ORD_FirstName,
      ORD_LastName: data.ORD_LastName,
      ORD_Address: data.ORD_Address,
      ORD_CusNote: data.ORD_CusNote,
      customer: {
        Cus_Email: data.Cus_Email,
        Cus_Phone: data.Cus_Phone,
      },
      details: details,
    };

    ordersServices.add(order).then((res) => {
      if (res.errorCode === 0) {
        toast.success("Order submitted");
        clearCart();
        localStorage.removeItem("shopping-cart");
        closeCart();
        handleModalClose();
        navigate("/", window.scrollTo(0, 0));
      } else {
        toast.error(res.message);
      }
    });
  };

  var phoneRegEx =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const formik = useFormik({
    initialValues: {
      Cus_Id: 0,
      ORD_FirstName: "",
      ORD_LastName: "",
      ORD_Address: "",
      Cus_Email: "",
      Cus_Phone: "",
    },

    validationSchema: Yup.object({
      ORD_FirstName: Yup.string().required("Required"),
      ORD_LastName: Yup.string(),
      ORD_Address: Yup.string().required("Address cannot be empty"),
      Cus_Email: Yup.string().email("abc@Email.com"),
      Cus_Phone: Yup.string()
        .required("Required")
        .matches(phoneRegEx, "Invalid Phone format")
        .min(10, "Too short")
        .max(10, "Too long"),
    }),

    onSubmit: (values) => {
      handleFormSubmit(values);
      console.log(values);
      formik.resetForm();
    },
  });

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
          <Offcanvas.Title>Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Stack gap={3}>
            {cartItems.map((item, index) => (
              <CartItem key={index} {...item} />
            ))}
            <Row className="ms-auto fw-bold fs-5 justify-content-between">
              <span className="w-auto me-3">Total: </span>

              <span className="w-auto">
                {formatCurrency(
                  cartItems.reduce((total, cartItem) => {
                    const item = products.find(
                      (i) => i.ProDe_Id === cartItem.id
                    );
                    return total + (item?.Pro_Price || 0) * cartItem.quantity;
                  }, 0)
                )}
              </span>

              <Button onClick={handleModalShow} disabled={!cartItems.length}>
                Book Item
              </Button>
            </Row>
          </Stack>
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={modalShow} onHide={handleModalClose} scrollable="true">
        <Modal.Header closeButton>
          <Modal.Title>Delivery Information</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} md="6">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  {...formik.getFieldProps("ORD_FirstName")}
                  isValid={
                    formik.touched.ORD_FirstName && !formik.errors.ORD_FirstName
                  }
                  isInvalid={
                    formik.touched.ORD_FirstName && formik.errors.ORD_FirstName
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.ORD_FirstName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="6">
                <Form.Label className="required">Last name</Form.Label>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps("ORD_LastName")}
                  isValid={
                    formik.touched.ORD_LastName && !formik.errors.ORD_LastName
                  }
                  isInvalid={
                    formik.touched.ORD_LastName && formik.errors.ORD_LastName
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.ORD_LastName}
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
              <Form.Group as={Col} md="6">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  {...formik.getFieldProps("Cus_Email")}
                  isValid={formik.touched.Cus_Email && !formik.errors.Cus_Email}
                  isInvalid={
                    formik.touched.Cus_Email && formik.errors.Cus_Email
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.Cus_Email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps("Cus_Phone")}
                  isValid={formik.touched.Cus_Phone && !formik.errors.Cus_Phone}
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
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!formik.dirty || !formik.isValid}
            onClick={formik.handleSubmit}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
