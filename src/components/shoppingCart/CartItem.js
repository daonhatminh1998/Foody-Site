import { useEffect } from "react";
import { useState } from "react";
import { Button, Col, Row, Image, Form } from "react-bootstrap";
import ProductDetailService from "../../services/productDetailService";
import { useCart } from "../../store/Cart";
import formatCurrency from "../../utilities/formatCurrency";

export function CartItem({ id, quantity, select }) {
  const {
    items,
    selectItem,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useCart();

  const item = items.find((i) => i.ProDe_Id === id);
  if (!item) return null;

  return (
    <>
      <Row key={item.id} className="d-flex align-items-center p-2 bg-light ">
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
              <Col className="fs-6">{formatCurrency(item.Pro_Price)}</Col>
            </Col>

            <Col className="align-self-center p-0">
              <Row sm={3} className="gx-1">
                <Col>
                  <Button
                    variant="warning"
                    onClick={() => decreaseCartQuantity(id)}
                  >
                    -
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="primary"
                    onClick={() => increaseCartQuantity(id)}
                  >
                    +
                  </Button>
                </Col>
                <Col>
                  <Button variant="danger" onClick={() => removeFromCart(id)}>
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
