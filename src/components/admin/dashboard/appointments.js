import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import "../../../styles/admin/dashboard/faqs.css";

const customStyles = {
  pagination: {
    style: {
      justifyContent: "center",
    },
  },
};

// ---------------------
// Appointment Table Component
// ---------------------
const AppointmentTable = ({
  setActivePage,
  activePage,
  data,
  fetchAppointments,
}) => {
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this appointment!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          "http://localhost/admin_dashboard_backend/delete_appointment.php",
          {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          }
        );
        if (!response.ok) throw new Error("Failed to delete appointment");
        const resData = await response.json();
        Swal.fire({
          title: "Deleted!",
          text: resData.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        fetchAppointments();
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete appointment. Please check the console for details.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error deleting appointment:", error);
      }
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => `${row.first_name} ${row.last_name}`,
      sortable: true,
      minWidth: "180px",
      wrap: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      minWidth: "200px",
      wrap: true,
    },
    {
      name: "Contact",
      selector: (row) => row.contact_no,
      sortable: true,
      minWidth: "130px",
      wrap: true,
    },
    {
      name: "Service",
      selector: (row) => row.service_type,
      sortable: true,
      minWidth: "160px",
      wrap: true,
    },
    {
      name: "Branch",
      selector: (row) => row.branch_name,
      sortable: true,
      minWidth: "130px",
      wrap: true,
    },
    {
      name: "Staff",
      selector: (row) => row.staff_name,
      sortable: true,
      minWidth: "130px",
      wrap: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      minWidth: "110px",
      wrap: true,
    },
    {
      name: "Date & Time",
      selector: (row) =>
        `${new Date(row.appointment_date).toLocaleDateString()} ${
          row.appointment_time
        }`,
      sortable: true,
      minWidth: "180px",
      wrap: true,
    },
    {
      name: "Payment Receipt",
      cell: (row) =>
        row.receipt_url ? (
          <a href={row.receipt_url} target="_blank" rel="noopener noreferrer">
            View Receipt
          </a>
        ) : (
          <span style={{ color: "gray" }}>No Receipt</span>
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "140px",
    },
    {
      name: "Rating",
      selector: (row) => (row.rating !== null ? row.rating : "N/A"),
      sortable: true,
      width: "90px",
      wrap: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            onClick={() =>
              setActivePage({ page: "ManageAppointmentEdit", appointment: row })
            }
            className="edit-button"
          >
            <FaRegEdit />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="delete-button"
          >
            <FaRegTrashAlt />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      width: "80px",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      pagination
      highlightOnHover
      responsive
      customStyles={customStyles}
    />
  );
};

// ---------------------
// Helper: Fetch and Combine Service Data
// ---------------------
const fetchAllServices = async () => {
  try {
    const [servicesRes, promosRes, surgeriesRes] = await Promise.all([
      fetch("http://localhost/admin_dashboard_backend/fetch_services.php"),
      fetch("http://localhost/admin_dashboard_backend/fetch_promos.php"),
      fetch("http://localhost/admin_dashboard_backend/fetch_surgeries.php"),
    ]);

    if (!servicesRes.ok || !promosRes.ok || !surgeriesRes.ok) {
      throw new Error("Failed to fetch one or more service types");
    }

    const servicesData = await servicesRes.json();
    const promosData = await promosRes.json();
    const surgeriesData = await surgeriesRes.json();

    const servicesArr = Array.isArray(servicesData)
      ? servicesData
      : servicesData.success
      ? servicesData.data
      : [];
    const promosArr = Array.isArray(promosData)
      ? promosData
      : promosData.success
      ? promosData.data
      : [];
    const surgeriesArr = Array.isArray(surgeriesData)
      ? surgeriesData
      : surgeriesData.success
      ? surgeriesData.data
      : [];

    const normalizedSurgeries = surgeriesArr.map((item) => ({
      ...item,
      name: item.name || item.title || "Unnamed Surgery",
      category: "Surgery",
    }));

    const taggedServices = servicesArr.map((item) => ({
      ...item,
      category: "Service",
    }));
    const taggedPromos = promosArr.map((item) => ({
      ...item,
      category: "Promo",
    }));

    return [...taggedServices, ...taggedPromos, ...normalizedSurgeries];
  } catch (error) {
    console.error("Error fetching all services:", error);
    throw error;
  }
};

