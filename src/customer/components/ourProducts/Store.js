import React, { useState, useEffect } from "react";
import { Row, Col, Container, Pagination } from "react-bootstrap";
import Product from "./Product";
// import { Link } from "react-router-dom";
// import { useCart } from "../../store/Cart";
import ProductDetailService from "./../../../services/productDetailService";

// product page
const Store = ({ loading }) => {
  // const { products } = useCart(); // 2list of products already call in store/Cart.js without paging
  const RECORDS_PER_PAGE = 2;
  const [productDetail, setProductDetail] = useState([]);
  const [page, setPage] = useState(0);
  const [pageLength] = useState(RECORDS_PER_PAGE); // default record per page = 8
  const [pagingItems, setPagingItems] = useState([]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageLength]);

  const loadData = () => {
    ProductDetailService.getPaging(page, pageLength).then((res) => {
      setProductDetail(res.data);
      // console.log("res data", res.data);
      // set pagination
      let items = [
        <Pagination.Item key="first" onClick={() => setPage(0)}>
          &laquo;
        </Pagination.Item>,
      ];
      for (let i = 0; i < res.pagingInfo.totalPages; i++) {
        items.push(
          <Pagination.Item
            key={i}
            active={i === page}
            onClick={() => setPage(i)}
          >
            {i + 1}
          </Pagination.Item>
        );
      }
      items.push(
        <Pagination.Item
          key="last"
          onClick={() => setPage(res.pagingInfo.totalPages - 1)}
        >
          &raquo;
        </Pagination.Item>
      );
      setPagingItems(items);
    });
  };

  return (
    <>
      <Container className="container-xxl py-5">
        {/* {console.log("This is Product's Page")} */}
        <Row className=" g-0 gx-5 align-items-end">
          <Col lg={6}>
            <div
              className="section-header text-start mb-5 wow fadeInUp"
              data-wow-delay="0.1s"
              style={{ maxWidth: "500px" }}
            >
              <h1 className="display-5 mb-3"> Our Products</h1>
              <p>
                Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum
                diam justo sed rebum vero dolor duo.
              </p>
            </div>
          </Col>
        </Row>
        {/* <Row className="g-3">
            {products.map((product) => (
              <Col
                md={4}
                xl={3}
                key={product.ProDe_Id}
                className="product-item position-relative bg-light overflow-hidden list-group-item"
              >
                <Product key={product.ProDe_Id} product={product} />
              </Col>
            ))}
          </Row> */}
        <Row className="g-3">
          <Row className="g-3">
            {productDetail.map((product) => (
              <Col
                md={4}
                xl={3}
                key={product.ProDe_Id}
                className="product-item position-relative bg-light overflow-hidden list-group-item"
              >
                <Product key={product.ProDe_Id} product={product} />
              </Col>
            ))}
          </Row>
          <Pagination className="mt-3 mb-0 justify-content-end">
            {pagingItems}
          </Pagination>
        </Row>
      </Container>
    </>
  );
};

export default Store;
