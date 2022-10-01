import { Button, Card, Carousel, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import OtherHeader from "../components/OtherHeader";
import { useCart } from "../store/Cart";
import formatCurrency from "../utilities/formatCurrency";

const DetailPages = () => {
  const { id } = useParams();
  const {
    productDetail,
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useCart();

  const quantity = getItemQuantity(Number(id));
  return productDetail
    .filter((index) => index.ProDe_Id === Number(id))
    .map((index) => (
      <div key={index.ProDe_Id} className="bg-icon">
        <OtherHeader label="Products" id={` ${index.Pro_Name}`} />

        <Container className=" py-5">
          <Row>
            <Col lg={5} className=" text-center ">
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100 img-fluid"
                    src={index.Pro_Avatar}
                    alt="First slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100 img-fluid"
                    src={index.Pro_Avatar}
                    alt="Second slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100 img-fluid"
                    src={index.Pro_Avatar}
                    alt="Third slide"
                  />
                </Carousel.Item>
              </Carousel>
            </Col>

            <Col lg={7}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col>
                      <Card.Title className="h2">{index.Pro_Name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {index.type.Pro_Type}
                      </Card.Subtitle>
                    </Col>
                    <Col sm="auto">
                      <Card.Title className="h2 ">
                        {formatCurrency(index.Pro_Price)}
                      </Card.Title>
                    </Col>
                  </Row>

                  <Card.Title>Description:</Card.Title>
                  <Card.Text
                    dangerouslySetInnerHTML={{ __html: index.shortDes }}
                  />
                  <ul className="list-inline">
                    <li className="list-inline-item">
                      <h6>Unit :</h6>
                    </li>
                    <li className="list-inline-item">
                      <p className="text-muted">
                        <strong>{index.Pro_Unit}</strong>
                      </p>
                    </li>
                  </ul>
                </Card.Body>

                {quantity === 0 ? (
                  <Button
                    className="w-100"
                    onClick={() => increaseCartQuantity(index.ProDe_Id)}
                  >
                    + Add to Cart
                  </Button>
                ) : (
                  <Card.Footer
                    className="d-flex align-items-center flex-column"
                    style={{ gap: "0.25rem" }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ gap: "1rem" }}
                    >
                      <Button
                        onClick={() => decreaseCartQuantity(index.ProDe_Id)}
                      >
                        -
                      </Button>
                      <div>
                        <span className="fs-3">
                          {quantity} {console.log(quantity)}
                        </span>
                        in cart
                      </div>
                      <Button
                        onClick={() => increaseCartQuantity(index.ProDe_Id)}
                      >
                        +
                      </Button>
                    </div>

                    <Button
                      variant="danger"
                      size="small"
                      style={{ borderRadius: "10px" }}
                      onClick={() => removeFromCart(index.ProDe_Id)}
                    >
                      Remove
                    </Button>
                  </Card.Footer>
                )}
              </Card>
            </Col>
          </Row>
        </Container>

        <section className="bg-light py-5">
          <Container>
            <Row className=" fs-3 fw-bold text-success">
              Product Information
            </Row>
            <div className="border pt-2 mb-4">
              <p dangerouslySetInnerHTML={{ __html: index.shortDes }} />
            </div>
          </Container>
        </section>
      </div>
    ));
};

export default DetailPages;
