import React from "react";
import { Col, Form, Row } from "react-bootstrap";

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
    const labelClass = `col-sm-${labelSize ? labelSize : 3} col-form-label ${
      required ? "required" : ""
    }`;
    const inputClass = `form-control ${errMessage ? "is-invalid" : ""} `;

    return (
      <Form.Group as={Row} className="mb-3">
        <Form.Label htmlFor={id} className={labelClass}>
          {label}
        </Form.Label>
        <Col>
          {others["rows"] > 1 ? (
            <textarea
              ref={inputRef}
              className="form-control"
              id={id}
              {...others}
              {...formField}
            ></textarea>
          ) : (
            <Form.Control
              ref={inputRef}
              type="text"
              className={inputClass}
              id={id}
              {...others}
              {...formField}
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
