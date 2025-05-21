import React, { useState, useEffect } from "react";
import "../../styles/customer/Contact.css";

const Contact = () => {
  const [phone, setPhone] = useState("+63 9172385134");
  const [facebook, setFacebook] = useState("https://facebook.com");
  const [instagram, setInstagram] = useState("https://instagram.com");
  const [twitter, setTwitter] = useState("https://twitter.com");

  // Fetch contact data from the backend
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch("http://localhost/admin_dashboard_backend/fetch_contact.php");
        if (!response.ok) {
          throw new Error("Failed to fetch contact data");
        }
        const data = await response.json();
        setPhone(data.phone);
        setFacebook(data.facebook);
        setInstagram(data.instagram);
        setTwitter(data.twitter);
      } catch (error) {
        console.error("Error fetching contact data:", error);
      }
    };

    fetchContactData();
  }, []);

  return (
    <div className="contact-container">
      <div className="full-width-header">
        <div
          className="service-header"
          style={{ backgroundImage: "url('./assets/HeaderPage.JPG')" }}
        >
          <div className="overlay">
            <h1 className="service-title">Feel Free to Contact Us</h1>
          </div>
        </div>
      </div>
      <div className="contact-sections">
      <div className="contact-box fade-in">
      <i className="phone-icon">📞</i>
        <h3>Talk to a member of our team</h3>
        <p>Interested in our services? Give us a call!</p>
        <p className="contact-number">{phone}</p>
     </div>
     <div className="social-box fade-in">
      <i className="social-icon">🌍</i>
      <h3>Reach us through our socials</h3>
        <p>Connect with us on social media. Just click below!</p>
      <div className="social-icons">
        <a href={facebook} className="social-link" target="_blank" rel="noopener noreferrer">📘</a>
        <a href={instagram} className="social-link" target="_blank" rel="noopener noreferrer">📷</a>
        <a href={twitter} className="social-link" target="_blank" rel="noopener noreferrer">🐦</a>
      </div>
    </div> 
  </div>
</div>
  );
};

export default Contact;