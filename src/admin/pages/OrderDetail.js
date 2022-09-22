import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
// import * as Yup from "yup";
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
import orderDetailService from "../../services/orderDetailService";
import { toast } from "react-toastify";

const OrderDetail = () => {
  const [orderDetail, setOrderDetail] = useState([]);

  const [modalShow, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const loadData = () => {
    orderDetailService.list().then((res) => {
      setOrderDetail(res.data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const formik = useFormik({
    initialValues: {
      ORDe_Id: 0,
      ORD_Id: 0,
      ProDe_Id: 0,
      ORDe_Quantity: 0,
    },

    // validationSchema: Yup.object({
    //   ORDe_Id: Yup.number().required(),
    //   ORD_Id: Yup.number().required(),
    //   ProDe_Id: Yup.number().required(),
    // }),

    onSubmit: (values) => {
      handleFormSubmit(values);
    },
  });

  const handleFormSubmit = (data) => {
    if (data.ORDe_Id === 0) {
      orderDetailService.add(data).then((res) => {
        if (res.errorCode === 0) {
          toast.success("Add Successful");
          loadData();
          handleModalClose();
        } else {
          toast.error("Add Failed");
        }
      });
    } else {
      orderDetailService.update(data.ORDe_Id, data).then((res) => {
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

  const showEditModal = (e, ORDe_Id) => {
    if (e) e.preventDefault();
    if (ORDe_Id > 0) {
      orderDetailService.get(ORDe_Id).then((res) => {
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

  const handleDelete = (e, ORDe_Id) => {
    e.preventDefault();
    orderDetailService.delete(ORDe_Id).then((res) => {
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
                  Order Detail <small className="text-muted">list</small>
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
                <th>ORDe Id</th>
                <th>ORD Id</th>
                <th>ProDe Id</th>
                <th>Quantity</th>

                <th style={{ width: "80px" }}></th>
              </tr>
            </thead>
            <tbody>
              {orderDetail.map((list, idx) => (
                <tr key={list.ORDe_Id}>
                  <td>{idx + 1}</td>
                  <td>{list.ORDe_Id}</td>
                  <td>{list.ORD_Id}</td>

                  <td>{list.ProDe_Id}</td>
                  <td>{list.ORDe_Quantity}</td>
                  <td>
                    <a
                      href="/#"
                      onClick={(e) => showEditModal(e, list.ORDe_Id)}
                    >
                      <i className="bi-pencil-square text-primary"></i>
                    </a>
                    <a href="/#" onClick={(e) => handleDelete(e, list.ORDe_Id)}>
                      <i className="bi-trash text-danger"></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={modalShow} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Order Detail{" "}
            <small className="text-muted">
              {formik.values.ORDe_Id === 0 ? "new" : "edit"}
            </small>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationFormik01">
                <Form.Label>Order Id</Form.Label>
                <Form.Control
                  type="text"
                  name="ORD_Id"
                  {...formik.getFieldProps("ORD_Id")}
                  isValid={formik.touched.ORD_Id && !formik.errors.ORD_Id}
                  isInvalid={formik.touched.ORD_Id && formik.errors.ORD_Id}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.ORD_Id}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="validationFormik01">
                <Form.Label>Product Detail Id</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="ProDe_Id"
                  {...formik.getFieldProps("ProDe_Id")}
                  isValid={formik.touched.ProDe_Id && !formik.errors.ProDe_Id}
                  isInvalid={formik.touched.ProDe_Id && formik.errors.ProDe_Id}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.ProDe_Id}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="validationFormik02">
                <Form.Label className="required">Quantity</Form.Label>
                <Form.Control
                  type="text"
                  name="ORDe_Quantity"
                  {...formik.getFieldProps("ORDe_Quantity")}
                  isValid={
                    formik.touched.ORDe_Quantity && !formik.errors.ORDe_Quantity
                  }
                  isInvalid={
                    formik.touched.ORDe_Quantity && formik.errors.ORDe_Quantity
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.ORDe_Quantity}
                </Form.Control.Feedback>
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
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderDetail;
