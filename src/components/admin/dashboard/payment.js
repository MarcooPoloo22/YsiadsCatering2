import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../../../styles/admin/dashboard/faqs.css";
import { MdPayment } from "react-icons/md";

const AdminPayment = ({ setActivePage }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    gcash_number: "",
    gcash_name: "",
    paymaya_number: "",
    paymaya_name: "",
    bank_name: "",
    bank_account_number: "",
    bank_account_name: ""
  });

  // Fetch payment data from the backend
  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await fetch("http://localhost/admin_dashboard_backend/fetch_payment_details.php", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === "success") {
          setPaymentDetails(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch payment data");
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to fetch payment data. Please check the console for details.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchPaymentData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost/admin_dashboard_backend/update_payment_details.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(paymentDetails)
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
  
      Swal.fire({
        title: "Success!",
        text: result.message || "Payment details updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error updating payment data:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to update payment data. Please check the console for details.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="faq-main-container">
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Edit Payment Information</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          {/* GCash Section */}
          <p className="questionLabel">GCash Payment Details</p>
          <div className="form-group">
            <label className="answerLabel" htmlFor="gcash_number">GCash Number</label>
            <input
              className="answerInput"
              type="text"
              id="gcash_number"
              name="gcash_number"
              value={paymentDetails.gcash_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="gcash_name">GCash Name</label>
            <input
              className="answerInput"
              type="text"
              id="gcash_name"
              name="gcash_name"
              value={paymentDetails.gcash_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* PayMaya Section */}
          <p style={{paddingTop: "25px"}} className="questionLabel">PayMaya Payment Details</p>
          <div className="form-group">
            <label className="answerLabel" htmlFor="paymaya_number">PayMaya Number</label>
            <input
              className="answerInput"
              type="text"
              id="paymaya_number"
              name="paymaya_number"
              value={paymentDetails.paymaya_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="paymaya_name">PayMaya Name</label>
            <input
              className="answerInput"
              type="text"
              id="paymaya_name"
              name="paymaya_name"
              value={paymentDetails.paymaya_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Bank Section */}
          <p style={{paddingTop: "25px"}} className="questionLabel">Bank Payment Details</p>
          <div className="form-group">
            <label className="answerLabel" htmlFor="bank_name">Bank Name</label>
            <input
              className="answerInput"
              type="text"
              id="bank_name"
              name="bank_name"
              value={paymentDetails.bank_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="bank_account_number">Account Number</label>
            <input
              className="answerInput"
              type="text"
              id="bank_account_number"
              name="bank_account_number"
              value={paymentDetails.bank_account_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="bank_account_name">Account Name</label>
            <input
              className="answerInput"
              type="text"
              id="bank_account_name"
              name="bank_account_name"
              value={paymentDetails.bank_account_name}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="button-ManageFAQEdit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default AdminPayment;