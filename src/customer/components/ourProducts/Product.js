import { useCart } from "../../store/Cart";
import { Button, Card } from "react-bootstrap";
import formatCurrency from "../../utilities/formatCurrency";
import { Link } from "react-router-dom";
const Product = ({ product }) => {
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useCart();

  const quantity = getItemQuantity(product.ProDe_Id);

  return (
    <>
      <Card className=" h-100 mb-4 product-wap rounded-0">
        <Card className="card rounded-0 position-relative bg-light overflow-hidden">
          <Card.Img
            className=" rounded-0 img-fluid "
            src={product.Pro_Avatar}
            alt="product"
          />
          <div className="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
            <ul className="list-unstyled">
              <li>
                <Link
                  className="btn btn-success text-white mt-2"
                  to={`/Product/${product.ProDe_Id}`}
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}
                >
                  <i className="far fa-eye" />
                </Link>
              </li>
            </ul>
          </div>
        </Card>
        <Card.Body className="d-flex flex-column ">
          <Card.Title className="justify-content-between d-flex align-items-baseline mb-4">
            <span className="pt-2">{product.Pro_Name}</span>

            <span className="ms-2 text-muted">
              {formatCurrency(product.Pro_Price)}
            </span>
          </Card.Title>
          <div className="mt-auto">
            {quantity === 0 ? (
              <Button
                className="w-100"
                onClick={() => increaseCartQuantity(product.ProDe_Id)}
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
                    onClick={() => decreaseCartQuantity(product.ProDe_Id)}
                  >
                    -
                  </Button>
                  <div>
                    <span className="fs-3">{quantity} </span>
                    in cart
                  </div>
                  <Button
                    onClick={() => increaseCartQuantity(product.ProDe_Id)}
                  >
                    +
                  </Button>
                </div>
                <Button
                  variant="danger"
                  size="small"
                  style={{ borderRadius: "10px" }}
                  onClick={() => removeFromCart(product.ProDe_Id)}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default Product;
