import React, { useState, useEffect } from "react";
import "../../styles/customer/Services.css";

const CateringPackage = ({ title, description, images, price, onOrderNow }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="card mb-4 mx-auto shadow-sm" style={{ 
      width: "100%", 
      height: "220px", 
      cursor: "pointer",
      display: "flex",
      flexDirection: "row"
    }}>
      <div style={{ 
        width: "40%",
        height: "100%",
        overflow: "hidden",
        position: "relative"
      }}>
        <img
          src={images[currentImageIndex] || './assets/default-catering.jpg'}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
          onError={(e) => {
            e.target.src = './assets/default-catering.jpg';
          }}
        />
        
        {/* Image Navigation */}
        {images.length > 1 && (
          <div style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            display: "flex",
            gap: "5px"
          }}>
            <button 
              className="btn btn-sm btn-light"
              onClick={handlePrev}
              style={{ padding: "2px 8px" }}
            >
              ‹
            </button>
            <button 
              className="btn btn-sm btn-light"
              onClick={handleNext}
              style={{ padding: "2px 8px" }}
            >
              ›
            </button>
          </div>
        )}
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
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <small className="text-muted">From ₱{price}</small>
          <button 
            className="btn btn-bookser"
            onClick={(e) => {
              e.stopPropagation();
              onOrderNow();
            }}
          >
            Customize Order
          </button>
        </div>
      </div>
    </div>
  );
};

function CateringShowcase() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [formData, setFormData] = useState({
    eventDate: "",
    guests: 50,
    dietary: "",
    contact: ""
  });

  useEffect(() => {
  const fetchPackages = async () => {
    try {
      const response = await fetch('http://localhost/admin_dashboard_backend/fetch_catering.php');
      if (!response.ok) {
        throw new Error('Failed to fetch catering packages');
      }
      const data = await response.json();
      if (data.success) {
        setPackages(data.packages);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchPackages();
}, []);

  const handleOrderNow = (pkg) => {
    setSelectedPackage(pkg);
    setShowOrderModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Order Details:", { package: selectedPackage, ...formData });
    setShowOrderModal(false);
  };

  if (loading) {
    return <div className="text-center my-5">Loading catering packages...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center my-5">{error}</div>;
  }

  return (
    <>
      <div className="service-header" style={{ backgroundImage: "url('/assets/catering-banner.jpg')" }}>
        <div className="overlay">
          <h1 className="service-title">Catering Services</h1>
        </div>
      </div>

      <div className="container my-5">
        <div className="row g-4 mt-3">
          {packages.map((pkg, index) => (
            <div 
              className="col-12 col-md-6 fade-in" 
              key={pkg.id} 
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            >
              <CateringPackage
                title={pkg.title}
                description={pkg.description}
                images={pkg.images}
                price={pkg.price}
                onOrderNow={() => handleOrderNow(pkg)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Order Form Modal */}
      {showOrderModal && selectedPackage && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="modal-close"
              onClick={() => setShowOrderModal(false)}
            >
              ×
            </button>
            
            <div className="modal-body">
              <div className="modal-images">
                {selectedPackage.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={selectedPackage.title}
                    className="modal-image"
                  />
                ))}
              </div>
              
              <form onSubmit={handleSubmit} className="order-form">
                <h3>{selectedPackage.title}</h3>
                <p>{selectedPackage.description}</p>
                
                <div className="form-group">
                  <label>Event Date:</label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Number of Guests:</label>
                  <input
                    type="number"
                    min="20"
                    max="500"
                    value={formData.guests}
                    onChange={(e) => setFormData({...formData, guests: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Dietary Requirements:</label>
                  <textarea
                    value={formData.dietary}
                    onChange={(e) => setFormData({...formData, dietary: e.target.value})}
                    placeholder="Any special dietary needs or allergies..."
                  />
                </div>

                <div className="form-group">
                  <label>Contact Information:</label>
                  <input
                    type="email"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-submit">
                    Submit Order Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 25px;
          border-radius: 10px;
          max-width: 850px;
          width: 90%;
          max-height: 90vh;
          overflow: auto;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .modal-body {
          display: grid;
          gap: 25px;
          grid-template-columns: 1fr 1fr;
        }

        .modal-images {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .modal-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
        }

        .order-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-group input,
        .form-group textarea {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .btn-submit {
          background: #6cb33f;
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 15px;
        }

        @media (max-width: 768px) {
          .modal-body {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

export default CateringShowcase;