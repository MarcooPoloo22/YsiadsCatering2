import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../../styles/customer/Details.css";

function Details() {
  const { type, id } = useParams();
  const location = useLocation(); 
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.product) {
      setDetails(location.state.product);
      setLoading(false);
    } else {
      const fetchDetails = async () => {
        try {
          const response = await fetch(`http://localhost/admin_dashboard_backend/fetch_${type}.php?id=${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch details");
          }
          const data = await response.json();
          setDetails(data);
        } catch (error) {
          console.error(`Error fetching ${type} details:`, error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }
  }, [type, id, location.state]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="details-container">
      <button onClick={() => navigate(-1)} className="back-button">Back</button>
      <div className="details-content">
        <img src={details.file_url} alt={details.name} className="details-image" />
        <h1 className="details-title">{details.name}</h1>
        <p className="details-description">{details.description}</p>
        <p className="details-price">Price: ₱{parseFloat(details.price).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default Details;