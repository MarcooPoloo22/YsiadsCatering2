import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../../../styles/admin/dashboard/faqs.css";

// Icons
import { IoArrowBackOutline } from "react-icons/io5";

const AdminPolicy = ({ setActivePage }) => {
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [termsCondition, setTermsCondition] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch policy data from the backend
  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const response = await fetch("http://localhost/admin_dashboard_backend/fetch_policy.php", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch policy data");
        }

        const data = await response.json();
        setPrivacyPolicy(data.privacy_policy);
        setTermsCondition(data.terms_condition);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching policy data:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch policy data. Please check the console for details.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setIsLoading(false);
      }
    };

    fetchPolicyData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const policyData = {
      privacy_policy: privacyPolicy,
      terms_condition: termsCondition,
    };

    try {
      const response = await fetch("http://localhost/admin_dashboard_backend/update_policy.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(policyData),
      });

      if (!response.ok) {
        throw new Error("Failed to update policy data");
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
        text: "Failed to update policy data. Please check the console for details.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error updating policy data:", error);
    }
  };

  // Auto-resize textarea based on content
  const handleTextareaChange = (e, setter) => {
    setter(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = (e.target.scrollHeight) + 'px';
  };

  if (isLoading) {
    return <div className="faq-main-container">Loading...</div>;
  }

  return (
    <div className="faq-main-container">
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Edit Policies</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="privacyPolicy">Privacy Policy</label>
            <textarea
              className="questionInput"
              id="privacyPolicy"
              value={privacyPolicy}
              onChange={(e) => handleTextareaChange(e, setPrivacyPolicy)}
              required
              style={{ minHeight: '150px', resize: 'none' }}
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="termsCondition">Terms and Condition</label>
            <textarea
              className="answerInput"
              id="termsCondition"
              value={termsCondition}
              onChange={(e) => handleTextareaChange(e, setTermsCondition)}
              required
              style={{ minHeight: '150px', resize: 'none' }}
            />
          </div>
          <button type="submit" className="button-ManageFAQEdit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default AdminPolicy;