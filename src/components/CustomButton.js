import React from "react";
const CustomButton = (props) => {
  const {
    color,
    icon,
    iconColor = "white",
    isLoading = false,
    className = "",
    onClick,
    ...others
  } = props;
  const btnClass = `btn btn-${color} ${className}`;
  const spinnerClass = `spinner-border spinner-border-sm text-${iconColor}`;
  const iconClass = `${icon} text-${iconColor} me-1`;
  return (
    <button type="button" onClick={onClick} className={btnClass} {...others}>
      {isLoading ? (
        <div className={spinnerClass} />
      ) : icon ? (
        <span className={iconClass} />
      ) : (
        ""
      )}
      {props.children}
    </button>
  );
};

export default CustomButton;
