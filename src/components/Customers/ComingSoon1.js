import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./ComingSoon1.css";

// Reusable fade-in on scroll
const FadeInSection = ({ children }) => {
  const domRef = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      });
    });

    if (domRef.current) observer.observe(domRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fade-in-section ${isVisible ? "is-visible" : ""}`}
      ref={domRef}
    >
      {children}
    </div>
  );
};

const ComingSoon1 = () => {
  return (
    <section className="ezy__comingsoon1">
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col
            xs={12}
            lg={5}
            className="d-flex flex-column justify-content-center text-center text-lg-start"
          >
            <FadeInSection>
              <h2 className="ezy__comingsoon1-heading mb-4">
                Your Satisfaction is Our Top Priority
              </h2>
              <p className="ezy__comingsoon1-sub-heading">
                Celebrate life's special moments with our tailored catering services, crafted to perfection just for you.
              </p>
            </FadeInSection>
          </Col>

          <Col xs={12} lg={7}>
            <FadeInSection>
              <div className="ezy__comingsoon1-image-grid">
                <img
                  src="./assets/Table1copy.JPG"
                  alt="Spa 1"
                  className="img-fluid rounded shadow"
                />
                <img
                  src="./assets/Table2copy.JPG"
                  alt="Spa 2"
                  className="img-fluid rounded shadow"
                />
                <img
                  src="./assets/Table3copy.JPG"
                  alt="Spa 3"
                  className="img-fluid rounded shadow"
                />
              </div>
            </FadeInSection>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ComingSoon1;
