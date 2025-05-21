import React, { useState, useEffect } from "react";
import "../../styles/customer/Services.css";
import Swal from 'sweetalert2';


// Utility function for handling image URLs
const getImageUrl = (url) => {
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/')) {
      return process.env.PUBLIC_URL + url;
    }
    return process.env.PUBLIC_URL + '/uploads/' + url;
  } catch (e) {
    console.error('Invalid image URL:', url, e);
    return process.env.PUBLIC_URL + '/assets/default-catering.jpg';
  }
};

const CateringPackage = ({ title, description, images, price, onOrderNow }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadError, setImageLoadError] = useState(false);
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
    setImageLoadError(false);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    setImageLoadError(false);
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.success) {
          const validatedPackages = data.packages.map(pkg => ({
            ...pkg,
            images: Array.isArray(pkg.images) && pkg.images.length > 0 
              ? pkg.images 
              : [process.env.PUBLIC_URL + '/assets/default-catering.jpg']
          }));
          setPackages(validatedPackages);
        } else {
          setError(data.message || 'Unknown error occurred');
        }
      } catch (err) {
        console.error('Fetch error:', err);
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

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Prepare the data to be sent
  const orderData = {
    packageId: selectedPackage.id,
    title: selectedPackage.title,
    eventDate: formData.eventDate,
    guests: formData.guests,
    dietary: formData.dietary,
    contact: formData.contact
  };

  try {
    const response = await fetch('http://localhost/admin_dashboard_backend/submit_catering_order.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: 'Order Submitted!',
        text: 'Your catering order request has been received.',
        confirmButtonColor: '#6cb33f'
      });
      setShowOrderModal(false);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: result.message || 'Something went wrong. Please try again.',
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Server Error',
      text: 'Could not connect to the server. Please try again later.',
    });
    console.error('Error submitting order:', error);
  }
};


  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading catering packages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center my-5">
        <h4>Error Loading Packages</h4>
        <p>{error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
    {/*

    <div className="service-header" style={{
      background
    }}>
      <div className="full-width-header">
        <div
          className="service-header"
          style={{ backgroundImage: "url('./assets/HeaderPage.JPG')" }}
        >
          <div className="overlay">
            <h1 className="service-title">About The Developers</h1>
          </div>
    </div>

    */}
      <div className="service-header" style={{ 
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/HeaderPage.JPG)`,
      }}>
        <div className="overlay">
          <h1 className="service-title" style={{

          }}>
            Catering Services
          </h1>
        </div>
      </div>

      <div className="container my-5">
        <div className="row g-4 mt-3">
          {packages.map((pkg, index) => (
            <div 
              className="col-12 col-md-6 fade-in" 
              key={pkg.id} 
              style={{ 
                animationDelay: `${index * 100}ms`, 
                animationFillMode: 'both' 
              }}
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

      {showOrderModal && selectedPackage && (
        <div className="modal-overlay" style={{
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
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '10px',
            maxWidth: '850px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button 
              className="modal-close"
              onClick={() => setShowOrderModal(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            
            <div className="modal-body" style={{
              display: 'grid',
              gap: '25px',
              gridTemplateColumns: '1fr 1fr'
            }}>
              <div className="modal-images" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {selectedPackage.images.map((img, index) => (
                  <img
                    key={index}
                    src={getImageUrl(img)}
                    alt={`${selectedPackage.title} ${index + 1}`}
                    className="modal-image"
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                    onError={(e) => {
                      e.target.src = process.env.PUBLIC_URL + '/assets/default-catering.jpg';
                    }}
                  />
                ))}
              </div>
              
              <form onSubmit={handleSubmit} className="order-form" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                <h3>{selectedPackage.title}</h3>
                <p>{selectedPackage.description}</p>
                
                <div className="form-group" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}>
                  <label>Event Date:</label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                    style={{
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div className="form-group" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}>
                  <label>Number of Guests:</label>
                  <input
                    type="number"
                    min="20"
                    max="500"
                    value={formData.guests}
                    onChange={(e) => setFormData({...formData, guests: e.target.value})}
                    style={{
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div className="form-group" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}>
                  <label>Dietary Requirements:</label>
                  <textarea
                    value={formData.dietary}
                    onChange={(e) => setFormData({...formData, dietary: e.target.value})}
                    placeholder="Any special dietary needs or allergies..."
                    style={{
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      minHeight: '80px'
                    }}
                  />
                </div>

                <div className="form-group" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}>
                  <label>Contact Information:</label>
                  <input
                    type="email"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    placeholder="your@email.com"
                    style={{
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div className="form-actions" style={{
                  marginTop: '15px'
                }}>
                  <button 
                    type="submit" 
                    className="btn-submit"
                    style={{
                      background: '#6cb33f',
                      color: 'white',
                      padding: '12px 20px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    Submit Order Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CateringShowcase;