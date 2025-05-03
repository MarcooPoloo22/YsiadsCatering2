import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/customer/CustomerPayment.css";


const CustomerPay = () => {
  return (
    <>
      <div className="booking-container">
        <img
          src="./assets/bookinghead.jpg"
          alt="Booking Background"
          className="booking-bg"
        />
        <h1 className="booking-title">Booking Appointment</h1>
      </div>

      <br />
      <div className="white-box my-5">
        <div className="container">
        <p class="gcash-label">GCash payment Details</p>
              <p class="gcash-details">GCash Number: 09123456789</p>
              <p class="gcash-details">GCash Name: Juan Dela Cruz</p>
              <p class="gcash-details">Amount: 500</p>
              <p class="gcash-details">Deadline: 3 days after booking</p>
        <p class="paymaya-label">PayMaya payment Details</p>
              <p class="paymaya-details">PayMaya Number: 09123456789</p>
              <p class="paymaya-details">PayMaya Name: Juan Dela Cruz</p>
              <p class="paymaya-details">Amount: 500</p>
              <p class="paymaya-details">Deadline: 3 days after booking</p>
        <p class="bank-label">Bank payment Details</p>
              <p class="bank-details">Bank: BDO</p>
              <p class="bank-details">Account Number: 123456789</p>
              <p class="bank-details">Account Name: Juan Dela Cruz</p>
              <p class="bank-details">Amount: 500</p>
              <p class="bank-details">Deadline: 3 days after booking</p>

        <div class="mb-3">  
          <br />
        <p class="payment-label">Select Payment Method</p>
              <select class="form-select" aria-label="Default select example">
                      <option selected>Select Payment</option>
                           <option value="1">GCash</option>
                           <option value="2">PayMaya</option>
                           <option value="3">Bank</option>
              </select>
            </div>
            <div class="mb-3">
                  <p class="receipt-label">Upload Payment Receipt</p>
                  <input class="form-control" type="file" id="formFileMultiple" multiple />
              </div>
              <div className="d-grid gap-2 col-6 mx-auto">
                <br />
                 <button className="btn btn-payment" type="button">
                    Submit Payment
                </button>
          </div>
        </div>
        </div>
      </>


    );
};

export default CustomerPay;