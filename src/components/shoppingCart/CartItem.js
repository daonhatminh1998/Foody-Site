import { Button, Col, Row, Stack, Image } from "react-bootstrap";
import { useCart } from "../../store/Cart";
import formatCurrency from "../../utilities/formatCurrency";

export function CartItem({ id, quantity }) {
  const {
    removeFromCart,
    increaseCartQuantity,
    decreaseCartQuantity,
    productDetail,

    addItem,
    removeItem,
    deleteItem,
  } = useCart();

  const item = productDetail.find((i) => i.ProDe_Id === id);
  if (!item) return null;

  return (
    <Stack
      direction="horizontal"
      gap={2}
      className="d-flex align-items-center py-2 bg-light rounded rounded-5"
      key={item.ProDe_Id}
    >
      <Row className="p-0 m-0">
        <Col>
          <Row>
            <Image src={item.Pro_Avatar} alt="" />
          </Row>
        </Col>
        <Col>
          <Row>
            {item.Pro_Name}
            {/* {formatCurrency(item.Pro_Price)} */}
          </Row>
          <Row>{quantity >= 1 ? ` x ${quantity}` : ""}</Row>
          <Row>{formatCurrency(item.Pro_Price * quantity)}</Row>
        </Col>

        <Col className="mt-4">
          <Row className="row row-cols-3">
            <Col className="p-0 m-0">
              <Button
                className=""
                variant="warning"
                onClick={() => decreaseCartQuantity(item.ProDe_Id)}
              >
                -
              </Button>
            </Col>
            <Col className="p-0 m-0 ">
              <Button
                className=""
                variant="primary"
                onClick={() => increaseCartQuantity(item.ProDe_Id)}
              >
                +
              </Button>
            </Col>
            <Col className="p-0 m-0">
              <Button
                className=""
                variant="danger"
                onClick={() => removeFromCart(item.ProDe_Id)}
              >
                &times;
              </Button>
            </Col>
          </Row>
        </Col>

        <Row>
          <Col className="">
            <Row className="row row-cols-3">
              <Col className="p-0 m-0">
                <Button
                  className=""
                  variant="warning"
                  onClick={() => removeItem(item.ProDe_Id)}
                >
                  -
                </Button>
              </Col>
              <Col className="p-0 m-0 ">
                <Button
                  className=""
                  variant="primary"
                  onClick={() => addItem(item.ProDe_Id)}
                >
                  +
                </Button>
              </Col>
              <Col className="p-0 m-0">
                <Button
                  className=""
                  variant="danger"
                  onClick={() => deleteItem(item.ProDe_Id)}
                >
                  &times;
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Row>
    </Stack>
  );
}
