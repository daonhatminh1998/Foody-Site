import React from "react";

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
      <div className="row mb-3">
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
        <div className="col-sm">
          {others["rows"] > 1 ? (
            <textarea
              ref={inputRef}
              className="form-control"
              id={id}
              {...others}
              {...formField}
            ></textarea>
          ) : (
            <input
              ref={inputRef}
              type="text"
              className={inputClass}
              id={id}
              {...others}
              {...formField}
            />
          )}
          {errMessage ? (
            <div className="invalid-feedback">{errMessage}</div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default Input;
