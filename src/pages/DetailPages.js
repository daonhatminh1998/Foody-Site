import { useEffect, useState } from "react";
import { Button, Card, Carousel, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import OtherHeader from "../components/header/OtherHeader";
import ProductDetailService from "../services/productDetailService";

import { useCart } from "../store/Cart";
import formatCurrency from "../utilities/formatCurrency";

const DetailPages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeItem,
  } = useCart();
  const [productDetail, setProductDetail] = useState([]);

  useEffect(() => {
    ProductDetailService.get(id).then((res) => {
      if (res.errorCode === 0) {
        setProductDetail(res.data);
      } else {
        navigate("/PageNotFound");
      }
    });
  }, [id, navigate]);

  const quantity = getItemQuantity(Number(id));

  return (
    <div className="bg-light">
      <OtherHeader label="OurProducts" id={productDetail.Pro_Name} />
      <Container className="bg-white bg-icon mt-4 p-3">
        <Row>
          <Col lg={5} className=" text-center ">
            <Carousel>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={`${process.env.PUBLIC_URL}${productDetail.Pro_Avatar}`}
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={`${process.env.PUBLIC_URL}${productDetail.Pro_Avatar}`}
                  alt="Second slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={`${process.env.PUBLIC_URL}${productDetail.Pro_Avatar}`}
                  alt="Third slide"
                />
              </Carousel.Item>
            </Carousel>
          </Col>

          <Col lg={7}>
            <Card>
              <Card.Header>
                <Row>
                  <Col>
                    <Card.Title className="h2">
                      {productDetail.Pro_Name}
                      <Card.Subtitle className="mb-2 text-muted">
                        {productDetail.type?.Pro_Type}
                      </Card.Subtitle>
                    </Card.Title>
                  </Col>
                  <Col sm="auto align-self-center">
                    <Card.Title className="h3">
                      {formatCurrency(productDetail.Pro_Price)}
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Card.Title className="h3">Description:</Card.Title>

                <Card.Text
                  dangerouslySetInnerHTML={{ __html: productDetail.shortDes }}
                />

                <ul className="list-inline">
                  <li className="list-inline-item">
                    <h3>Unit:</h3>
                  </li>
                  <li className="list-inline-item">
                    <p className="text-muted">
                      <strong>{productDetail.Pro_Unit}</strong>
                    </p>
                  </li>
                </ul>
              </Card.Body>
              <Card.Footer className="text-muted">
                {quantity === 0 ? (
                  <Row>
                    <Col className=" d-grid ">
                      <Button
                        onClick={() =>
                          increaseCartQuantity(productDetail.ProDe_Id)
                        }
                      >
                        + Add to Cart
                      </Button>
                    </Col>
                  </Row>
                ) : (
                  <div
                    className="d-flex align-items-center flex-column"
                    style={{ gap: "0.25rem" }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ gap: "1rem" }}
                    >
                      <Button
                        onClick={() =>
                          decreaseCartQuantity(productDetail.ProDe_Id)
                        }
                      >
                        -
                      </Button>
                      <div>
                        <span className="fs-3">{quantity} </span>
                        in cart
                      </div>

                      <Button
                        onClick={() =>
                          increaseCartQuantity(productDetail.ProDe_Id)
                        }
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      variant="danger"
                      size="small"
                      style={{ borderRadius: "10px" }}
                      onClick={() => removeItem(productDetail.ProDe_Id)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>

      <Container className="bg-white p-5 mt-5">
        <Row className=" fs-3 fw-bold  text-success">Product Information</Row>
        <div dangerouslySetInnerHTML={{ __html: productDetail.longDes }} />
      </Container>
    </div>
  );
};

export default DetailPages;
