import { Button, Card, Carousel, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

import OtherHeader from "../components/header/OtherHeader";

import { useCart } from "../store/Cart";
import formatCurrency from "../utilities/formatCurrency";

const DetailPages = () => {
  const { id } = useParams();
  const { productDetail, getItemQuantity, addItem, removeItem, deleteItem } =
    useCart();

  const quantity = getItemQuantity(Number(id));

  return productDetail
    .filter((index) => index.ProDe_Id === Number(id))
    .map((index) => (
      <div key={index} className="bg-light">
        <OtherHeader label="OurProducts" id={index.Pro_Name} />
        <Container className="bg-white bg-icon mt-4 p-3">
          <Row>
            <Col lg={5} className=" text-center ">
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={`${process.env.PUBLIC_URL}${index.Pro_Avatar}`}
                    alt="First slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={`${process.env.PUBLIC_URL}${index.Pro_Avatar}`}
                    alt="Second slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={`${process.env.PUBLIC_URL}${index.Pro_Avatar}`}
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
                        {index.Pro_Name}
                        <Card.Subtitle className="mb-2 text-muted">
                          {index.type.Pro_Type}
                        </Card.Subtitle>
                      </Card.Title>
                    </Col>
                    <Col sm="auto align-self-center">
                      <Card.Title className="h3">
                        {formatCurrency(index.Pro_Price)}
                      </Card.Title>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  <Card.Title className="h3">Description:</Card.Title>

                  <Card.Text
                    dangerouslySetInnerHTML={{ __html: index.shortDes }}
                  />

                  <ul className="list-inline">
                    <li className="list-inline-item">
                      <h3>Unit:</h3>
                    </li>
                    <li className="list-inline-item">
                      <p className="text-muted">
                        <strong>{index.Pro_Unit}</strong>
                      </p>
                    </li>
                  </ul>
                </Card.Body>
                <Card.Footer className="text-muted">
                  {quantity === 0 ? (
                    <Row>
                      <Col className=" d-grid ">
                        <Button onClick={() => addItem(index.ProDe_Id)}>
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
                        <Button onClick={() => removeItem(index.ProDe_Id)}>
                          -
                        </Button>
                        <div>
                          <span className="fs-3">{quantity} </span>
                          in cart
                        </div>

                        <Button onClick={() => addItem(index.ProDe_Id)}>
                          +
                        </Button>
                      </div>
                      <Button
                        variant="danger"
                        size="small"
                        style={{ borderRadius: "10px" }}
                        onClick={() => deleteItem(index.ProDe_Id)}
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
          <div dangerouslySetInnerHTML={{ __html: index.longDes }} />
        </Container>
      </div>
    ));
};

export default DetailPages;
