import React, { useState, useEffect } from "react";
import { onMessage } from "firebase/messaging";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Customers/Navbar";
import Home from "./pages/customer/Home";

import Login from "./pages/customer/Login";
import CreateAccount from "./pages/customer/CreateAccount";
import ForgotPassword from "./pages/customer/ForgotPassword";
import Footer4 from "./components/Customers/Footer4";
import FAQ from "./pages/customer/FAQ";
import Contact from "./pages/customer/Contact";
import ResetPasswordPage from "./pages/customer/ResetPasswordPage";
import AppointmentNotifications from "./services/AppointmentNotifications";
import {
  BookingPageGuest,
  BookingPageRegistered,
} from "./pages/customer/BookingPage";
import CustomerPay from "./pages/customer/CustomerPayment";
import ProfilePage from "./pages/customer/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LiveChatWidget from "./components/Customers/LiveChatWidget";

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // SSE Implementation
  useEffect(() => {
    if (!user?.id) return;

    let eventSource;
    let reconnectTimer;

    const connectSSE = () => {
      const lastEventId = localStorage.getItem("lastBookingEventId") || 0;
      eventSource = new EventSource(
        `http://localhost/sse.php?userId=${user.id}&lastEventId=${lastEventId}`
      );

      // Handle cancelled bookings
      eventSource.addEventListener("booking-cancelled", (e) => {
        try {
          const data = JSON.parse(e.data);
          setNotification({
            message: `${data.message}\nDate: ${data.details.date}\nTime: ${data.details.time}`,
            type: "cancelled",
          });
          localStorage.setItem("lastBookingEventId", data.id);
          setTimeout(() => setNotification(null), 10000);
        } catch (error) {
          console.error("Error parsing cancelled booking data:", error);
        }
      });

      // Handle confirmed bookings
      eventSource.addEventListener("booking-confirmed", (e) => {
        try {
          const data = JSON.parse(e.data);
          setNotification({
            message: `${data.message}\nDate: ${data.details.date}\nTime: ${data.details.time}`,
            type: "confirmed",
          });
          localStorage.setItem("lastBookingEventId", data.id);
          setTimeout(() => setNotification(null), 10000);
        } catch (error) {
          console.error("Error parsing confirmed booking data:", error);
        }
      });

      eventSource.onerror = () => {
        eventSource.close();
        reconnectTimer = setTimeout(connectSSE, 5000);
      };
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [user?.id]);


  useEffect(() => {
    fetch("http://localhost/getProfile.php", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setUser(data.user);
          setIsLoggedIn(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error checking session:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Router>
      <div className="app-container">
        {notification && (
          <div
            style={{
              position: "fixed",
              top: "60px",
              right: "20px",
              backgroundColor:
                notification.type === "confirmed" ? "#4CAF50" : "#ff4444",
              color: "white",
              padding: "15px",
              borderRadius: "8px",
              zIndex: 1000,
              maxWidth: "300px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              whiteSpace: "pre-line",
              animation: "fadeIn 0.3s ease-in-out",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong>
                {notification.type === "confirmed"
                  ? "Booking Confirmed"
                  : "Booking Cancelled"}
              </strong>
              <button
                onClick={() => setNotification(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "16px",
                  padding: "0 0 0 10px",
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}

        <AppointmentNotifications userId={user?.id} />

        <MainContent
          user={user}
          setUser={setUser}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          loading={loading}
        />
      </div>
    </Router>
  );
};

const MainContent = ({ user, setUser, isLoggedIn, setIsLoggedIn, loading }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  if (loading) return null;

  const isAdmin = user?.role === "admin" || user?.role === "employee";
  const isAdminPage = currentPath.startsWith("/admindashboard");
  const hideAdminUI = isAdmin && isAdminPage;

  return (
    <div className="main-content">
      {!hideAdminUI && (
        <Navbar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          user={user}
        />
      )}

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/login"
            element={
              <Login
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                setUser={setUser}
              />
            }
          />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/admindashboard"
            element={
              <AdminDashboard
                isLoggedIn={isLoggedIn}
                user={user}
                setUser={setUser}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />
          <Route
            path="/booking"
            element={
              isLoggedIn ? (
                <BookingPageRegistered user={user} />
              ) : (
                <BookingPageGuest />
              )
            }
          />
          <Route path="/payment" element={<CustomerPay />} />
          <Route
            path="/profile"
            element={
              <ProfilePage
                user={user}
                setUser={setUser}
                isLoggedIn={isLoggedIn}
              />
            }
          />
        </Routes>
      </div>

      {!hideAdminUI && <Footer4 />}
      {!hideAdminUI && <LiveChatWidget />}
    </div>
  );
};

export default App;
