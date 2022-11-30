import { Col, Row, Image, Card } from "react-bootstrap";
import { useCart } from "../../store/Cart";
import formatCurrency from "../../utilities/formatCurrency";

export function Item({ id, quantity, select }) {
  const { items } = useCart();

  const item = items.find((i) => i.ProDe_Id === id);
  if (!item) return null;

  return (
    <>
      {select ? (
        <Card
          key={item.ProDe_Id}
          className="d-flex align-items-center p-2 bg-light "
        >
          <Card.Body>
            <Card.Title>{item.Pro_Name}</Card.Title>

            <Row>
              <Col>
                <Image src={item.Pro_Avatar} className="img-fluid" />
              </Col>
              <Col>x {quantity}</Col>
              <Col className="fs-6">{formatCurrency(item.Pro_Price)}</Col>
            </Row>
          </Card.Body>
        </Card>
      ) : (
        ""
      )}
    </>
  );
}
