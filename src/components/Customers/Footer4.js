import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import "./Footer4.css";

const Footer4 = () => {
  const fetchPolicy = async (type) => {
    try {
      const response = await fetch(`http://localhost/admin_dashboard_backend/fetch_${type}.php`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type}`);
      }
      const data = await response.json();
      
      Swal.fire({
        title: type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions',
        html: `<div class="policy-content">${data.content}</div>`,
        width: '80%',
        customClass: {
          popup: 'policy-popup',
          content: 'policy-text',
        },
        showCloseButton: true,
        showConfirmButton: false,
        scrollbarPadding: false
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <footer className="ezy__footer4">
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col xs="auto" className="text-center">
            <img
              src="/assets/asr_logoround.png"
              alt="ASR Logo"
              className="footer-logo-img"
            />
          </Col>
          <Col xs="auto" className="text-center">
            <div>
              <a href="#!" className="footer-link" onClick={() => fetchPolicy('privacy')}>
                Privacy Policy
              </a>
              <a href="#!" className="footer-link" onClick={() => fetchPolicy('terms')}>
                Terms & Condition
              </a>
              <p className="footer-copy">
                © {new Date().getFullYear()} Aesthetics Skin Renewed. All rights reserved.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer4;