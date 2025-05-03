import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookingHistoryTable from "../../components/Customers/BookingHistoryTable";
import "../../styles/customer/ProfilePage.css";
import Swal from "sweetalert2";

const capitalizeLabel = (str) =>
  str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const ProfilePage = ({ user, setUser, isLoggedIn }) => {
  const navigate = useNavigate();

  /* ───────────── State ───────────── */
  const [activeTab, setActiveTab] = useState("account");
  const [userData, setUserData] = useState(null);
  const [newData, setNewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const [bookingHistory, setBookingHistory] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  const [searchText, setSearchText] = useState(""); // NEW (search)

  /* ───────────── Guards ───────────── */
  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  /* ───────────── Load profile ───────────── */
  useEffect(() => {
    fetch("http://localhost/getProfile.php", {
      method: "GET",
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.status === "success") {
          setUserData(d.user);
          setNewData(d.user);
          setUser(d.user);
        } else setError("Failed to load profile data.");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setError("An error occurred.");
        setLoading(false);
      });
  }, [setUser]);

  /* ───────────── Load booking history when tab opened ───────────── */
  useEffect(() => {
    if (activeTab !== "bookingHistory") return;

    setLoadingBookings(true);
    fetch("http://localhost/getBookingHistory.php", {
      method: "GET",
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.status === "success") {
          const newestFirst = d.bookings.sort(
            (a, b) =>
              new Date(`${b.appointment_date} ${b.appointment_time}`) -
              new Date(`${a.appointment_date} ${a.appointment_time}`)
          );
          setBookingHistory(newestFirst);
        } else setBookingError(d.message || "Failed to load booking history.");
        setLoadingBookings(false);
      })
      .catch((err) => {
        console.error("Error fetching booking history:", err);
        setBookingError("An error occurred.");
        setLoadingBookings(false);
      });
  }, [activeTab]);

  /* ───────────── Rating handler ───────────── */
  const handleRating = async (bookingId) => {
    const { value: rating } = await Swal.fire({
      title: "Rate your experience",
      input: "radio",
      inputOptions: {
        1: "1 - Poor",
        2: "2 - Fair",
        3: "3 - Neutral",
        4: "4 - Good",
        5: "5 - Excellent",
      },
      inputValidator: (v) => (!v ? "You need to choose a rating!" : undefined),
      showCancelButton: true,
      width: window.innerWidth > 768 ? "620px" : "90%",
    });

    if (!rating) return;

    try {
      const res = await fetch("http://localhost/booking.php", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId, rating: +rating }),
      });
      const result = await res.json();

      if (result.status === "success") {
        setBookingHistory((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, rating: +rating } : b))
        );
        Swal.fire("Thank you!", "Your rating has been submitted.", "success");
      } else throw new Error(result.message);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to submit rating.", "error");
    }
  };

  /* ───────────── Profile helpers (save / cancel / pwd…) ───────────── */
  const handleInputChange = (e) =>
    setNewData({ ...newData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost/updateProfile.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      const d = await res.json();
      if (d.status === "success") {
        setUserData(newData);
        setEditing(false);
        setUser((p) => ({ ...p, ...newData }));
        Swal.fire("Profile Updated", "", "success");
      } else Swal.fire("Update Failed", d.message || "", "error");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "An error occurred while updating profile.", "error");
    }
  };

  const handleCancel = () => {
    setNewData({ ...userData });
    setEditing(false);
  };

  const handlePasswordChange = (e) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const updatePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New passwords do not match!");
      return;
    }
    setPasswordError("");
    try {
      const res = await fetch("http://localhost/updatePassword.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwords),
      });
      const r = await res.json();
      if (r.status === "success") {
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        Swal.fire("Password Updated", "", "success");
      } else Swal.fire("Password Update Failed", r.message || "", "error");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "An error occurred while updating password.", "error");
    }
  };

  /* ───────────── Render guards ───────────── */
  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;
  if (!userData) return <div>No user data available.</div>;

  /* ───────────── JSX ───────────── */
  const fields = [
    "first_name",
    "middle_initial",
    "last_name",
    "email",
    "contact_no",
  ];

  return (
    <div className="profile-container">
      {/* ───── Sidebar ───── */}
      <div className="profile-sidebar">
        <h3>
          Welcome, {userData.first_name} {userData.last_name}!
        </h3>
        <button
          className={activeTab === "account" ? "active" : ""}
          onClick={() => setActiveTab("account")}
        >
          Account
        </button>
        <button
          className={activeTab === "changePassword" ? "active" : ""}
          onClick={() => setActiveTab("changePassword")}
        >
          Change Password
        </button>
        <button
          className={activeTab === "bookingHistory" ? "active" : ""}
          onClick={() => setActiveTab("bookingHistory")}
        >
          Booking History
        </button>
      </div>

      {/* ───── Content ───── */}
      <div className="profile-content">
        {/* ---------- Account tab ---------- */}
        {activeTab === "account" && (
          <div className="account-details">
            <h2>
              <strong>Account Information</strong>
            </h2>
            {editing ? (
              <>
                <div className="account-info-grid">
                  {fields.map((k) => (
                    <div key={k}>
                      <label>{capitalizeLabel(k)}:</label>
                      <input
                        type="text"
                        name={k}
                        value={newData[k] || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  ))}
                </div>
                <div className="button-group">
                  <button className="save-button" onClick={handleSave}>
                    Save
                  </button>
                  <button className="cancel-button" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="account-info-grid">
                  {fields.map((k) => (
                    <p key={k}>
                      <strong>{capitalizeLabel(k)}:</strong> {userData[k] ?? ""}
                    </p>
                  ))}
                </div>
                <button
                  className="edit-button"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        )}

        {/* ---------- Change-password tab ---------- */}
        {activeTab === "changePassword" && (
          <div className="password-change">
            <h2>
              <strong>Change Password</strong>
            </h2>
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
            <button className="update-password" onClick={updatePassword}>
              Update Password
            </button>
          </div>
        )}

        {/* ---------- Booking-history tab ---------- */}
        {activeTab === "bookingHistory" && (
          <div className="booking-history">
            <h2>
              <strong>Booking History</strong>
            </h2>
            {loadingBookings ? (
              <p>Loading booking history...</p>
            ) : bookingError ? (
              <p style={{ color: "red" }}>{bookingError}</p>
            ) : (
              <>
                <input
                  className="history-search"
                  type="text"
                  placeholder="Search…"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <BookingHistoryTable
                  data={bookingHistory.filter((b) =>
                    `${b.service_type} ${b.appointment_date} ${b.appointment_time}`
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
                  )}
                  onRate={handleRating}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
