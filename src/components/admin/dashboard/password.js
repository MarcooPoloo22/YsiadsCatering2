import React, { useState } from "react";
import Swal from "sweetalert2";
import "../../../styles/admin/dashboard/faqs.css";

const AdminPassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Error!",
        text: "New password and confirmation password don't match!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const passwordData = {
      old_password: oldPassword,
      new_password: newPassword
    };

    try {
      const response = await fetch("http://localhost/admin_dashboard_backend/update_password.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(passwordData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update password");
      }

      Swal.fire({
        title: "Success!",
        text: result.message,
        icon: "success",
        confirmButtonText: "OK",
      });

      // Clear form after successful update
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Password update error:", error);
    }
  };

  return (
    <div className="faq-main-container">
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Change Password</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="oldPassword">Current Password</label>
            <input
              className="questionInput"
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="newPassword">New Password</label>
            <input
              className="answerInput"
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="confirmPassword">Confirm New Password</label>
            <input
              className="answerInput"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button-ManageFAQEdit">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default AdminPassword;