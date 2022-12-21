/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Row, Col, Container, Pagination } from "react-bootstrap";
import Product from "./Product";
import { Link } from "react-router-dom";
import { useCart } from "../../store/Cart";
import ProductDetailService from "../../services/productDetailService";

// product page
const Store = ({ loading }) => {
  const [productDetail, setProductDetail] = useState([]);
  const [page, setPage] = useState(0);
  const [pageLength] = useState(6);
  const [pagingItems, setPagingItems] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);

  const loadData = () => {
    setIsWaiting(true);
    ProductDetailService.getPaging(page, pageLength).then((res) => {
      if (res.errorCode === 0) {
        setIsWaiting(false);
        setProductDetail(res.data);
      }
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

      setPagingItems(rangeWithDots);
    });
  };

  useEffect(() => {
    loadData();
  }, [page, pageLength]);

  if (loading) {
    return (
      <Container className="container-xxl py-5">
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

        {isWaiting ? (
          <Row className="text-center pt-2">
            <Col>
              <div className="spinner-border spinner-border-lg text-grey" />
            </Col>
          </Row>
        ) : (
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
        )}
      </Container>
    );
  }
  return (
    <Container className="container-xxl py-5">
      <Row className=" g-0 gx-5 align-items-end">
        <Col lg={6}>
          <div
            className="section-header text-start mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="display-5 mb-3"> Our Products</h1>
            <p>
              Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam
              justo sed rebum vero dolor duo.
            </p>
          </div>
        </Col>
      </Row>
      {isWaiting ? (
        <Row className="text-center pt-2">
          <Col>
            <div className="spinner-border spinner-border-lg text-grey" />
          </Col>
        </Row>
      ) : (
        <>
          <Row className="g-3">
            {productDetail.slice(0, 8).map((product) => (
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

          <Row className="text-center pt-2">
            <Col>
              <Link
                className="btn btn-primary rounded-pill py-3 px-5"
                to="/OurProducts"
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
              >
                Browse More Products
              </Link>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Store;
