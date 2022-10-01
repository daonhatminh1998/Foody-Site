import React from "react";
import { Link } from "react-router-dom";

const OtherHeader = ({ label, id }) => {
  return (
    <>
      <div
        className="container-fluid page-header wow fadeIn"
        style={{
          backgroundImage: `url(${
            process.env.PUBLIC_URL + "/img/carousel-1.jpg"
          })`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top rignt",
          backgroundSize: "cover",
        }}
      >
        <div className="container">
          <h1 className="display-3 mb-3 animated slideInDown">{label}</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link className="text-body" to="/HomePage">
                  Home
                </Link>
              </li>
              {id ? (
                <>
                  <li className="breadcrumb-item">
                    <Link className="text-body" to={`/${label}`}>
                      {label}
                    </Link>
                  </li>
                  <li className="breadcrumb-item">{id}</li>
                </>
              ) : (
                <li className="breadcrumb-item">{label}</li>
              )}
            </ol>
          </nav>
        </div>
      </div>
    </>
  );
};
export default OtherHeader;
