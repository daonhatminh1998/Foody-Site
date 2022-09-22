import React from "react";
import { Col, Row, Form } from "react-bootstrap";

class Input extends React.Component {
  render() {
    const {
      id,
      inputRef,
      label,
      labelSize,
      required,
      formField,
      errMessage,
      ...others
    } = this.props;

    const labelClass = `col-sm-${labelSize ? labelSize : 3} ${
      required ? "required" : ""
    }`;

    return (
      <Form.Group as={Row} className="mb-3">
        <Form.Label htmlFor={id} className={labelClass}>
          {label}
        </Form.Label>
        <Col>
          {others["rows"] > 1 ? (
            <Form.Control
              as="textarea"
              id={id}
              {...others}
              {...formField}
            ></Form.Control>
          ) : (
            <Form.Control
              type="text"
              ref={inputRef}
              id={id}
              {...others}
              {...formField}
              isInvalid={errMessage}
            />
          )}

          {errMessage ? (
            <Form.Control.Feedback type="invalid">
              {errMessage}
            </Form.Control.Feedback>
          ) : (
            ""
          )}
        </Col>
      </Form.Group>
    );
  }
}

export default Input;
