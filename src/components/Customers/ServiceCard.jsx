import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceCard.css";

const ServiceCard = ({ title, description, image, updated, link, id }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const MAX_WORDS = 15;
  const MAX_CHARS = 100;

  const truncateDescription = (text) => {
    if (!text) return '';
    
    // First truncate by character length
    let truncated = text.length > MAX_CHARS ? text.substring(0, MAX_CHARS) + '...' : text;
    
    // Then truncate by word count if needed
    const words = truncated.split(' ');
    if (words.length > MAX_WORDS) {
      truncated = words.slice(0, MAX_WORDS).join(' ') + '...';
    }
    
    return truncated;
  };

  const handleClick = (e) => {
    if (e.target.classList.contains('see-more-link') || 
        e.target.classList.contains('book-now-btn')) {
      return;
    }
    setShowModal(true);
  };

  const handleBookNow = (e) => {
    let serviceType = 'Service';
    if (title.includes('Promo')) serviceType = 'Promo';
    if (title.includes('Surgery')) serviceType = 'Surgery';
    
    navigate(`/booking?serviceId=${id}&type=${serviceType}`);
  };

  return (
    <>
      <div
        className="card mb-4 mx-auto shadow-sm"
        style={{ 
          width: "100%", 
          height: "220px", 
          cursor: "pointer",
          display: "flex",
          flexDirection: "row"
        }}
        onClick={handleClick}
      >
        <div style={{ 
          width: "40%",
          height: "100%",
          overflow: "hidden"
        }}>
          <img
            src={image || './assets/default-image.jpg'}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        </div>
        <div style={{ 
          width: "60%",
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            <h5 style={{ 
              fontSize: "1.1rem",
              marginBottom: "10px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>
              {title}
            </h5>
            <p style={{
              fontSize: "0.9rem",
              marginBottom: "10px",
              height: "60px",
              overflow: "hidden"
            }}>
              {truncateDescription(description)}
              {(description && (description.split(' ').length > MAX_WORDS || description.length > MAX_CHARS)) && (
                <span 
                  className="see-more-link text-primary"
                  onClick={() => setShowModal(true)}
                  style={{ cursor: 'pointer', marginLeft: "5px" }}
                >
                  See More
                </span>
              )}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <small className="text-muted">{updated}</small>
            <button 
              className="btn btn-bookser book-now-btn"
              onClick={handleBookNow}
            >
              {title.includes('Product') ? 'Buy Now' : 'Book Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal/Popup */}
      {showModal && (
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
              onClick={() => setShowModal(false)}
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
                    src={image || './assets/default-image.jpg'}
                    alt={title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <h2 style={{ marginTop: 0 }}>{title}</h2>
                  <p>{description}</p>
                  <small className="text-muted">Last updated: {updated}</small>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={handleBookNow}
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
                  {title.includes('Product') ? 'Buy Now' : 'Book Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceCard;