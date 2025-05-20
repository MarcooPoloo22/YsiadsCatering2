import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PromosSection from "../../components/Customers/PromoSection.js";
import EPCat from "../../components/Customers/EPCategory2";
import Con1 from "../../components/Customers/ComingSoon1";
import Con2 from "../../components/Customers/ComingSoon3";
import Con3 from "../../components/Customers/ComingSoon5";
import "../../styles/customer/Home.css";

function Home() {
  const images = [
    "/assets/HomePic1.JPG",
    "/assets/HomePic2.JPG",
    "/assets/HomePic3.JPG"
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <div className="banner-wrapper position-relative overflow-hidden">
        <div className="banner-images">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index}`}
              className={`banner-img ${index === current ? "active" : ""}`}
            />
          ))}
        </div>

        <div className="banner-content">
          <img
            src="/assets/8-Eight-Logo-White.png"
            alt="Aesthetics Skin Renewed Logo"
            className="banner-logo mb-3"
          />
          <h1 className="banner-title">Feast with Ysiad's Catering</h1>
          <p className="banner-subtitle">Delight in exquisite catering and unforgettable celebrations</p>
          <Link
            to="/booking"
            role="button"
            className="banner-button"
          >
            Book Now <span style={{ fontSize: '1.4rem' }}>→</span>
          </Link>
        </div>
      </div>

      <Con3 />
      <Con1 />
      <Con2 />
    </>
  );
}

export default Home;