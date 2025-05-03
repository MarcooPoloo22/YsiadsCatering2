import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./EPCategory2.css";

const Epcategory2 = () => {
  const [promos, setPromos] = useState([]);
  const navigate = useNavigate();
  const MAX_WORDS = 20;
  const MAX_CHARS = 100;

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await fetch("http://localhost/admin_dashboard_backend/home_fetch_promos.php");
        const data = await response.json();
        if (data.success) {
          setPromos(data.data);
        } else {
          console.error("Failed to fetch promos:", data.error);
        }
      } catch (error) {
        console.error("Error fetching promos:", error);
      }
    };

    fetchPromos();
  }, []);

  const truncateDescription = (text) => {
    if (!text) return '';
    
    let truncated = text.length > MAX_CHARS ? text.substring(0, MAX_CHARS) + '...' : text;
    
    const words = truncated.split(' ');
    if (words.length > MAX_WORDS) {
      truncated = words.slice(0, MAX_WORDS).join(' ') + '...';
    }
    
    return truncated;
  };

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

  const [selectedPromo, setSelectedPromo] = useState(null);

  const handleCardClick = (promo, e) => {
    if (e.target.classList.contains('see-more-link') || 
        e.target.classList.contains('btn-primary')) {
      return;
    }
    setSelectedPromo(promo);
  };

  const handleBookNow = (promoId, e) => {
    e.stopPropagation();
    navigate(`/booking?serviceId=${promoId}&type=Promo`);
  };

  return (
    <section className="ezy__epcategory2">
      <Container>
        <Row className="align-items-center">
          <Col xs={8}>
            <h2 className="ezy__epcategory2-heading">Promo</h2>
          </Col>
          <Col xs={4} className="text-end">
            <Link className="ezy__epcategory2-btn" to="/promos" role="button">
              See All
            </Link>
          </Col>
        </Row>

        <Row className="mt-4 mt-md-5">
          {promos.length > 0 ? (
            <Slider {...settings}>
              {promos.map((promo) => (
                <div key={promo.id} className="px-2 h-100">
                  <Card 
                    className="ezy__epcategory2-card h-100"
                    onClick={(e) => handleCardClick(promo, e)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="ezy__epcategory2-card-img">
                      <img src={promo.image} alt={promo.title} className="img-fluid w-100" />
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="ezy__epcategory2-title text-center">{promo.title}</Card.Title>
                      <Card.Text className="ezy__epcategory2-description flex-grow-1">
                        {truncateDescription(promo.description)}
                        {(promo.description && (promo.description.split(' ').length > MAX_WORDS || promo.description.length > MAX_CHARS)) && (
                          <span 
                            className="see-more-link text-primary"
                            onClick={() => setSelectedPromo(promo)}
                            style={{ cursor: 'pointer', marginLeft: "5px" }}
                          >
                            See More
                          </span>
                        )}
                      </Card.Text>
                      <div className="mt-auto">
                        <Card.Text className="ezy__epcategory2-price text-center">Price: ₱{promo.price}</Card.Text>
                        <button
                          className="btn btn-primary w-100 mt-2 d-flex justify-content-center align-items-center"
                          onClick={(e) => handleBookNow(promo.id, e)}
                        >
                          Book Now!
                        </button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Slider>
          ) : (
            <p>Loading promos...</p>
          )}
        </Row>
      </Container>

      {/* Modal/Popup */}
      {selectedPromo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedPromo(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'white',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#ff4444"}
              onMouseOut={(e) => e.target.style.backgroundColor = "white"}
            >
              ×
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '20px', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
                <div style={{ flex: 1 }}>
                  <img
                    src={selectedPromo.image}
                    alt={selectedPromo.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <h2 style={{ marginTop: 0 }}>{selectedPromo.title}</h2>
                  <p style={{ maxHeight: '200px', overflowY: 'auto' }}>{selectedPromo.description}</p>
                  <p className="ezy__epcategory2-price">Price: ₱{selectedPromo.price}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={(e) => {
                    setSelectedPromo(null);
                    navigate(`/booking?serviceId=${selectedPromo.id}&type=Promo`);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6cb33f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#a2bf5a"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#6cb33f"}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Epcategory2;