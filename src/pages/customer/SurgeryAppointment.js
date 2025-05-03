import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/customer/SurgeryAppointment.css";

const SurgeryCard = ({ title, description, time, image, updated, id, onBookNow }) => {
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
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <small className="text-muted">Price: {updated}</small>
          <button 
            className="btn btn-bookser"
            onClick={onBookNow}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

function AppointmentPage() {
  const [surgeryAppointments, setSurgeryAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost/admin_dashboard_backend/home_fetch_surgeries.php");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setSurgeryAppointments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBookNow = (appointment) => {
    navigate(`/booking?type=Surgery&serviceId=${appointment.id}`);
  };

  return (
    <>
      <div className="surgery-header" style={{ backgroundImage: "url('./assets/asr_promo.jpg')" }}>
        <div className="overlay">
          <h1 className="surgery-title">Surgery Appointments</h1>
        </div>
      </div>

      <div className="container my-5">
        <div className="row g-4 mt-3">
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error}</div>}
          
          {!loading && !error && surgeryAppointments.map((appointment, index) => (
            <div 
              className="col-12 col-md-6 fade-in"
              key={appointment.id}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            >
              <SurgeryCard
                title={appointment.title}
                description={appointment.description}
                time={`${appointment.start_date} - ${appointment.end_date}`}
                image={appointment.image_url}
                updated={`₱${appointment.price}`}
                id={appointment.id}
                onBookNow={() => handleBookNow(appointment)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AppointmentPage;