// ---------------------
// Helper: Fetch Registered Users
// ---------------------
const fetchRegisteredUsers = async () => {
  try {
    const response = await fetch(
      "http://localhost/admin_dashboard_backend/fetch_users.php?role=customer"
    );
    if (!response.ok) throw new Error("Failed to fetch registered users");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching registered users:", error);
    return [];
  }
};

// ---------------------
// Manage Appointment Edit Component
// ---------------------
const ManageAppointmentEdit = ({
  setActivePage,
  activePage,
  fetchAppointments,
}) => {
  const appointment = activePage.appointment || {};
  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // The local formData, including rating + payment receipt (file)
  const [formData, setFormData] = useState({
    id: appointment.id || "",
    first_name: appointment.first_name || "",
    last_name: appointment.last_name || "",
    email: appointment.email || "",
    contact_no: appointment.contact_no || "",
    service_type: appointment.service_type || "",
    branch_id: appointment.branch_id || "",
    staff_id: appointment.staff_id || "",
    appointment_date: appointment.appointment_date || "",
    appointment_time: appointment.appointment_time
      ? appointment.appointment_time.substring(0, 5)
      : "",
    status: appointment.status || "pending",
    user_id: appointment.user_id || "",
    rating: appointment.rating || "",
    // NEW: Payment Receipt file
    fileReceipt: null,
  });

  useEffect(() => {
    fetchAllServices()
      .then(setServices)
      .catch(() => {});
    fetchBranches();
  }, []);

  useEffect(() => {
    if (formData.branch_id) {
      fetchStaff();
    } else {
      setStaffList([]);
    }
  }, [formData.branch_id]);

  const fetchBranches = async () => {
    try {
      const response = await fetch(
        "http://localhost/admin_dashboard_backend/branch_fetch_branches.php"
      );
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchStaff = async () => {
    try {
      setLoadingStaff(true);
      const response = await fetch(
        `http://localhost/admin_dashboard_backend/branch_fetch_staff.php?branch_ids=${encodeURIComponent(
          formData.branch_id
        )}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (data.success) setStaffList(data.data);
      else throw new Error(data.message);
    } catch (error) {
      console.error("Error fetching staff:", error);
      Swal.fire("Error!", "Failed to fetch staff.", "error");
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    setFormData((prev) => ({ ...prev, service_type: e.target.value }));
  };

  // Payment receipt file onChange
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, fileReceipt: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("id", formData.id);
    formPayload.append("first_name", formData.first_name);
    formPayload.append("last_name", formData.last_name);
    formPayload.append("email", formData.email);
    formPayload.append("contact_no", formData.contact_no);
    formPayload.append("service_type", formData.service_type);
    formPayload.append("branch_id", formData.branch_id);
    formPayload.append("staff_id", formData.staff_id);
    formPayload.append("appointment_date", formData.appointment_date);
    formPayload.append("appointment_time", formData.appointment_time);
    formPayload.append("status", formData.status);
    formPayload.append("rating", formData.rating);

    if (formData.user_id !== "") {
      formPayload.append("user_id", formData.user_id);
    }

    // Append the file if not null
    if (formData.fileReceipt) {
      formPayload.append("receipt_file", formData.fileReceipt);
    }

    try {
      const response = await fetch(
        "http://localhost/admin_dashboard_backend/update_appointment.php",
        {
          method: "POST",
          credentials: "include",
          body: formPayload,
        }
      );
      if (!response.ok) {
        // If the server sends { "error": "..." }, we can retrieve it:
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update appointment");
      }

      const result = await response.json();
      Swal.fire({
        title: "Success!",
        text: result.message,
        icon: "success",
        confirmButtonText: "OK",
      });
      fetchAppointments();
      setActivePage({ page: "AppointmentAppointments" });
    } catch (error) {
      console.error("Error updating appointment:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to update appointment.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="faq-main-container">
      <button
        onClick={() => setActivePage({ page: "AppointmentAppointments" })}
        className="faq-edit-backbutton"
      >
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Edit Appointment</p>
        </div>
        <form onSubmit={handleSubmit} className="faq-edit">
          <div className="form-group">
            <label className="questionLabel" htmlFor="firstNameInput">
              First Name
            </label>
            <input
              className="questionInput"
              id="firstNameInput"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              disabled={!!formData.user_id}
            />
          </div>
          <div className="form-group">
            <label className="questionLabel" htmlFor="lastNameInput">
              Last Name
            </label>
            <input
              className="questionInput"
              id="lastNameInput"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              disabled={!!formData.user_id}
            />
          </div>
          <div className="form-group">
            <label className="questionLabel" htmlFor="emailInput">
              Email
            </label>
            <input
              className="questionInput"
              id="emailInput"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={!!formData.user_id}
            />
          </div>
          <div className="form-group">
            <label className="questionLabel" htmlFor="contactInput">
              Contact Number
            </label>
            <input
              className="questionInput"
              id="contactInput"
              name="contact_no"
              value={formData.contact_no}
              onChange={handleChange}
              required
              disabled={!!formData.user_id}
            />
          </div>
          <div className="form-group">
            <label className="questionLabel" htmlFor="serviceSelect">
              Select Service:
            </label>
            <select
              className="questionInput"
              id="serviceSelect"
              name="service_type"
              value={formData.service_type}
              onChange={handleServiceChange}
              required
            >
              <option value="">Select Service</option>
              {services.map((srv) => (
                <option key={`${srv.category}-${srv.id}`} value={srv.name}>
                  {srv.name} {srv.price ? `- ₱${srv.price}` : ""} (
                  {srv.category})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="questionLabel" htmlFor="branchSelect">
              Select Branch:
            </label>
            <select
              className="questionInput"
              id="branchSelect"
              name="branch_id"
              value={formData.branch_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="questionLabel" htmlFor="staffSelect">
              Select Staff:
            </label>
            <select
              className="questionInput"
              id="staffSelect"
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
          <div className="form-group">
            <label className="questionLabel" htmlFor="statusSelect">
              Status:
            </label>
            <select
              className="questionInput"
              id="statusSelect"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="form-group">
            <label className="questionLabel" htmlFor="dateInput">
              Date
            </label>
            <input
              type="date"
              className="questionInput"
              id="dateInput"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="questionLabel" htmlFor="timeInput">
              Time
            </label>
            <input
              type="time"
              className="questionInput"
              id="timeInput"
              name="appointment_time"
              value={formData.appointment_time}
              onChange={handleChange}
              required
            />
          </div>
          {/* Rating field */}
          <div className="form-group">
            <label className="questionLabel" htmlFor="ratingInput">
              Rating
            </label>
            <input
              type="number"
              className="questionInput"
              id="ratingInput"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              placeholder="e.g. 5"
            />
          </div>
          {/* Payment Receipt file upload */}
          <div className="form-group">
            <label className="questionLabel" htmlFor="receiptFile">
              Payment Receipt
            </label>
            <input
              className="questionInput"
              id="receiptFile"
              type="file"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" className="button-ManageFAQEdit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

// ---------------------
// Manage Appointment Add Component
// ---------------------
const ManageAppointmentAdd = ({ setActivePage, fetchAppointments }) => {
  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  const [formData, setFormData] = useState({
    user_id: "",
    first_name: "",
    last_name: "",
    email: "",
    contact_no: "",
    service_type: "",
    branch_id: "",
    staff_id: "",
    appointment_date: "",
    appointment_time: "",
    rating: "",
    // Payment receipt file
    fileReceipt: null,
  });

  useEffect(() => {
    fetchAllServices()
      .then(setServices)
      .catch(() => {});
    fetchBranches();
    fetchRegisteredUsers().then(setUsers);
  }, []);

  useEffect(() => {
    if (formData.branch_id) {
      fetchStaff();
    } else {
      setStaffList([]);
    }
  }, [formData.branch_id]);

  const fetchBranches = async () => {
    try {
      const response = await fetch(
        "http://localhost/admin_dashboard_backend/branch_fetch_branches.php"
      );
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchStaff = async () => {
    try {
      setLoadingStaff(true);
      const response = await fetch(
        `http://localhost/admin_dashboard_backend/branch_fetch_staff.php?branch_ids=${encodeURIComponent(
          formData.branch_id
        )}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (data.success) {
        setStaffList(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      setStaffList([]);
      Swal.fire("Error!", "Failed to fetch staff.", "error");
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleUserSelect = (e) => {
    const selectedUserId = e.target.value;
    setFormData((prev) => ({ ...prev, user_id: selectedUserId }));
    if (selectedUserId !== "") {
      const selectedUser = users.find(
        (user) => String(user.id) === selectedUserId
      );
      if (selectedUser) {
        const nameParts = selectedUser.name.split(" ");
        const firstName = nameParts.shift();
        const lastName = nameParts.join(" ");
        setFormData((prev) => ({
          ...prev,
          first_name: firstName,
          last_name: lastName,
          email: selectedUser.email,
          contact_no: selectedUser.contactNumber,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        first_name: "",
        last_name: "",
        email: "",
        contact_no: "",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    setFormData((prev) => ({ ...prev, service_type: e.target.value }));
  };

  // Payment receipt file onChange
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, fileReceipt: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();
    formPayload.append("user_id", formData.user_id);
    formPayload.append("first_name", formData.first_name);
    formPayload.append("last_name", formData.last_name);
    formPayload.append("email", formData.email);
    formPayload.append("contact_no", formData.contact_no);
    formPayload.append("service_type", formData.service_type);
    formPayload.append("branch_id", formData.branch_id);
    formPayload.append("staff_id", formData.staff_id);
    formPayload.append("appointment_date", formData.appointment_date);
    formPayload.append("appointment_time", formData.appointment_time);
    formPayload.append("rating", formData.rating);

    // Append the file if not null
    if (formData.fileReceipt) {
      formPayload.append("receipt_file", formData.fileReceipt);
    }

    try {
      const response = await fetch(
        "http://localhost/admin_dashboard_backend/add_appointment.php",
        {
          method: "POST",
          credentials: "include",
          body: formPayload,
        }
      );
      if (!response.ok) throw new Error("Failed to add appointment");
      const result = await response.json();
      Swal.fire({
        title: "Success!",
        text: result.message,
        icon: "success",
        confirmButtonText: "OK",
      });
      fetchAppointments();
      setActivePage({ page: "AppointmentAppointments" });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to add appointment. Please check the console for details.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error adding appointment:", error);
    }
  };

  return (
    <div className="faq-main-container">
      <button
        onClick={() => setActivePage({ page: "AppointmentAppointments" })}
        className="faq-edit-backbutton"
      >
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Add Appointment</p>
        </div>
        <form onSubmit={handleSubmit} className="faq-edit">
          <div className="form-group">
            <label className="questionLabel" htmlFor="userSelect">
              Select Registered User (or choose Guest):
            </label>
            <select
              className="questionInput"
              id="userSelect"
              name="user_id"
              value={formData.user_id}
              onChange={handleUserSelect}
            >
              <option value="">Guest</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="questionLabel" htmlFor="firstNameInput">
              First Name
            </label>
            <input
              className="questionInput"
              id="firstNameInput"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              disabled={!!formData.user_id}
            />
          </div>
          <div className="form-group">
            <label className="questionLabel" htmlFor="lastNameInput">
              Last Name
            </label>
            <input
              className="questionInput"
              id="lastNameInput"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              disabled={!!formData.user_id}
            />
          </div>
          <div className="form-group">
            <label className="questionLabel" htmlFor="emailInput">
              Email
            </label>
            <input
              className="questionInput"
              id="emailInput"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={!!formData.user_id}
            />
          </div>
          <div className="form-group">
            <label className="questionLabel" htmlFor="contactInput">
              Contact Number
            </label>
            <input
              className="questionInput"
              id="contactInput"
              name="contact_no"
              value={formData.contact_no}
              onChange={handleChange}
              required
              disabled={!!formData.user_id}
            />
          </div>
          <div className="form-group">
            <label className="questionLabel" htmlFor="serviceSelect">
              Select Service:
            </label>
            <select
              className="questionInput"
              id="serviceSelect"
              name="service_type"
              value={formData.service_type}
              onChange={handleServiceChange}
              required
            >
              <option value="">Select Service</option>
              {services.map((srv) => (
                <option key={`${srv.category}-${srv.id}`} value={srv.name}>
                  {srv.name} {srv.price ? `- ₱${srv.price}` : ""} (
                  {srv.category})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="questionLabel" htmlFor="branchSelect">
              Select Branch:
            </label>
            <select
              className="questionInput"
              id="branchSelect"
              name="branch_id"
              value={formData.branch_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="questionLabel" htmlFor="staffSelect">
              Select Staff:
            </label>
            <select
              className="questionInput"
              id="staffSelect"
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
          <div className="form-group">
            <label className="questionLabel" htmlFor="dateInput">
              Date
            </label>
            <input
              type="date"
              className="questionInput"
              id="dateInput"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="questionLabel" htmlFor="timeInput">
              Time
            </label>
            <input
              type="time"
              className="questionInput"
              id="timeInput"
              name="appointment_time"
              value={formData.appointment_time}
              onChange={handleChange}
              required
            />
          </div>
          {/* Rating field */}
          <div className="form-group">
            <label className="questionLabel" htmlFor="ratingInput">
              Rating
            </label>
            <input
              type="number"
              className="questionInput"
              id="ratingInput"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              placeholder="e.g. 5"
            />
          </div>
          {/* Payment Receipt file upload */}
          <div className="form-group">
            <label className="questionLabel" htmlFor="receiptFile">
              Payment Receipt
            </label>
            <input
              className="questionInput"
              id="receiptFile"
              type="file"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" className="button-ManageFAQEdit">
            Create Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

// ---------------------
// Main Appointments Component
// ---------------------
const AppointmentAppointments = () => {
  const [activePage, setActivePage] = useState({
    page: "AppointmentAppointments",
  });
  const [searchText, setSearchText] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        "http://localhost/admin_dashboard_backend/fetch_appointment.php"
      );
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredData = appointments.filter((item) => {
    const fullName = `${item.first_name} ${item.last_name}`.toLowerCase();
    const email = item.email ? item.email.toLowerCase() : "";
    const contact = item.contact_no ? item.contact_no.toLowerCase() : "";
    const service = item.service_type ? item.service_type.toLowerCase() : "";
    const branch = item.branch_name ? item.branch_name.toLowerCase() : "";
    const staff = item.staff_name ? item.staff_name.toLowerCase() : "";
    const dateTimeString =
      `${item.appointment_date} ${item.appointment_time}`.toLowerCase();
    const search = searchText.toLowerCase();
    return (
      fullName.includes(search) ||
      email.includes(search) ||
      contact.includes(search) ||
      service.includes(search) ||
      branch.includes(search) ||
      staff.includes(search) ||
      dateTimeString.includes(search)
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {activePage.page === "AppointmentAppointments" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Appointments</p>
            <div className="faq-header-actions">
              <button
                className="add-faq-button"
                style={{ width: "163px" }}
                onClick={() => setActivePage({ page: "ManageAppointmentAdd" })}
              >
                + Add Appointment
              </button>
              <div className="search-container">
                <CiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="faq-search-bar"
                />
              </div>
            </div>
          </div>
          <AppointmentTable
            setActivePage={setActivePage}
            activePage={activePage}
            data={filteredData}
            fetchAppointments={fetchAppointments}
          />
        </div>
      ) : activePage.page === "ManageAppointmentEdit" ? (
        <ManageAppointmentEdit
          setActivePage={setActivePage}
          activePage={activePage}
          fetchAppointments={fetchAppointments}
        />
      ) : (
        <ManageAppointmentAdd
          setActivePage={setActivePage}
          fetchAppointments={fetchAppointments}
        />
      )}
    </>
  );
};

export default AppointmentAppointments;
