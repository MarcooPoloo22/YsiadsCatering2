import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/customer/Promos.css";

const PromoCard = ({ title, description, time, image, updated, id, onBookNow, onSeeMore }) => {
  const MAX_WORDS = 15;
  const MAX_CHARS = 100;

  const truncateDescription = (text) => {
    if (!text) return '';
    
    let truncated = text.length > MAX_CHARS ? text.substring(0, MAX_CHARS) + '...' : text;
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
    onSeeMore();
  };

  return (
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
          onError={(e) => {
            e.target.src = './assets/default-image.jpg';
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
                onClick={(e) => {
                  e.stopPropagation();
                  onSeeMore();
                }}
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
            onClick={(e) => {
              e.stopPropagation();
              onBookNow();
            }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

function PromosPage() {
  const [promoList, setPromoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await fetch('http://localhost/admin_dashboard_backend/nav_fetch_promos.php');
        if (!response.ok) {
          throw new Error('Failed to fetch promos');
        }
        const data = await response.json();
        
        const formattedData = data.map(promo => ({
          id: promo.id,
          title: promo.name,
          description: promo.description,
          start_date: new Date(promo.start_date).toLocaleDateString(),
          end_date: new Date(promo.end_date).toLocaleDateString(),
          image_url: promo.file_url,
          price: promo.price.toLocaleString('en-PH', { 
            style: 'currency', 
            currency: 'PHP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        }));

        setPromoList(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  const handleBookNow = (promoId, promoTitle) => {
    navigate(`/booking?type=Promo&serviceId=${promoId}&promoName=${encodeURIComponent(promoTitle)}`);
  };

  const handleSeeMore = (promo) => {
    setSelectedPromo(promo);
    setShowModal(true);
  };

  if (loading) {
    return <div className="text-center my-5">Loading promos...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center my-5">{error}</div>;
  }

  return (
    <>
      <div className="promos-header" style={{ backgroundImage: "url('./assets/asr_promo.jpg')" }}>
        <div className="overlay">
          <h1 className="promos-title">Our Promo Packages</h1>
        </div>
      </div>

      <div className="container my-4">
        <div className="row mt-3">
          {promoList.map((promo, index) => (
            <div
              className="col-12 col-md-6 fade-in"
              key={promo.id}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            >
              <PromoCard
                title={promo.title}
                description={promo.description}
                time={`${promo.start_date} - ${promo.end_date}`}
                image={promo.image_url}
                updated={promo.price}
                id={promo.id}
                onBookNow={() => handleBookNow(promo.id, promo.title)}
                onSeeMore={() => handleSeeMore(promo)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Promo Details Modal */}
      {showModal && selectedPromo && (
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
                    src={selectedPromo.image_url || './assets/default-image.jpg'}
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
                  <p>{selectedPromo.description}</p>
                  <small className="text-muted">Valid: {selectedPromo.time}</small>
                  <p className="text-muted">Price: {selectedPromo.updated}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => {
                    handleBookNow(selectedPromo.id, selectedPromo.title);
                    setShowModal(false);
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
    </>
  );
}

export default PromosPage;