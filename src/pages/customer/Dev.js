import React, { useState, useEffect } from "react";
import "../../styles/customer/Dev.css";

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
            <h1 className="service-title">About The Developers</h1>
          </div>
        </div>

        <div className="developers-list">
          <div className="developer">
            <img src="./assets/Gabo.jpg"/>
            <p className="developer-name">Herrera, Gabriello Gerald</p>
            <p className="age">20</p>
            <p className="role">Backend Developer</p>
          </div>

          <div className="developer">
            <img src="./assets/Mand.jpeg"/>
            <p className="developer-name">Valdivieso, Armand Ledor</p>
            <p className="age">21</p>
            <p className="role">Frontend Developer</p>
          </div>

          <div className="developer">
            <img src="./assets/Sell.png"/>
            <p className="developer-name">Alvarado, Randolph Diosell</p>
            <p className="age">19</p>
            <p className="role">Quality Assurance</p>
          </div>
        </div>

      </div>

 
    </div> 
  );
};

export default Contact;