import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faLinkedinIn,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Col, Row } from "react-bootstrap";

const Header = () => {
  return (
    <>
      <Row className="top-bar gx-0 align-items-center d-none d-lg-flex">
        <Col lg={6} className=" px-5 text-start">
          <small>
            <i className="fa fa-map-marker-alt me-2" />
            123 Street, New York, USA
          </small>
          <small className="ms-4">
            <i className="fa fa-envelope me-2" />
            info@example.com
          </small>
        </Col>
        <Col lg={6} className=" px-5 text-end">
          <small>Follow us:</small>
          <a href="https://facebook.com" className="text-body ms-3">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a className="text-body ms-3" href="https://twitter.com/">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a className="text-body ms-3" href="https://www.linkedin.com/">
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
          <a className="text-body ms-3" href="https://www.instagram.com/">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </Col>
      </Row>
    </>
  );
};

export default Header;
