import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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

import customersServices from "../../services/customersServices";
import { toast } from "react-toastify";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  const [modalShow, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  var phoneRegEx =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const formik = useFormik({
    initialValues: {
      Cus_Id: 0,
      Cus_FirstName: "",
      Cus_LastName: "",
      Cus_Address: "",
      Cus_Email: "",
      Cus_Phone: "",
    },

    validationSchema: Yup.object({
      Cus_Id: Yup.number().required(),
      Cus_FirstName: Yup.string(),
      Cus_LastName: Yup.string()
        .required("Required")
        .min(2, "At least 2 characters"),
      Cus_Address: Yup.string().required("Address cannot be empty"),
      Cus_Email: Yup.string().required("Required").email("abc@Email.com"),
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
    if (data.Cus_Id === 0) {
      customersServices.add(data).then((res) => {
        if (res.errorCode === 0) {
          toast.success("Add Successful");
          loadData();
          handleModalClose();
        } else {
          toast.error("Add Failed");
        }
      });
    } else {
      customersServices.update(data.Cus_Id, data).then((res) => {
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
    customersServices.list().then((res) => {
      setCustomers(res.data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const showEditModal = (e, Cus_Id) => {
    if (e) e.preventDefault();
    if (Cus_Id > 0) {
      customersServices.get(Cus_Id).then((res) => {
        if (res.errorCode === 0) {
          formik.setValues(res.data);
          handleModalShow();
        }
      });
    } else {
      formik.resetForm();
      handleModalShow();
    }
  };

  const handleDelete = (e, Cus_Id) => {
    e.preventDefault();
    customersServices.delete(Cus_Id).then((res) => {
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
                  Customer <small className="text-muted">list</small>
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
          <Table responsive striped bordered hover className="text-center">
            <thead>
              <tr className="table-primary border-primary ">
                <th style={{ width: "50px" }}>#</th>
                <th>Full Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>

                <th style={{ width: "80px" }}></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((list, idx) => (
                <tr key={list.Cus_Id}>
                  <td>{idx + 1}</td>
                  <td>{list.Cus_FirstName + " " + list.Cus_LastName}</td>
                  <td>{list.Cus_Phone}</td>
                  <td>{list.Cus_Email}</td>
                  <td>{list.Cus_Address}</td>

                  <td>
                    <a href="/#" onClick={(e) => showEditModal(e, list.Cus_Id)}>
                      <i className="bi-pencil-square text-primary"></i>
                    </a>
                    <a href="/#" onClick={(e) => handleDelete(e, list.Cus_Id)}>
                      <i className="bi-trash text-danger"></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={modalShow} onHide={handleModalClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <span>
              <span className="fs-4 fw-bold"> Customer </span>
              <small className="text-muted">
                {formik.values.Cus_Id === 0 ? " new" : " edit"}
              </small>
            </span>
          </Modal.Title>
        </Modal.Header>

        {/* <Modal.Body>
          <Form>
            <Input
              id="txtFirstName"
              label="First Name"
              maxLength="50"
              required
              formField={formik.getFieldProps("Cus_FirstName")}
              errMessage={
                formik.touched.Cus_FirstName && formik.errors.Cus_FirstName
              }
            />
            <Input
              id="txtLastName"
              label="Last Name"
              maxLength="50"
              required
              formField={formik.getFieldProps("Cus_LastName")}
              errMessage={
                formik.touched.Cus_LastName && formik.errors.Cus_LastName
              }
            />

            <Input
              id="txtPhone"
              label="Phone"
              maxLength="50"
              required
              formField={formik.getFieldProps("Cus_Phone")}
              errMessage={formik.touched.Cus_Phone && formik.errors.Cus_Phone}
            />
            <Input
              id="txtEmail"
              label="Email"
              maxLength="50"
              required
              formField={formik.getFieldProps("Cus_Email")}
              errMessage={formik.touched.Cus_Email && formik.errors.Cus_Email}
            />
            <Input
              id="txtAddress"
              label="Address"
              maxLength="50"
              required
              formField={formik.getFieldProps("Cus_Address")}
              errMessage={
                formik.touched.Cus_Address && formik.errors.Cus_Address
              }
            />
          </Form>
        </Modal.Body> */}

        <Modal.Body>
          <Row>
            <Form as={Col}>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationFormik01">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="FirstName"
                    {...formik.getFieldProps("Cus_FirstName")}
                    isValid={
                      formik.touched.Cus_FirstName &&
                      !formik.errors.Cus_FirstName
                    }
                    isInvalid={
                      formik.touched.Cus_FirstName &&
                      formik.errors.Cus_FirstName
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.Cus_FirstName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationFormik02">
                  <Form.Label className="required">Last name</Form.Label>
                  <Form.Control
                    type="text"
                    name="LastName"
                    {...formik.getFieldProps("Cus_LastName")}
                    isValid={
                      formik.touched.Cus_LastName && !formik.errors.Cus_LastName
                    }
                    isInvalid={
                      formik.touched.Cus_LastName && formik.errors.Cus_LastName
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.Cus_LastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="validationFormik01">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="Address"
                    {...formik.getFieldProps("Cus_Address")}
                    isValid={
                      formik.touched.Cus_Address && !formik.errors.Cus_Address
                    }
                    isInvalid={
                      formik.touched.Cus_Address && formik.errors.Cus_Address
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.Cus_Address}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationFormik01">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="Email"
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
                <Form.Group as={Col} md="6" controlId="validationFormik02">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="Phone"
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
            </Form>

            {/* <Card as={Col} className="border-primary me-2">

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
            </Card> */}
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

export default Customers;
