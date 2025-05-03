import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner from "../../assets/customer/spa_massage.jpg";
import "./EPCategory2.css";
import { Link } from "react-router-dom";

const ProductItem = ({ product }) => {
  return (
    <a href="#">
      <Card className="ezy__epcategory2-card p-5 pb-3">
        <div className="ezy__epcategory2-card-img d-flex justify-content-center align-items-center">
          <img src={product.img} alt="..." />
        </div>
        <Card.Body>
          <h2 className="ezy__epcategory2-title mt-2">{product.title}</h2>
        </Card.Body>
      </Card>
    </a>
  );
};

ProductItem.propTypes = {
  product: PropTypes.object.isRequired,
};

const Epcategory2 = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          "http://localhost/admin_dashboard_backend/home_fetch_services.php"
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("Fetched services:", result.data); // Debugging log

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch services");
        }
        
        // Ensure data is always an array
        setServices(Array.isArray(result.data) ? result.data : []);
        
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchServices();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1424,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1124,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="ezy__epcategory2">
      <Container>
        <Row className="align-items-center">
          <Col xs={8}>
            <h2 className="ezy__epcategory2-heading">Services</h2>
          </Col>
          <Col xs={4} className="text-end">
            <Link className="ezy__epcategory2-btn" to="/services" role="button">
              See All
            </Link>
          </Col>
        </Row>

        <Row className="text-center justify-content-start justify-content-xl-center mt-4 mt-md-5">
          <Slider {...settings}>
            {services.map((service, index) => (
              <div key={index} className="p-3">
                <div className="card mx-auto" style={{ width: "18rem" }}>
                  <img 
                    src={service.file_url || banner} // Use file_url from API, fallback to banner
                    className="card-img-top" 
                    alt={service.name} // Use service name for alt text
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = banner;
                    }}
                    style={{ 
                      height: "200px", 
                      objectFit: "cover" 
                    }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{service.name}</h5>
                    <p className="card-text">{service.description}</p>
                    <p className="card-text">Price: ₱{service.price}</p>
                    <Link className="btn btn-primary" to="/booking" role="button">
                      Book Now!
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </Row>
      </Container>
    </section>
  );
};

export default Epcategory2;
