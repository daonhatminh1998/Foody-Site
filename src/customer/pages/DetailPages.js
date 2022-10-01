import { Button, Carousel, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useCart } from "../store/Cart";
import formatCurrency from "../utilities/formatCurrency";
const DetailPages = () => {
  const { id } = useParams();
  const {
    products,
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useCart();

  const quantity = getItemQuantity(Number(id));
  return (
    <>
      {products
        .filter((index) => index.ProDe_Id === Number(id))
        .map((index) => (
          <div
            className="container-fluid bg-light bg-icon py-6"
            key={index.ProDe_Id}
          >
            <Container>
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

                <div className="col-lg-7 ">
                  <div className="card">
                    <div className="card-body">
                      <h1 className="h2">{index.Pro_Name}</h1>
                      <p className="h3 py-2">
                        {formatCurrency(index.Pro_Price)}
                      </p>
                      <ul className="list-inline">
                        <li className="list-inline-item">
                          <p className="text-muted">
                            <strong>{index.productss.Pro_Type}</strong>
                          </p>
                        </li>
                      </ul>
                      <h6>Description:</h6>
                      {index.Pro_Description}
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

                      <form action="trueT">
                        <input
                          type="hidden"
                          name="product-title"
                          defaultValue="Activewear"
                        />
                        <div className="mt-auto">
                          {quantity === 0 ? (
                            <Button
                              className="w-100"
                              onClick={() =>
                                increaseCartQuantity(index.ProDe_Id)
                              }
                            >
                              + Add to Cart
                            </Button>
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
                                    decreaseCartQuantity(index.ProDe_Id)
                                  }
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
                                  onClick={() =>
                                    increaseCartQuantity(index.ProDe_Id)
                                  }
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
                            </div>
                          )}
                        </div>
                        {/* <div className="row pb-3">
                          <div className="col d-grid mx-5">
                            <button
                              type="button"
                              className="btn btn-success btn-lg"
                              name="submit"
                              defaultValue="buy"
                            >
                              Thêm Vào Giỏ Hàng
                            </button>
                          </div>
                        </div> */}
                      </form>
                    </div>
                  </div>
                </div>
              </Row>

              <Row className=" fs-3 fw-bold mt-5 text-success">
                Product Information
              </Row>
              <div className="border p-5 mt-4 mb-4">
                {/* <ProductInfor title="product name" details="Body Cleanser 330ml" />
          <ProductInfor title="product name" details="Body Cleanser 330ml" />
          <ProductInfor title="product name" details="Body Cleanser 330ml" />
          <ProductInfor title="product name" details="Body Cleanser 330ml" />
          <ProductInfor title="product name" details="Body Cleanser 330ml" /> */}
              </div>
            </Container>
          </div>
        ))}
    </>
  );
};

export default DetailPages;
