import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Table,
  Modal,
  Form,
} from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import ordersServices from "../../services/ordersServices";
// import Input from "../components/Input";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);

  const [modalShow, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  var phoneRegEx =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const formik = useFormik({
    initialValues: {
      ORD_FirstName: "",
      ORD_LastName: "",
      Cus_Phone: "",
      ORD_Address: "",
      ORD_DateTime: "",
      Cus_Email: "",
      ORD_Code: "",
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
    },
  });

  const handleFormSubmit = (data) => {
    if (data.ORD_Id === 0) {
      ordersServices.add(data).then((res) => {
        if (res.errorCode === 0) {
          toast.success("Add Successful");
          loadData();
          handleModalClose();
        } else {
          toast.error("Add Failed");
        }
      });
    } else {
      ordersServices.update(data.ORD_Id, data).then((res) => {
        if (res.errorCode === 0) {
          toast.success("Update Successful");
          loadData();
          handleModalClose();
        } else {
          toast.error("Update Failed");
        }
      });
    }
  };

  const loadData = () => {
    ordersServices.list().then((res) => {
      setOrders(res.data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const showEditModal = (e, ORD_Id) => {
    if (e) e.preventDefault();
    if (ORD_Id > 0) {
      ordersServices.get(ORD_Id).then((res) => {
        if (res.errorCode === 0) {
          setOrderDetail(res.data);
          formik.setValues(res.data);
          handleModalShow();
        }
      });
    } else {
      setOrderDetail([]);
      formik.resetForm();
      handleModalShow();
    }
  };

  const handleDelete = (e, ORD_Id) => {
    e.preventDefault();
    ordersServices.delete(ORD_Id).then((res) => {
      if (res.errorCode === 0) {
        toast.success("Delete Successful");
        loadData();
      } else {
        toast.error("Delete Failed");
      }
    });
  };

  return (
    <Container className="mt-4">
      <Card className="border-primary bt-5">
        <CardHeader>
          <Row>
            <Col>
              <Card.Title>
                <h3>
                  Order <small className="text-muted">list</small>
                </h3>
              </Card.Title>
            </Col>

            <Col sm="auto">
              <Button
                variant="primary"
                type="button"
                onClick={() => showEditModal(null, 0)}
              >
                <i className="bi-plus-lg"></i> Add
              </Button>
            </Col>
          </Row>
        </CardHeader>
        <Card.Body>
          <Table striped responsive bordered hover className="text-center">
            <thead>
              <tr className="table-primary border-primary ">
                <th style={{ width: "50px" }}>#</th>

                <th>Order Code</th>
                <th>Cus Name</th>
                <th>Cus Phone</th>
                <th>Date Time</th>

                <th style={{ width: "80px" }}></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((list, idx) => (
                <tr key={list.ORD_Id}>
                  <td>{idx + 1}</td>
                  <td>{list.ORD_Code}</td>

                  <td>{list.ORD_FirstName + " " + list.ORD_LastName}</td>

                  <td>{list.customer.Cus_Phone}</td>
                  <td>{list.ORD_DateTime}</td>

                  <td>
                    <a href="/#" onClick={(e) => showEditModal(e, list.ORD_Id)}>
                      <i className="bi-pencil-square text-primary"></i>
                    </a>
                    <a href="/#" onClick={(e) => handleDelete(e, list.ORD_Id)}>
                      <i className="bi-trash text-danger"></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal
        show={modalShow}
        onHide={handleModalClose}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h2>
              {formik.values.ORD_Id
                ? `Updating Order - ${formik.values.ORD_Code}`
                : "Creating New Order"}
            </h2>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Form as={Col}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label as={Col} sm="2">
                  Phone
                </Form.Label>
                <Col>
                  <Form.Control
                    required
                    type="text"
                    {...formik.getFieldProps("customer.Cus_Phone")}
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
                </Col>
              </Form.Group>

              <Row className="mb-3">
                <Col sm="6">
                  <Form.Group as={Row}>
                    <Form.Label
                      as={Col}
                      lg="12"
                      xl="4"
                      className="align-self-center"
                    >
                      First name
                    </Form.Label>
                    <Col>
                      <Form.Control
                        required
                        type="text"
                        {...formik.getFieldProps("ORD_FirstName")}
                        isValid={
                          formik.touched.ORD_FirstName &&
                          !formik.errors.ORD_FirstName
                        }
                        isInvalid={
                          formik.touched.ORD_FirstName &&
                          formik.errors.ORD_FirstName
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.ORD_FirstName}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>

                <Col sm="6">
                  <Form.Group as={Row}>
                    <Form.Label
                      as={Col}
                      lg="12"
                      xl="4"
                      className="align-self-center"
                    >
                      Last name
                    </Form.Label>
                    <Col>
                      <Form.Control
                        required
                        type="text"
                        {...formik.getFieldProps("ORD_LastName")}
                        isValid={
                          formik.touched.ORD_LastName &&
                          !formik.errors.ORD_LastName
                        }
                        isInvalid={
                          formik.touched.ORD_LastName &&
                          formik.errors.ORD_LastName
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.ORD_LastName}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group as={Row} className="mb-3">
                <Form.Label as={Col} sm="2">
                  Email
                </Form.Label>
                <Col>
                  <Form.Control
                    required
                    type="text"
                    {...formik.getFieldProps("customer.Cus_Email")}
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
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label as={Col} sm="2">
                  Address
                </Form.Label>
                <Col>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    required
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
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label as={Col} sm="2">
                  Customer Note
                </Form.Label>
                <Col>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    type="text"
                    {...formik.getFieldProps("ORD_CusNote")}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label as={Col} sm="2">
                  Admin Note
                </Form.Label>
                <Col>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    type="text"
                    {...formik.getFieldProps("ORD_AdNote")}
                  />
                </Col>
              </Form.Group>
            </Form>

            <Card as={Col} className="border-primary me-2">
              <CardHeader as={Row} className="pt-3 pb-0">
                <Card.Title as={Col}>
                  <h3>
                    Order <small className="text-muted">list</small>
                  </h3>
                </Card.Title>

                <Col sm="auto">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={() => showEditModal(null, 0)}
                  >
                    <i className="bi-plus-lg"></i> Add Product
                  </Button>
                </Col>
              </CardHeader>

              <Card.Body>
                <Table
                  striped
                  responsive
                  bordered
                  hover
                  className="text-center"
                >
                  <thead>
                    <tr className="table-primary border-primary ">
                      <th style={{ width: "50px" }}>#</th>

                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>

                      <th style={{ width: "80px" }}></th>
                    </tr>
                  </thead>

                  <tbody>
                    {orderDetail.details ? (
                      <>
                        {orderDetail?.details.map((list, idx) => (
                          <tr key={list.ORDe_Id}>
                            <td>{idx + 1}</td>
                            <td>{list.product_detail.Pro_Name}</td>
                            <td>{list.ORDe_Quantity}</td>
                            <td>{list.product_detail.Pro_Price}</td>
                            <td>{list.ORDe_Price}</td>

                            <td>
                              <a
                                href="/#"
                                onClick={(e) => showEditModal(e, list.ORD_Id)}
                              >
                                <i className="bi-pencil-square text-primary"></i>
                              </a>
                              <a
                                href="/#"
                                onClick={(e) => handleDelete(e, list.ORD_Id)}
                              >
                                <i className="bi-trash text-danger"></i>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      ""
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Row>
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
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Orders;
