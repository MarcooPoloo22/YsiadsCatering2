import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../styles/customer/BookingPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

const MySwal = withReactContent(Swal);

const validateDate = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(dateString);
  return selectedDate >= today;
};

const convertTime12to24 = (time12h) => {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') hours = '00';
  if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
  return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
};

const BookingPageRegistered = ({ user }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serviceTypeParam = queryParams.get('type');
  const serviceIdParam = queryParams.get('serviceId');

  const [formData, setFormData] = useState({
    service_category: serviceTypeParam || "",
    service_type: "",
    service: serviceIdParam || "",
    branch_id: "",
    staff_id: "",
    appointment_date: "",
    appointment_time: "",
  });

  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [receiptFile, setReceiptFile] = useState(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [doctorAvailability, setDoctorAvailability] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const navigate = useNavigate();

  const convertTime24to12 = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const twelveHour = hour % 12 || 12;
    return `${twelveHour.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const standardTimeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Not Logged In",
        text: "You need to log in to book an appointment.",
      }).then(() => {
        navigate("/login");
      });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (serviceTypeParam === "Surgery" && serviceIdParam) {
      setFormData(prev => ({
        ...prev,
        service_category: "Surgery",
        service: serviceIdParam
      }));
      
      // Fetch surgery details to set the service_type
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_services.php?type=Surgery`)
        .then((response) => response.json())
        .then((data) => {
          const selectedService = data.find(s => s.id.toString() === serviceIdParam);
          if (selectedService) {
            setFormData(prev => ({
              ...prev,
              service_type: selectedService.name
            }));
          }
        })
        .catch((error) => console.error("Error fetching surgery details:", error));
    }
  }, [serviceTypeParam, serviceIdParam]);

  useEffect(() => {
    if (formData.service_category) {
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_services.php?type=${formData.service_category}`)
        .then((response) => response.json())
        .then((data) => {
          const servicesWithType = data.map(service => ({
            ...service,
            service_category: formData.service_category
          }));
          setServices(servicesWithType);
  
          // Check if there's a serviceIdParam from URL and set service_type
          if (serviceIdParam && serviceTypeParam === formData.service_category) {
            const selectedService = data.find(s => s.id.toString() === serviceIdParam);
            if (selectedService) {
              setFormData(prev => ({
                ...prev,
                service_type: selectedService.name
              }));
            }
          }
        })
        .catch((error) => console.error("Error fetching services:", error));
    } else {
      setServices([]);
      setFormData((prev) => ({ ...prev, service: "", service_type: "", branch_id: "", staff_id: "" }));
    }
  }, [formData.service_category, serviceIdParam, serviceTypeParam]); // Add dependencies here

  useEffect(() => {
    if (formData.service) {
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_branches.php?serviceId=${encodeURIComponent(formData.service)}&type=${formData.service_category}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setBranches(data);
        })
        .catch((error) => {
          console.error("Error fetching branches:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load branches. Please try again.',
          });
        });
    } else {
      setBranches([]);
      setFormData((prev) => ({ ...prev, branch_id: "", staff_id: "" }));
    }
  }, [formData.service, formData.service_category]);

  useEffect(() => {
    if (formData.branch_id && formData.service && formData.service_category) {
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_staff.php?branchId=${encodeURIComponent(formData.branch_id)}&serviceId=${encodeURIComponent(formData.service)}&type=${encodeURIComponent(formData.service_category)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setStaffList(data);
        })
        .catch((error) => {
          console.error("Error fetching staff:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load staff. Please try again.',
          });
        });
    } else {
      setStaffList([]);
      setFormData((prev) => ({ ...prev, staff_id: "" }));
    }
  }, [formData.branch_id, formData.service, formData.service_category]);

  useEffect(() => {
    if (formData.service_category === "Surgery" && formData.staff_id) {
      fetch(`http://localhost/admin_dashboard_backend/fetch_doctor_availability.php?doctor_id=${formData.staff_id}`)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then(data => {
          if (data.status === 'success') {
            setDoctorAvailability(data.available_slots || []);
            const dates = [...new Set(data.available_slots.map(slot => slot.split(' ')[0]))];
            setAvailableDates(dates);
          } else {
            throw new Error(data.message || 'Failed to fetch availability');
          }
        })
        .catch(error => {
          console.error("Error fetching doctor dates:", error);
          setAvailableDates([]);
          setDoctorAvailability([]);
        });
    } else {
      setAvailableDates([]);
      setDoctorAvailability([]);
    }
  }, [formData.staff_id, formData.service_category]);

  // Change from fetch_doctor_availability.php to doctor_get_availability.php
useEffect(() => {
  if (formData.service_category === "Surgery" && formData.staff_id) {
    fetch(`http://localhost/admin_dashboard_backend/doctor_get_availability.php?doctor_id=${formData.staff_id}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        if (data.success) {  // Changed from data.status === 'success'
          setDoctorAvailability(data.availability || []);  // Changed from data.available_slots
          const dates = [...new Set(data.availability.map(slot => slot.split(' ')[0]))];
          setAvailableDates(dates);
        } else {
          throw new Error(data.message || 'Failed to fetch availability');
        }
      })
      .catch(error => {
        console.error("Error fetching doctor dates:", error);
        setAvailableDates([]);
        setDoctorAvailability([]);
      });
  } else {
    setAvailableDates([]);
    setDoctorAvailability([]);
  }
}, [formData.staff_id, formData.service_category]);

useEffect(() => {
  if (formData.service_category === "Surgery") {
    const slotsForDate = Array.isArray(doctorAvailability) 
      ? doctorAvailability.filter(slot => slot.startsWith(formData.appointment_date))
      : [];
      
    const availableSlots = slotsForDate
      .map(slot => {
        const [date, time] = slot.split(' ');
        return convertTime24to12(time.substring(0, 5));
      });
      
    setAvailableTimeSlots(availableSlots);
  } else {
    // For Promo/Service, we'll show all standard time slots but grey out the booked ones
    setAvailableTimeSlots(standardTimeSlots);
  }
}, [doctorAvailability, formData.appointment_date, formData.service_category]);

useEffect(() => {
  if (formData.appointment_date && formData.staff_id && formData.service_category !== "Surgery") {
    setIsLoading(true);
    fetch(`http://localhost/booking.php?date=${formData.appointment_date}&staff_id=${formData.staff_id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === 'success') {
          setBookedSlots(data.booked_slots || []);
        } else {
          throw new Error(data.message || 'Failed to fetch booked slots.');
        }
      })
      .catch((error) => {
        console.error("Error fetching booked slots:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch booked slots. Please try again.',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  } else {
    setBookedSlots([]);
  }
}, [formData.appointment_date, formData.staff_id, formData.service_category]);

  const handleSurgeryPayment = async () => {
    setIsLoadingPayment(true);
    try {
      const serviceObj = services.find(s => s.id.toString() === formData.service.toString());
      const response = await fetch("http://localhost/admin_dashboard_backend/fetch_payment_details.php");
      if (!response.ok) throw new Error("Failed to fetch payment details");
      const result = await response.json();
      
      if (!result.data || !result.data.gcash_number) {
        throw new Error("Invalid payment details format");
      }
      
      setPaymentDetails(result);
      showPaymentModal(result.data, serviceObj.price);
    } catch (error) {
      console.error("Error fetching payment details:", error);
      MySwal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const showConfirmationModal = () => {
    const serviceObj = services.find(s => s.id.toString() === formData.service.toString());
    const branchObj = branches.find(b => b.id.toString() === formData.branch_id.toString());
    const staffObj = staffList.find(s => s.id.toString() === formData.staff_id.toString());
  
    MySwal.fire({
      title: '<strong>Booking Summary</strong>',
      html: `
        <div class="booking-summary">
          <div class="summary-row">
            <span class="summary-label">Service Category:</span>
            <span class="summary-value">${formData.service_category}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Service:</span>
            <span class="summary-value">${formData.service_type}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Price:</span>
            <span class="summary-value">₱${serviceObj?.price || 'N/A'}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Branch:</span>
            <span class="summary-value">${branchObj?.name || 'N/A'}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Staff:</span>
            <span class="summary-value">${staffObj?.name || 'N/A'}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Date:</span>
            <span class="summary-value">${formData.appointment_date}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Time:</span>
            <span class="summary-value">${formData.appointment_time}</span>
          </div>
          ${formData.service_category === "Surgery" ? `
          <div class="summary-row">
            <span class="summary-label" style="color: #4169E1; font-weight: bold;">Required Down Payment (50%):</span>
            <span class="summary-value" style="color: #4169E1; font-weight: bold;">₱${(serviceObj?.price * 0.5).toFixed(2) || 'N/A'}</span>
          </div>
          ` : ''}
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Book Now',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'booking-summary-popup',
        confirmButton: 'btn btn-confirm',
        cancelButton: 'btn btn-cancel'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (formData.service_category === "Surgery") {
          handleSurgeryPayment();
        } else {
          handleAppointmentSubmission();
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requiredFields = ['service_category', 'service', 'service_type', 'branch_id', 'staff_id', 'appointment_date', 'appointment_time'];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        Swal.fire({
          icon: 'error',
          title: 'Missing Information',
          text: `Please fill in ${field.replace('_', ' ')}.`,
        });
        return;
      }
    }

    showConfirmationModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "service") {
      const selectedService = services.find(s => s.id.toString() === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        service_type: selectedService?.name || "",
        branch_id: "",
        staff_id: ""
      }));
    } else if (name === "service_category") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        service: "",
        service_type: "",
        branch_id: "",
        staff_id: ""
      }));
      
      // If switching away from surgery, clear any surgery-specific data
      if (value !== "Surgery") {
        setDoctorAvailability([]);
        setAvailableDates([]);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  const showPaymentModal = (paymentData, price) => {
    const downPayment = (price * 0.5).toFixed(2);
    MySwal.fire({
      html: (
        <>
          <div className="container" style={{ width: "100%", maxWidth: "700px", padding: "10px", margin: "0 auto" }}>
            <p 
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#4169E1",
                textAlign: "center",
                textTransform: "uppercase",
                marginBottom: "20px"
              }}
            >
              Minimum 50% Down Payment Required
            </p>
    
            <p className="total-price" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              Total Price: ₱{price}
            </p>
            <p className="down-payment" style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#4169E1" }}>
              Required Down Payment (50%): ₱{downPayment}
            </p>
    
            <p className="gcash-label">GCash payment Details</p>
            <p className="gcash-details">GCash Number: {paymentData.gcash_number}</p>
            <p className="gcash-details">GCash Name: {paymentData.gcash_name}</p>
    
            <p className="paymaya-label">PayMaya payment Details</p>
            <p className="paymaya-details">PayMaya Number: {paymentData.paymaya_number}</p>
            <p className="paymaya-details">PayMaya Name: {paymentData.paymaya_name}</p>
    
            <p className="bank-label">Bank payment Details</p>
            <p className="bank-details">Bank: {paymentData.bank_name}</p>
            <p className="bank-details">Account Number: {paymentData.bank_account_number}</p>
            <p className="bank-details">Account Name: {paymentData.bank_account_name}</p>
    
            <div className="mb-3">
              <p className="receipt-label">Upload Payment Receipt (Required)</p>
              <input 
                className="form-control" 
                type="file" 
                id="receiptFile"
                accept="image/*,.pdf"
                onChange={(e) => setReceiptFile(e.target.files[0])}
                required
              />
              <small className="text-muted">Accepted formats: JPG, PNG, PDF (Max 5MB)</small>
            </div>
    
            <div className="d-grid gap-2 col-6 mx-auto">
              <br />
              <button 
                className="btn btn-payment" 
                type="button"
                onClick={() => {
                  if (!receiptFile) {
                    Swal.fire({
                      icon: 'error',
                      title: 'Missing Receipt',
                      text: 'Please upload your payment receipt to continue',
                    });
                    return;
                  }
                  Swal.close();
                  handleAppointmentSubmission();
                }}
              >
                Submit Payment
              </button>
            </div>
          </div>
        </>
      ),
      showConfirmButton: false,
      width: '100%',
      customClass: {
        popup: 'custom-payment-modal',
        htmlContainer: 'custom-html-container'
      }
    });    
  };

  const handleAppointmentSubmission = async () => {
    try {
      const convertedTime = convertTime12to24(formData.appointment_time);
      
      const formDataToSend = new FormData();
      
      if (receiptFile) {
        formDataToSend.append('receipt', receiptFile);
      }
      
      formDataToSend.append('user_id', user.id);
      formDataToSend.append('first_name', user.first_name);
      formDataToSend.append('last_name', user.last_name);
      formDataToSend.append('email', user.email);
      formDataToSend.append('contact_no', user.contact_no);
      formDataToSend.append('service', formData.service);
      formDataToSend.append('service_type', formData.service_type);
      formDataToSend.append('branch_id', formData.branch_id);
      formDataToSend.append('staff_id', formData.staff_id);
      formDataToSend.append('appointment_date', formData.appointment_date);
      formDataToSend.append('appointment_time', convertedTime);
      formDataToSend.append('send_email', 'true');
  
      const response = await fetch("http://localhost/booking.php", {
        method: "POST",
        body: formDataToSend,
      });
  
      const result = await response.json();
  
      if (result.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          html: `
            <div>
              <p>${result.message}</p>
              <p>A confirmation email has been sent to ${user.email}</p>
            </div>
          `,
        }).then(() => {
          navigate("/profile");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred while booking the appointment.",
      });
    }
  };

  return (
    <>
      <div className="booking-container">
        <img
          src="./assets/asr_bookinghead.jpg"
          alt="Booking Background"
          className="booking-bg"
        />
        <div className="booking-title-wrapper">
          <h1 className="booking-title">Booking Appointments</h1>
        </div>
      </div>

      <br />
      <div className="white-box my-5">
        <div className="container">
          <div className="row mb-3">
            <div className="col-md-6">
              <br />
              <p className="branch-label">Choose Type</p>
              <select
                className="form-select form-select-lg mb-3"
                name="service_category"
                value={formData.service_category}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Promo">Promo</option>
                <option value="Service">Service</option>
                <option value="Surgery">Surgery</option>
              </select>
            </div>
            <div className="col-md-6">
              <br />
              <p className="service-label">Select which to book</p>
              <select
                className="form-select form-select-lg mb-3"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                disabled={!formData.service_category}
              >
                <option value="">Select service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} (₱{service.price})
                  </option>
                ))}
              </select>
              {(serviceIdParam && formData.service_category === "Surgery") && (
                <div className="alert alert-info mt-2 mb-3 small">
                  <i className="bi bi-info-circle me-2"></i>
                  Auto-selected: {services.find(s => s.id.toString() === serviceIdParam)?.name || 'Surgery'}
                </div>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <br />
              <p className="branch-label">Branch</p>
              <select
                className="form-select form-select-lg mb-3"
                name="branch_id"
                value={formData.branch_id}
                onChange={handleChange}
                required
                disabled={!formData.service}
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <br />
              <p className="service-label">Staff</p>
              <select
                className="form-select form-select-lg mb-3"
                name="staff_id"
                value={formData.staff_id}
                onChange={handleChange}
                required
                disabled={!formData.branch_id}
              >
                <option value="">Select Staff</option>
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} {staff.role === 'DOCTOR' ? '(Doctor)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <br />
              <p className="bookdate-label">Booking Date</p>
              <input
                type="date"
                className="form-control"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={(e) => {
                  if (validateDate(e.target.value)) {
                    handleChange(e);
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Invalid Date',
                      text: 'You cannot book appointments for past dates.',
                    });
                    setFormData({...formData, appointment_date: ""});
                  }
                }}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="col-md-6">
              <br />
              <p className="booktime-label">Booking Time</p>
              <select
                className="form-select form-select-lg"
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleChange}
                required
                disabled={isLoading || (formData.service_category === "Surgery" && availableTimeSlots.length === 0)}
              >
                <option value="">Select Time</option>
                {isLoading ? (
                  <option disabled>Loading availability...</option>
                ) : formData.service_category === "Surgery" ? (
                  availableTimeSlots.length === 0 ? (
                    <option disabled>No available time slots</option>
                  ) : (
                    availableTimeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))
                  )
                ) : (
                  standardTimeSlots.map((slot) => (
                    <option
                      key={slot}
                      value={slot}
                      disabled={bookedSlots.includes(slot)}
                      style={{
                        backgroundColor: bookedSlots.includes(slot) ? "#f0f0f0" : "inherit",
                        color: bookedSlots.includes(slot) ? "#a0a0a0" : "inherit",
                      }}
                    >
                      {slot}
                    </option>
                  ))
                )}
              </select>
              {formData.service_category === "Surgery" && (
                <div className="alert alert-info mt-2">
                  <i className="bi bi-info-circle me-2"></i>
                  Surgery time slots are based on doctor availability
                </div>
              )}
            </div>
          </div>

          {formData.appointment_date && availableTimeSlots.length === 0 && !isLoading && (
  <div className="alert alert-warning mt-3">
    {formData.service_category === "Surgery" ? (
      availableDates.length > 0 ? (
        <div>
          <p>No available slots for Dr. {staffList.find(staff => staff.id.toString() === formData.staff_id.toString())?.name} on {formData.appointment_date}. Available dates:</p>
          <ul className="available-dates-list">
            {availableDates.map(date => (
              <li key={date}>
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No available dates for selected doctor. Please choose another doctor.</p>
      )
    ) : (
      "All time slots are booked for the selected date. Please choose another date."
    )}
  </div>
)}

          <div className="d-grid gap-2 col-6 mx-auto">
            <button
              className="btn-primary"
              type="button"
              onClick={handleSubmit}
              disabled={isLoadingPayment || availableTimeSlots.length === 0}
            >
              {isLoadingPayment ? "Loading..." : 
               formData.service_category === "Surgery" ? "Continue to Payment" : "Book Appointment"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const BookingPageGuest = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [receiptFile, setReceiptFile] = useState(null);
  const serviceTypeParam = queryParams.get('type');
  const serviceIdParam = queryParams.get('serviceId');

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_no: "",
    service_category: serviceTypeParam || "",
    service_type: "",
    service: serviceIdParam || "",
    branch_id: "",
    staff_id: "",
    appointment_date: "",
    appointment_time: "",
  });

  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const standardTimeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  useEffect(() => {
    if (formData.service_category === "Surgery") {
      setFormData(prev => ({ ...prev, service_category: "" }));
      Swal.fire({
        icon: 'info',
        title: 'Registered Customers Only',
        text: 'Please login or register to book surgery services.',
      });
    }
  }, [formData.service_category]);

  useEffect(() => {
    if (formData.service_category) {
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_services.php?type=${formData.service_category}`)
        .then((response) => response.json())
        .then((data) => {
          const servicesWithType = data.map(service => ({
            ...service,
            service_category: formData.service_category
          }));
          setServices(servicesWithType);
  
          // Check if there's a serviceIdParam from URL and set service_type
          if (serviceIdParam && serviceTypeParam === formData.service_category) {
            const selectedService = data.find(s => s.id.toString() === serviceIdParam);
            if (selectedService) {
              setFormData(prev => ({
                ...prev,
                service_type: selectedService.name
              }));
            }
          }
        })
        .catch((error) => console.error("Error fetching services:", error));
    } else {
      setServices([]);
      setFormData((prev) => ({ ...prev, service: "", service_type: "", branch_id: "", staff_id: "" }));
    }
  }, [formData.service_category, serviceIdParam, serviceTypeParam]); // Add dependencies here

  useEffect(() => {
    if (formData.service) {
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_branches.php?serviceId=${encodeURIComponent(formData.service)}&type=${formData.service_category}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setBranches(data);
        })
        .catch((error) => {
          console.error("Error fetching branches:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load branches. Please try again.',
          });
        });
    } else {
      setBranches([]);
      setFormData((prev) => ({ ...prev, branch_id: "", staff_id: "" }));
    }
  }, [formData.service, formData.service_category]);

  useEffect(() => {
    if (formData.branch_id && formData.service && formData.service_category) {
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_staff.php?branchId=${encodeURIComponent(formData.branch_id)}&serviceId=${encodeURIComponent(formData.service)}&type=${encodeURIComponent(formData.service_category)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setStaffList(data);
        })
        .catch((error) => {
          console.error("Error fetching staff:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load staff. Please try again.',
          });
        });
    } else {
      setStaffList([]);
      setFormData((prev) => ({ ...prev, staff_id: "" }));
    }
  }, [formData.branch_id, formData.service, formData.service_category]);

  useEffect(() => {
    if (formData.appointment_date && formData.staff_id) {
      setIsLoading(true);
      fetch(`http://localhost/booking.php?date=${formData.appointment_date}&staff_id=${formData.staff_id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.status === 'success') {
            setBookedSlots(data.booked_slots || []);
          } else {
            throw new Error(data.message || 'Failed to fetch booked slots.');
          }
        })
        .catch((error) => {
          console.error("Error fetching booked slots:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch booked slots. Please try again.',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setBookedSlots([]);
    }
  }, [formData.appointment_date, formData.staff_id]);
  
  const showConfirmationModal = () => {
    const serviceObj = services.find(s => s.id.toString() === formData.service.toString());
    const branchObj = branches.find(b => b.id.toString() === formData.branch_id.toString());
    const staffObj = staffList.find(s => s.id.toString() === formData.staff_id.toString());
  
    MySwal.fire({
      title: '<strong>Booking Summary</strong>',
      html: `
        <div class="booking-summary">
          <div class="summary-row">
            <span class="summary-label">Service Category:</span>
            <span class="summary-value">${formData.service_category}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Service:</span>
            <span class="summary-value">${formData.service_type}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Branch:</span>
            <span class="summary-value">${branchObj?.name || 'N/A'}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Staff:</span>
            <span class="summary-value">${staffObj?.name || 'N/A'}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Date:</span>
            <span class="summary-value">${formData.appointment_date}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Time:</span>
            <span class="summary-value">${formData.appointment_time}</span>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Book Now',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'booking-summary-popup',
        confirmButton: 'btn btn-confirm',
        cancelButton: 'btn btn-cancel'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleAppointmentSubmission();
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requiredFields = ['first_name', 'last_name', 'email', 'contact_no', 'service_category', 'service', 'service_type', 'branch_id', 'staff_id', 'appointment_date', 'appointment_time'];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        Swal.fire({
          icon: 'error',
          title: 'Missing Information',
          text: `Please fill in ${field.replace('_', ' ')}.`,
        });
        return;
      }
    }

    showConfirmationModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "service") {
      const selectedService = services.find(s => s.id.toString() === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        service_type: selectedService?.name || "",
        branch_id: "",
        staff_id: ""
      }));
    } else if (name === "service_category") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        service: "",
        service_type: "",
        branch_id: "",
        staff_id: ""
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleAppointmentSubmission = async () => {
    try {
      const convertedTime = convertTime12to24(formData.appointment_time);
      
      const formDataToSend = new FormData();
      
      if (receiptFile) {
        formDataToSend.append('receipt', receiptFile);
      }
      
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('contact_no', formData.contact_no);
      formDataToSend.append('service', formData.service);
      formDataToSend.append('service_type', formData.service_type);
      formDataToSend.append('branch_id', formData.branch_id);
      formDataToSend.append('staff_id', formData.staff_id);
      formDataToSend.append('appointment_date', formData.appointment_date);
      formDataToSend.append('appointment_time', convertedTime);
      formDataToSend.append('send_email', 'true');
  
      const response = await fetch("http://localhost/booking.php", {
        method: "POST",
        body: formDataToSend,
      });
  
      const result = await response.json();
  
      if (result.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          html: `
            <div>
              <p>${result.message}</p>
              <p>A confirmation email has been sent to ${formData.email}</p>
            </div>
          `,
        }).then(() => {
          navigate("/");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred while booking the appointment.",
      });
    }
  };

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
          <div className="row g-3">
            <div className="col">
              <p className="fname-label">First Name</p>
              <input
                type="text"
                className="form-control"
                placeholder="First name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <p className="lname-label">Last Name</p>
              <input
                type="text"
                className="form-control"
                placeholder="Last name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <br />
            <p className="email-label">Email address</p>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <br />
            <p className="connumb-label">Contact No.</p>
            <input
              type="text"
              className="form-control"
              placeholder="0912314567"
              name="contact_no"
              value={formData.contact_no}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <br />
              <p className="branch-label">Choose Type</p>
              <select
                className="form-select form-select-lg mb-3"
                name="service_category"
                value={formData.service_category}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Promo">Promo</option>
                <option value="Service">Service</option>
                <option 
                  value="Surgery" 
                  disabled
                  style={{ color: '#ccc', backgroundColor: '#f5f5f5' }}
                >
                  Surgery (Registered Customers Only)
                </option>
              </select>
            </div>
            <div className="col-md-6">
              <br />
              <p className="service-label">Select which to book</p>
              <select
                className="form-select form-select-lg mb-3"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                disabled={!formData.service_category || formData.service_category === "Surgery"}
              >
                <option value="">Select service</option>
                {services.map((service) => (
                  <option 
                    key={service.id} 
                    value={service.id}
                  >
                    {service.name} (₱{service.price})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <br />
              <p className="branch-label">Branch</p>
              <select
                className="form-select form-select-lg mb-3"
                name="branch_id"
                value={formData.branch_id}
                onChange={handleChange}
                required
                disabled={!formData.service}
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <br />
              <p className="service-label">Staff</p>
              <select
                className="form-select form-select-lg mb-3"
                name="staff_id"
                value={formData.staff_id}
                onChange={handleChange}
                required
                disabled={!formData.branch_id}
              >
                <option value="">Select Staff</option>
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <br />
              <p className="bookdate-label">Booking Date</p>
              <input
                type="date"
                className="form-control"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={(e) => {
                  if (validateDate(e.target.value)) {
                    handleChange(e);
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Invalid Date',
                      text: 'You cannot book appointments for past dates.',
                    });
                    setFormData({...formData, appointment_date: ""});
                  }
                }}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="col-md-6">
              <br />
              <p className="booktime-label">Booking Time</p>
              <select
                className="form-select form-select-lg"
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value="">Select Time</option>
                {isLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  standardTimeSlots.map((slot) => (
                    <option
                      key={slot}
                      value={slot}
                      disabled={bookedSlots.includes(slot)}
                      style={{
                        backgroundColor: bookedSlots.includes(slot) ? "#f0f0f0" : "inherit",
                        color: bookedSlots.includes(slot) ? "#a0a0a0" : "inherit",
                      }}
                    >
                      {slot}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {bookedSlots.length === standardTimeSlots.length && (
            <div className="alert alert-warning mt-3">
              All time slots are booked for the selected date. Please choose another date.
            </div>
          )}
          <br />
          <div className="d-grid gap-2 col-6 mx-auto">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Book Appointment"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export { BookingPageRegistered, BookingPageGuest };