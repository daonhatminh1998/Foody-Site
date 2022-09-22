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
import ProductsService from "../../services/ProductsService";
import CustomButton from "../components/CustomButton";
import Input from "../components/Input";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);

  const [modalShow, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const formik = useFormik({
    initialValues: {
      Pro_Id: 0,
      Pro_Type: "",
    },

    validationSchema: Yup.object({
      Pro_Id: Yup.number().required(),
      Pro_Type: Yup.string().required(),
    }),

    onSubmit: (values) => {
      handleFormSubmit(values);
    },
  });

  const handleFormSubmit = (data) => {
    if (data.Pro_Id === 0) {
      ProductsService.add(data).then((res) => {
        if (res.errorCode === 0) {
          toast.success("Add Successful");
          loadData();
          handleModalClose();
        } else {
          toast.error("Add Failed");
        }
      });
    } else {
      ProductsService.update(data.Pro_Id, data).then((res) => {
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
    ProductsService.list().then((res) => {
      setProducts(res.data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const showEditModal = (e, Pro_Id) => {
    if (e) e.preventDefault();
    if (Pro_Id > 0) {
      ProductsService.get(Pro_Id).then((res) => {
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

  const handleDelete = (e, Pro_Id) => {
    e.preventDefault();
    ProductsService.delete(Pro_Id).then((res) => {
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
                  Product <small className="text-muted">list</small>
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
          <Table striped responsive bordered hover>
            <thead>
              <tr className="table-primary border-primary">
                <th style={{ width: "50px" }}>#</th>
                <th>Id</th>
                <th>Type</th>

                <th style={{ width: "80px" }}></th>
              </tr>
            </thead>
            <tbody>
              {products.map((list, idx) => (
                <tr key={list.Pro_Id}>
                  <td>{idx + 1}</td>
                  <td>{list.Pro_Id}</td>
                  <td>{list.Pro_Type}</td>

                  <td>
                    <a href="/#" onClick={(e) => showEditModal(e, list.Pro_Id)}>
                      <i className="bi-pencil-square text-primary"></i>
                    </a>
                    <a href="/#" onClick={(e) => handleDelete(e, list.Pro_Id)}>
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
            Products{" "}
            <small className="text-muted">
              {formik.values.Pro_Id === 0 ? "new" : "edit"}
            </small>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Input
              id="txtPro_Type"
              label="Type"
              maxLength="50"
              required
              formField={formik.getFieldProps("Pro_Type")}
              errMessage={formik.touched.Pro_Type && formik.errors.Pro_Type}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <CustomButton
            color="primary"
            disabled={!formik.dirty || !formik.isValid}
            onClick={formik.handleSubmit}
          >
            Save
          </CustomButton>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Products;
