import { Button, Col, Row, Image, Form } from "react-bootstrap";
import { useCart } from "../../store/Cart";
import formatCurrency from "../../utilities/formatCurrency";

export function CartItem({ id, quantity, select, price }) {
  const {
    productDetail,

    selectItem,
    addItem,
    removeItem,
    deleteItem,
  } = useCart();

  const item = productDetail.find((i) => i.ProDe_Id === id);
  if (!item) return null;

  return (
    <>
      <Row
        key={item.ProDe_Id}
        className="d-flex align-items-center p-2 bg-light "
      >
        <Col sm="auto" className="p-0 pe-2 text-start">
          <Form.Check
            type="checkbox"
            checked={select}
            onChange={() => {
              selectItem(id, select ? 0 : 1);
            }}
          />
        </Col>

        <Col>
          <Row sm={3}>
            <Col className="p-0">
              <Image src={item.Pro_Avatar} className="img-fluid" />
            </Col>

            <Col className="px-2 ">
              <Col>{item.Pro_Name}</Col>
              <Col>x {quantity}</Col>
              <Col className="fs-6">{formatCurrency(price)}</Col>
            </Col>

            <Col className="align-self-center p-0">
              <Row sm={3} className="gx-1">
                <Col>
                  <Button variant="warning" onClick={() => removeItem(id)}>
                    -
                  </Button>
                </Col>
                <Col>
                  <Button variant="primary" onClick={() => addItem(id)}>
                    +
                  </Button>
                </Col>
                <Col>
                  <Button variant="danger" onClick={() => deleteItem(id)}>
                    &times;
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
