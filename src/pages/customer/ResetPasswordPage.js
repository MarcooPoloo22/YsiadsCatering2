import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/customer/ResetPasswordPage.css";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); 
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost/resetpassword.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
        credentials: "include", 
      });

      const result = await response.json();

      if (result.status === "success") {
        // Show success message and redirect to login page
        Swal.fire({
          icon: "success",
          title: "Password Reset Successful",
          text: "Your password has been reset successfully.",
        }).then(() => {
          navigate("/login"); // Redirect to login page
        });
      } else {
        // Show error message from the backend
        setError(result.message || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
        </div>
        <div>
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <br />
        <button type="submit" className="btn-reset">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;