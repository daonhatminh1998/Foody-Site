import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const OtherHeader = (e) => {
  const { label, id } = e;
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
        <Container>
          {id ? (
            <>
              <h1 className="display-3 mb-3 animated slideInDown">{id}</h1>
              <nav aria-label="breadcrumb animated slideInDown">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link className="text-body" to="/HomePage">
                      Home
                    </Link>
                  </li>

                  <li className="breadcrumb-item">
                    <Link className="text-body" to={`/${label}`}>
                      {label}
                    </Link>
                  </li>

                  <li
                    className="breadcrumb-item text-dark active"
                    aria-current="page"
                  >
                    {id}
                  </li>
                </ol>
              </nav>
            </>
          ) : (
            <>
              <h1 className="display-3 mb-3 animated slideInDown">{label}</h1>
              <nav aria-label="breadcrumb animated slideInDown">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link className="text-body" to="/HomePage">
                      Home
                    </Link>
                  </li>

                  <li
                    className="breadcrumb-item text-dark active"
                    aria-current="page"
                  >
                    {label}
                  </li>
                </ol>
              </nav>
            </>
          )}
        </Container>
      </div>
    </>
  );
};
export default OtherHeader;
