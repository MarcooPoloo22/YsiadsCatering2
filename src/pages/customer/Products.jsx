import React, { useState, useEffect } from "react";
import "../../styles/customer/Services.css";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const MAX_WORDS = 15;
  const MAX_CHARS = 100;

  useEffect(() => {
    fetch('http://localhost/admin_dashboard_backend/fetch_products.php')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

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

  const handleCardClick = (product, e) => {
    if (e.target.classList.contains('see-more-link')) {
      return;
    }
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <>
      <div className="service-header" style={{ backgroundImage: "url('./assets/spa_products.jpg')" }}>
        <div className="overlay">
          <h1 className="service-title">Our Products</h1>
        </div>
      </div>
      <div className="container my-5">
        <div className="row g-4 mt-3">
        {products.map((product, index) => (
  <div 
    className="col-12 col-md-6 fade-in"
    key={product.id}
    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
  >
              <div 
                className="card mb-4 mx-auto shadow-sm"
                style={{ 
                  width: "100%", 
                  height: "220px", 
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "row"
                }}
                onClick={(e) => handleCardClick(product, e)}
              >
                <div style={{ 
                  width: "40%",
                  height: "100%",
                  overflow: "hidden"
                }}>
                  <img
                    src={product.file_url || './assets/default-image.jpg'}
                    alt={product.name}
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
                      {product.name}
                    </h5>
                    <p style={{
                      fontSize: "0.9rem",
                      marginBottom: "10px",
                      height: "60px",
                      overflow: "hidden"
                    }}>
                      {truncateDescription(product.description)}
                      {(product.description && (product.description.split(' ').length > MAX_WORDS || product.description.length > MAX_CHARS)) && (
                        <span 
                          className="see-more-link text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                            setShowModal(true);
                          }}
                          style={{ cursor: 'pointer', marginLeft: "5px" }}
                        >
                          See More
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <small className="text-muted">Price: ₱{parseFloat(product.price).toLocaleString()}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Details Modal */}
      {showModal && selectedProduct && (
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
              }}
            >
              ×
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '20px', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
                <div style={{ flex: 1 }}>
                  <img
                    src={selectedProduct.file_url || './assets/default-image.jpg'}
                    alt={selectedProduct.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <h2 style={{ marginTop: 0 }}>{selectedProduct.name}</h2>
                  <p>{selectedProduct.description}</p>
                  <small className="text-muted">Price: ₱{parseFloat(selectedProduct.price).toLocaleString()}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductsPage;