import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner from "../../assets/customer/spa_massage.jpg";


const PromosSection = () => {
  const settings = {
    dots: false,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,

    // customPaging: function (i) {
    //   return <p>{i + 1}</p>;
    // },

    responsive: [
      {
        breakpoint: 1424,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },

      {
        breakpoint: 1124,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
          dots: false,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="container my-5 mx-auto">
      <h1 className="mb-4">Promos/Packages</h1>
      <Slider {...settings}>
        {[...Array(8)].map((_, index) => (
          <div key={index} className="p-3">
            <div className="card mx-auto" style={{ width: "18rem" }}>
              <img src={banner} className="card-img-top" alt="Promo" />
              <div className="card-body text-center">
                <h5 className="card-title">Promo {index + 1}</h5>
                <p className="card-text">Exclusive deal for you!</p>
                <Link className="btn btn-primary" to="/booking" role="button">
                  Book Now!
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PromosSection;
