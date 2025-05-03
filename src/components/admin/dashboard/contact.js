import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../../../styles/admin/dashboard/faqs.css";

// Icons
import { IoArrowBackOutline } from "react-icons/io5";

const AdminContact = ({ setActivePage }) => {
  const [phone, setPhone] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");

  // Fetch contact data from the backend
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch("http://localhost/admin_dashboard_backend/fetch_contact.php", {
          credentials: "include", // Include cookies if needed
        });

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
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch contact data. Please check the console for details.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchContactData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const contactData = {
      phone,
      facebook,
      instagram,
      twitter,
    };

    try {
      const response = await fetch("http://localhost/admin_dashboard_backend/update_contact.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        throw new Error("Failed to update contact data");
      }

      const result = await response.json();
      Swal.fire({
        title: "Success!",
        text: result.message,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update contact data. Please check the console for details.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error updating contact data:", error);
    }
  };

  return (
    <div className="faq-main-container">
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Edit Contact Information</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="phone">Phone Number</label>
            <input
              className="questionInput"
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="facebook">Facebook Link</label>
            <input
              className="answerInput"
              type="url"
              id="facebook"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="instagram">Instagram Link</label>
            <input
              className="answerInput"
              type="url"
              id="instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="twitter">Twitter Link</label>
            <input
              className="answerInput"
              type="url"
              id="twitter"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button-ManageFAQEdit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default AdminContact;