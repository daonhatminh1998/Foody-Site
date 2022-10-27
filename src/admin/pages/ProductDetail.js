import React, { useEffect, useState, useRef } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import { Button, Card, Col, Row, Table, Modal, Form } from "react-bootstrap";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import Pagination from "react-bootstrap/Pagination";
import CardHeader from "react-bootstrap/esm/CardHeader";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";

import api from "../../services/api";
import ProductService from "../../services/ProductsService";
import ProductDetailService from "../../services/productDetailService";

import CustomButton from "../components/CustomButton";
import Input from "../components/Input";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import FullEditor from "ckeditor5-build-full";

import { DebounceInput } from "react-debounce-input";

const ProductDetail = () => {
  const tableHeader = [
    {
      name: "Name",
      sort: "Pro_Name",
    },
    {
      name: "Price",
      sort: "Pro_Price",
    },
    {
      name: "Avatar",
      sort: "Pro_Avatar",
    },
    {
      name: "Unit",
      sort: "Pro_Unit",
    },
    {
      name: "Type",
      sort: "Pro_Id",
    },
    {
      name: "Description",
    },
    {
      name: "Activate",
      sort: "is_Published",
    },
  ];

  const [productDetail, setProductDetail] = useState([]);
  const [productType, setProductType] = useState([]);

  const admin = true;
  const [totalProduct, setTotalProduct] = useState("");
  const [page, setPage] = useState(0);
  const [pageLength, setPageLength] = useState(5);
  const [sort, setSort] = useState("");
  const [type, setType] = useState("");
  const [priceTo, setPriceTo] = useState();
  const [priceFrom, setPriceFrom] = useState();
  const [search, setSearch] = useState("");
  const [pagingItems, setPagingItems] = useState([]);

  const loadData = () => {
    ProductDetailService.list().then((res) => {
      setTotalProduct(res.data.length);
    });

    ProductDetailService.getPaging(
      page,
      pageLength,
      admin,
      type,
      sort,
      priceFrom,
      priceTo,
      search
    ).then((res) => {
      setProductDetail(res.data);

      const last = res.pagingInfo.totalPages - 1;
      var left = page - 2,
        right = page + 2 + 1,
        range = [],
        rangeWithDots = [];
      let l;

      for (let i = 0; i <= last; i++) {
        if (i === 0 || i === last || (i >= left && i < right)) {
          range.push(i);
        }
      }

      // console.log(range);
      //mũi tên
      if (res.pagingInfo.totalPages > 0) {
        rangeWithDots = [
          <Pagination.First
            key="frist"
            disabled={page === 0}
            onClick={() => setPage(0)}
          />,
          <Pagination.Prev
            key="Previous"
            disabled={page === 0}
            onClick={() => setPage(res.pagingInfo.page - 1)}
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
          // else if (i - l !== 1) {
          //   rangeWithDots.push(<Pagination.Ellipsis key="..." disabled />);
          // }
        }

        rangeWithDots.push(
          <Pagination.Item
            key={i}
            active={i === page}
            onClick={() => setPage(i)}
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
          disabled={page === res.pagingInfo.totalPages - 1}
          onClick={() => setPage(res.pagingInfo.page + 1)}
        />,
        <Pagination.Last
          key="last"
          disabled={page === res.pagingInfo.totalPages - 1}
          onClick={() => setPage(res.pagingInfo.totalPages - 1)}
        />
      );

      // for (let i = 1, l = 20; i <= l; i++) {
      //   rangeWithDots.push(
      //     <Pagination.Item
      //       key={i}
      //       active={i === page}
      //       onClick={() => setPage(i)}
      //     >
      //       {i + 1}
      //     </Pagination.Item>
      //   );
      // }

      setPagingItems(rangeWithDots);
      // //mũi tên
      // if (res.pagingInfo.page > 0) {
      //   items.push(<Pagination.First key="frist" onClick={() => setPage(0)} />);
      //   items.push(
      //     <Pagination.Prev
      //       key="Previous"
      //       onClick={() => setPage(res.pagingInfo.page - 1)}
      //     />
      //   );
      // } else {
      //   items.push(<Pagination.First key="frist" disabled />);
      //   items.push(<Pagination.Prev key="Previous" disabled />);
      // }

      // //trang 1 2
      // if (page < 4) {
      //   items.push(
      //     <Pagination.Item
      //       key={0}
      //       active={page === 0}
      //       onClick={() => setPage(0)}
      //     >
      //       {1}
      //     </Pagination.Item>
      //   );
      //   items.push(
      //     <Pagination.Item
      //       key={1}
      //       active={page === 1}
      //       onClick={() => setPage(1)}
      //     >
      //       {2}
      //     </Pagination.Item>
      //   );
      // } else {
      //   items.push(
      //     <Pagination.Item
      //       key={0}
      //       active={page === 0}
      //       onClick={() => setPage(0)}
      //     >
      //       {1}
      //     </Pagination.Item>
      //   );
      //   items.push(<Pagination.Ellipsis key="1" disabled />);
      // }

      // for (let number = 2; number < res.pagingInfo.totalPages - 2; number++) {
      //   items.push(
      //     <Pagination.Item
      //       key={number}
      //       active={number === page}
      //       onClick={() => setPage(number)}
      //     >
      //       {number + 1}
      //     </Pagination.Item>
      //   );
      // }

      // //trang gần và cuối
      // if (
      //   res.pagingInfo.totalPages > 2 &&
      //   res.pagingInfo.page < res.pagingInfo.totalPages - 2
      // ) {
      //   items.push(
      //     <Pagination.Ellipsis key={res.pagingInfo.totalPages - 2} disabled />
      //   );
      //   items.push(
      //     <Pagination.Item
      //       key={res.pagingInfo.totalPages - 1}
      //       active={res.pagingInfo.totalPages - 1 === page}
      //       onClick={() => setPage(res.pagingInfo.totalPages - 1)}
      //     >
      //       {res.pagingInfo.totalPages}
      //     </Pagination.Item>
      //   );
      // } else {
      //   items.push(
      //     <Pagination.Item
      //       key={res.pagingInfo.totalPages - 2}
      //       active={res.pagingInfo.totalPages - 2 === page}
      //       onClick={() => setPage(res.pagingInfo.totalPages - 2)}
      //     >
      //       {res.pagingInfo.totalPages - 1}
      //     </Pagination.Item>
      //   );
      //   items.push(
      //     <Pagination.Item
      //       key={res.pagingInfo.totalPages - 1}
      //       active={res.pagingInfo.totalPages - 1 === page}
      //       onClick={() => setPage(res.pagingInfo.totalPages - 1)}
      //     >
      //       {res.pagingInfo.totalPages}
      //     </Pagination.Item>
      //   );
      // }

      // //mũi tên cuối
      // if (res.pagingInfo.page !== res.pagingInfo.totalPages - 1) {
      //   items.push(
      //     <Pagination.Next
      //       key="Next"
      //       onClick={() => setPage(res.pagingInfo.page + 1)}
      //     />
      //   );
      //   items.push(
      //     <Pagination.Last
      //       key="last"
      //       onClick={() => setPage(res.pagingInfo.totalPages - 1)}
      //     />
      //   );
      // } else {
      //   items.push(<Pagination.Next key="Next" disabled />);
      //   items.push(<Pagination.Last key="last" disabled />);
      // }

      // setPagingItems(items);
    });

    ProductService.list().then((res) => {
      setProductType(res.data);
    });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageLength, admin, type, search, sort]);

  const handleChangePageLength = (e) => {
    setPage(0);
    setPageLength(e.target.value);
  };

  const handleType = (e) => {
    setPage(0);
    setType(e.target.value);
  };

  const handleSearch = (e) => {
    setPage(0);
    setSearch(e.target.value);
  };

  const handleSortAsc = (targets) => {
    setPage(0);
    setSort(`${targets},asc`);
  };

  const handleSortDesc = (targets) => {
    setPage(0);
    setSort(`${targets},desc`);
  };

  //Modal Edit
  const [modalShow, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  //Modal Description
  const [modalDescriptionShow, setShowDescriptionModal] = useState(false);
  const handleDescriptionModalClose = () => setShowDescriptionModal(false);
  const handleDescriptionModalShow = () => setShowDescriptionModal(true);

  const inputFileRef = useRef();
  const defaultImgUrl =
    "http://myfoody290798.herokuapp.com/public/data/products/product-0.jpg";
  const [imagePreview, setImagePreview] = useState(defaultImgUrl);

  const handleChangeImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
      formik.setFieldValue("img", e.target.files[0]);
    }
  };

  const formik = useFormik({
    initialValues: {
      ProDe_Id: 0,
      Des_Id: 0,
      Pro_Name: "",
      Pro_Price: 0,
      Pro_Avatar: undefined,
      Pro_Unit: "",
      Pro_Id: "",
      is_Published: true,
    },

    validationSchema: Yup.object({
      Pro_Name: Yup.string().required("Required"),
      Pro_Price: Yup.number()
        .required("Required")
        .typeError("Must be a number")
        .positive("Must be posivite price"),

      Pro_Unit: Yup.string().required("Required"),
      Pro_Id: Yup.string().required("Required"),
    }),

    onSubmit: (values) => {
      handleFormSubmit(values);
    },
  });

  const handleFormSubmit = (data) => {
    if (data.ProDe_Id === 0) {
      ProductDetailService.add(data).then((res) => {
        if (res.errorCode === 0) {
          toast.success("Add Successful");
          loadData();
          handleModalClose();
        } else {
          // toast.error(res.message);
          console.log(res.message);
        }
      });
    } else {
      ProductDetailService.update(data.ProDe_Id, data).then((res) => {
        if (res.errorCode === 0) {
          toast.success("Update Successful");
          loadData();
          handleModalClose();
          handleDescriptionModalClose();
        } else {
          // toast.error("Update Failed");
          toast.error(res.message);
        }
      });
    }
  };

  const showEditModal = (e, ProDe_Id) => {
    if (e) e.preventDefault();

    if (ProDe_Id > 0) {
      console.log("load data");
      const avatarReq = ProductDetailService.getAvatarUrl(ProDe_Id);
      const productReq = ProductDetailService.get(ProDe_Id);

      api.promise([avatarReq, productReq]).then(
        api.spread((...res) => {
          // console.log(res);
          if (res[0].errorCode === 0) setImagePreview(res[0].data);
          else setImagePreview(defaultImgUrl);

          formik.setValues(res[1].data);
          handleModalShow();
        })
      );
    } else {
      // console.log("add");
      setImagePreview(defaultImgUrl);
      formik.resetForm();
      handleModalShow();
    }

    // if (ProDe_Id > 0) {
    //   ProductDetailService.getAvatarUrl(ProDe_Id).then((res) => {
    //     console.log(res);
    //     if (res.errorCode === 0) setImagePreview(res.data);
    //     else setImagePreview(defaultImgUrl);
    //   });

    //   ProductDetailService.get(ProDe_Id).then((res) => {
    //     if (res.errorCode === 0) {
    //       console.log(res);
    //       formik.setValues(res.data);
    //       handleModalShow();
    //     }
    //   });
    // } else {
    //   formik.resetForm();
    //   handleModalShow();
    // }
  };

  const showDescriptionModal = (e, ProDe_Id) => {
    if (e) e.preventDefault();

    if (ProDe_Id > 0) {
      console.log("load data");
      ProductDetailService.get(ProDe_Id).then((res) => {
        if (res.errorCode === 0) {
          // console.log(res);
          formik.setValues(res.data);
          handleDescriptionModalShow();
        }
      });
    }

    // if (ProDe_Id > 0) {
    //   ProductDetailService.getAvatarUrl(ProDe_Id).then((res) => {
    //     console.log(res);
    //     if (res.errorCode === 0) setImagePreview(res.data);
    //     else setImagePreview(defaultImgUrl);
    //   });

    //   ProductDetailService.get(ProDe_Id).then((res) => {
    //     if (res.errorCode === 0) {
    //       console.log(res);
    //       formik.setValues(res.data);
    //       handleModalShow();
    //     }
    //   });
    // } else {
    //   formik.resetForm();
    //   handleModalShow();
    // }
  };

  const handleDelete = (e, ProDe_Id) => {
    e.preventDefault();
    ProductDetailService.delete(ProDe_Id).then((res) => {
      if (res.errorCode === 0) {
        toast.success("Delete Successful");
        loadData();
      } else {
        toast.error("Delete Failed");
      }
    });
  };

  return (
    <>
      <h3 className="pt-3">
        Product Detail <small className="text-muted">list</small>
      </h3>
      <Card className="border-primary bt-5 my-4">
        <CardHeader>
          <Row>
            <Col>
              <Card.Title>
                <Form>
                  <Form.Group as={Row}>
                    <Col className="align-self-center" sm="1">
                      <Form.Label>Type</Form.Label>
                    </Col>
                    <Col sm="6">
                      <Form.Select
                        className="bg-white"
                        value={type}
                        onChange={handleType}
                      >
                        <option value="">Select</option>
                        {productType.map((list) => (
                          <option key={list.Pro_Id} value={list.Pro_Id}>
                            {list.Pro_Type}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Form>
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
          <Row className="pb-2">
            <Col>
              <Row className="gx-1">
                <Form.Label as={Col} sm="auto">
                  Show
                </Form.Label>
                <Col sm="auto">
                  <Form.Select
                    value={pageLength}
                    style={{ width: "80px" }}
                    onChange={handleChangePageLength}
                    className="shadow-none"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </Form.Select>
                </Col>

                <Form.Label as={Col} sm="auto">
                  entries
                </Form.Label>
              </Row>
            </Col>
            <Col xs="auto">
              <DebounceInput
                value={search}
                minLength={2}
                placeholder="search"
                debounceTimeout={300}
                label="Search"
                onChange={handleSearch}
              />
            </Col>
          </Row>

          <Table striped bordered hover responsive="xl" className="text-center">
            <thead>
              <tr className="table-primary border-primary ">
                <th style={{ width: "50px" }}>#</th>
                {tableHeader.map((e) => (
                  <th style={{ width: "30px" }} key={e.name}>
                    {e.name}
                    {e.sort ? (
                      <>
                        <FontAwesomeIcon
                          className="text-muted"
                          onClick={() => handleSortAsc(e.sort)}
                          type="button"
                          size="xs"
                          icon={faArrowDown}
                        />

                        <FontAwesomeIcon
                          type="button"
                          className="text-muted"
                          onClick={() => handleSortDesc(e.sort)}
                          size="xs"
                          icon={faArrowUp}
                        />
                      </>
                    ) : (
                      ""
                    )}
                  </th>
                ))}

                <th style={{ width: "80px" }}></th>
              </tr>
            </thead>

            <tbody>
              {productDetail.map((list, idx) => (
                <tr key={idx}>
                  <td>{idx + 1 + page * pageLength}</td>
                  <td>{list.Pro_Name}</td>
                  <td>{list.Pro_Price}</td>
                  <td>
                    <Row>
                      <img src={list.Pro_Avatar} alt="" className="img-fluid" />
                    </Row>
                  </td>
                  <td>{list.Pro_Unit}</td>
                  <td>{list.type.Pro_Type}</td>
                  <td>
                    <a
                      href="/#"
                      //show item in list
                      onClick={(e) => showDescriptionModal(e, list.ProDe_Id)}
                    >
                      <i className="bi bi-eye-fill text-dark fs-3"></i>
                    </a>
                  </td>
                  {/* <td dangerouslySetInnerHTML={{ __html: list.shortDes }}/>
                  <td dangerouslySetInnerHTML={{ __html: list.longDes }} /> */}
                  {/* <td>
                    {list.is_Published === 1 ? (
                      <i className="bi bi-check text-primary fs-3"></i>
                    ) : (
                      <i className="bi bi-x text-danger fs-3"></i>
                    )}
                  </td> */}
                  <td>
                    <Col className="text-center">
                      <BootstrapSwitchButton
                        checked={list.is_Published === 1 ? true : false}
                        width={100}
                        // height={10}
                        offstyle="danger"
                        onlabel="O"
                        offlabel="-"
                        onChange={(checked) => {
                          // console.log("data: ", list);
                          list.is_Published = checked === true ? 1 : 0;
                          let id = list.ProDe_Id;
                          ProductDetailService.update(id, list).then((res) => {
                            // console.log(res);
                            toast.success("Update Success");
                          });
                        }}
                      />
                      {/* {console.log(formik)} */}
                    </Col>
                  </td>
                  <td>
                    <a
                      href="/#"
                      //show item in list
                      onClick={(e) => showEditModal(e, list.ProDe_Id)}
                    >
                      <i className="bi-pencil-square text-primary"></i>
                    </a>
                    <a
                      href="/#"
                      onClick={(e) => handleDelete(e, list.ProDe_Id)}
                    >
                      <i className="bi-trash text-danger"></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Row className="pt-3">
            <Col>
              <p>
                Đang xem {page * pageLength + 1} đến {(page + 1) * pageLength}{" "}
                trong tổng số {totalProduct} mục
              </p>
            </Col>
            <Col>
              <Pagination className="justify-content-end">
                {pagingItems}
              </Pagination>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Description */}
      <Modal
        show={modalDescriptionShow}
        onHide={handleDescriptionModalClose}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title>Description</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Short Description</Form.Label>
              <CKEditor
                editor={FullEditor}
                data={formik.values.shortDes}
                // onReady={(editor) => {

                //   console.log("Editor is ready to use!", editor);
                // }}
                // onChange={(event, editor) => {
                //   const data = editor.getData();
                //   console.log({ event, editor, data });
                // }}
                onBlur={(event, editor) => {
                  formik.setFieldValue("shortDes", editor.getData());
                }}
                // onFocus={(event, editor) => {
                //   console.log("Focus.", editor);
                // }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Long Description</Form.Label>
              <CKEditor
                editor={FullEditor}
                data={formik.values.longDes}
                // onReady={(editor) => {

                //   console.log("Editor is ready to use!", editor);
                // }}
                // onChange={(event, editor) => {
                //   const data = editor.getData();
                //   console.log({ event, editor, data });
                // }}
                onBlur={(event, editor) => {
                  formik.setFieldValue("longDes", editor.getData());
                }}
                // onFocus={(event, editor) => {
                //   console.log("Focus.", editor);
                // }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleDescriptionModalClose}>
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

      {/* Edit Product */}
      <Modal
        show={modalShow}
        onHide={handleModalClose}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Product Detail{" "}
            <small className="text-muted">
              {formik.values.ProDe_Id === 0 ? "new" : "edit"}
            </small>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Row className="pb-3">
              <Col>
                <Row className="row-cols-2">
                  <Col>
                    <Row className="row-cols-1">
                      <Col>
                        <Input
                          label="Name"
                          labelSize={2}
                          maxLength="50"
                          required
                          formField={formik.getFieldProps("Pro_Name")}
                          isValid={
                            formik.touched.Pro_Name && !formik.errors.Pro_Name
                          }
                          errMessage={
                            formik.touched.Pro_Name && formik.errors.Pro_Name
                          }
                        />
                      </Col>

                      <Col>
                        <Input
                          label="Price"
                          labelSize={2}
                          maxLength="50"
                          required
                          formField={formik.getFieldProps("Pro_Price")}
                          isValid={
                            formik.touched.Pro_Price && !formik.errors.Pro_Price
                          }
                          errMessage={
                            formik.touched.Pro_Price && formik.errors.Pro_Price
                          }
                        />
                      </Col>

                      <Col>
                        <Input
                          label="Unit"
                          labelSize={2}
                          maxLength="50"
                          required
                          formField={formik.getFieldProps("Pro_Unit")}
                          isValid={
                            formik.touched.Pro_Unit && !formik.errors.Pro_Unit
                          }
                          errMessage={
                            formik.touched.Pro_Unit && formik.errors.Pro_Unit
                          }
                        />
                      </Col>

                      <Col>
                        <Form.Group as={Row} className="mb-3">
                          <Col className="align-self-center" sm="2">
                            <Form.Label>Type</Form.Label>
                          </Col>
                          <Col>
                            <Form.Select
                              className="bg-white"
                              {...formik.getFieldProps("Pro_Id")}
                              isValid={
                                formik.touched.Pro_Id && !formik.errors.Pro_Id
                              }
                              isInvalid={
                                formik.touched.Pro_Id && formik.errors.Pro_Id
                              }
                            >
                              <option value="">Select</option>
                              {productType.map((list) => (
                                <option key={list.Pro_Id} value={list.Pro_Id}>
                                  {list.Pro_Type}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {formik.touched.Pro_Id && formik.errors.Pro_Id}
                            </Form.Control.Feedback>
                          </Col>
                        </Form.Group>
                      </Col>

                      <Col>
                        <Form.Group as={Row} className="mb-3">
                          <Col className="align-self-center" sm="2">
                            <Form.Label>Publish</Form.Label>
                          </Col>

                          <Col className="text-center">
                            <BootstrapSwitchButton
                              checked={
                                formik.values.is_Published ||
                                formik.values.is_Published === 1
                                  ? true
                                  : false
                              }
                              width={200}
                              offstyle="danger"
                              onlabel="On"
                              offlabel="Off"
                              onChange={(checked) => {
                                formik.setFieldValue("is_Published", checked);
                              }}
                            />
                            {/* {console.log(formik.values.is_Published)} */}
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>

                  <Row className="row-cols-1 justify-content-center">
                    <Col md={8} lg={5}>
                      <img src={imagePreview} alt="" className="img-fluid" />
                    </Col>

                    <Col md={8}>
                      <input
                        accept="image/*"
                        type="file"
                        name="image"
                        ref={inputFileRef}
                        className="d-none"
                        onChange={handleChangeImage}
                      />
                    </Col>

                    <Col className="text-center">
                      <Button
                        className="mt-3"
                        variant="primary"
                        size="sm"
                        onClick={() => inputFileRef.current.click()}
                      >
                        Choose Image
                      </Button>
                    </Col>
                  </Row>
                </Row>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Short Description</Form.Label>
              <CKEditor
                editor={FullEditor}
                data={formik.values.shortDes}
                // onReady={(editor) => {

                //   console.log("Editor is ready to use!", editor);
                // }}
                // onChange={(event, editor) => {
                //   const data = editor.getData();
                //   console.log({ event, editor, data });
                // }}
                onBlur={(event, editor) => {
                  formik.setFieldValue("shortDes", editor.getData());
                }}
                // onFocus={(event, editor) => {
                //   console.log("Focus.", editor);
                // }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Long Description</Form.Label>
              <CKEditor
                editor={FullEditor}
                data={formik.values.longDes}
                // onReady={(editor) => {

                //   console.log("Editor is ready to use!", editor);
                // }}
                // onChange={(event, editor) => {
                //   const data = editor.getData();
                //   console.log({ event, editor, data });
                // }}
                onBlur={(event, editor) => {
                  formik.setFieldValue("longDes", editor.getData());
                }}
                // onFocus={(event, editor) => {
                //   console.log("Focus.", editor);
                // }}
              />
            </Form.Group>
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
    </>
  );
};

export default ProductDetail;
