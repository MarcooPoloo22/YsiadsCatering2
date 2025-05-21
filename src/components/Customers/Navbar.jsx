import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../../assets/customer/E0AF2352-7ADE-4637-9755-FF814E41A271_1_201_a.jpeg";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, setIsLoggedIn, user }) => {
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    setShowNav(true);
    console.log("Navbar user:", user);
  }, [user]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost/logout.php", {
        method: "POST",
        credentials: "include",
      });
      const result = await response.json();
      if (result.status === "success") {
        setIsLoggedIn(false);
        navigate("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav
      className={`navbar navbar-expand-lg bg-white shadow-sm p-1 ${
        showNav ? "fade-in-navbar" : ""
      }`}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src={logo}
            alt="Logo"
            width="240"
            className="d-inline-block align-text-top"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              Menu
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav nav-underline me-auto mb-2 mb-lg-0 mx-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/services">
                  Catering
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/faq">
                  FaQ
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/contact">
                  Contact Us
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/dev">
                  Developer's Page
                </NavLink>
              </li>
            </ul>

            <div className="d-flex align-items-center justify-content-center mt-3 mt-lg-0">
              {isLoggedIn && user ? (
                <div className="dropdown">
                  <span
                    className="dropdown-toggle no-caret"
                    role="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Welcome, {user.first_name} {user.last_name}
                  </span>
                  <ul className="dropdown-menu" aria-labelledby="userDropdown">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link
                  className="btn btn-outline-success"
                  to="/login"
                  role="button"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
