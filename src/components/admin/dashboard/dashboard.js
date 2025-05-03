import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../../styles/admin/dashboard/faqs.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Icons
import { FaCartShopping } from "react-icons/fa6";
import { FaUsers, FaCalendar } from "react-icons/fa";
import { IoBriefcase } from "react-icons/io5";
import { FaBriefcaseMedical } from "react-icons/fa";

// Initialize the localizer with moment
const localizer = momentLocalizer(moment);

// Initialize React-specific SweetAlert
const MySwal = withReactContent(Swal);

const DashboardCalendar = () => {
  // State for dashboard metrics
  const [totalServices, setTotalServices] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  
  // State for calendar controls
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("week");

  // State for filters and data
  const [branches, setBranches] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Custom alert styling
  const alertStyle = {
    error: {
      background: '#FFF3F3',
      titleColor: '#C03221',
      confirmButton: '#C03221',
      iconColor: '#C03221'
    },
    info: {
      background: '#F5F9FF',
      titleColor: '#068B92',
      confirmButton: '#068B92',
      iconColor: '#068B92'
    }
  };

  // Show error alert
  const showErrorAlert = (message) => {
    MySwal.fire({
      title: '<strong>Error</strong>',
      html: `<div style="color: #555;">${message}</div>`,
      icon: 'error',
      background: alertStyle.error.background,
      iconColor: alertStyle.error.iconColor,
      showConfirmButton: true,
      confirmButtonColor: alertStyle.error.confirmButton,
      confirmButtonText: 'OK',
      customClass: {
        title: 'swal-title',
        htmlContainer: 'swal-html',
        confirmButton: 'swal-confirm-button'
      }
    });
  };

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch branches
        const branchesRes = await fetch("http://localhost/admin_dashboard_backend/dashboard_fetch_branches.php");
        const branchesData = await branchesRes.json();
        setBranches(branchesData);

        // Fetch services count
        const servicesRes = await fetch("http://localhost/admin_dashboard_backend/fetch_total_services.php");
        if (!servicesRes.ok) throw new Error('Services fetch failed');
        const servicesData = await servicesRes.json();
        setTotalServices(servicesData.total_services || 0);

        // Fetch products count
        const productsRes = await fetch("http://localhost/admin_dashboard_backend/fetch_total_products.php");
        if (!productsRes.ok) throw new Error('Products fetch failed');
        const productsData = await productsRes.json();
        setTotalProducts(productsData.total_products || 0);

        const customersRes = await fetch("http://localhost/admin_dashboard_backend/dashboard_fetch_total_customers.php");
        if (!customersRes.ok) throw new Error('Customers fetch failed');
        const customersData = await customersRes.json();
        setTotalCustomers(customersData.total_customers || 0);

        // Fetch initial appointments
        const appointmentsRes = await fetch("http://localhost/admin_dashboard_backend/dashboard_fetch_appointments.php");
        const appointmentsData = await appointmentsRes.json();
        setEvents(formatAppointments(appointmentsData));
      } catch (error) {
        console.error("Error fetching initial data:", error);
        showErrorAlert('Failed to fetch initial data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch staff when branch changes
  useEffect(() => {
    if (selectedBranch) {
      setIsLoading(true);
      fetch(`http://localhost/admin_dashboard_backend/dashboard_fetch_staff.php?branch_id=${selectedBranch}`)
        .then(res => res.json())
        .then(data => {
          setStaff(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching staff:", error);
          showErrorAlert('Failed to fetch staff data. Please try again later.');
          setIsLoading(false);
        });
    } else {
      setStaff([]);
      setSelectedStaff("");
    }
  }, [selectedBranch]);

  // Fetch appointments when filters change
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        let url = "http://localhost/admin_dashboard_backend/dashboard_fetch_appointments.php?";
        if (selectedBranch) url += `branch_id=${selectedBranch}&`;
        if (selectedStaff) url += `staff_id=${selectedStaff}`;

        const res = await fetch(url);
        const data = await res.json();
        setEvents(formatAppointments(data));
      } catch (error) {
        console.error("Error fetching appointments:", error);
        showErrorAlert('Failed to fetch appointments. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedBranch, selectedStaff]);

  // Helper function to format appointments for calendar
  const formatAppointments = (appointments) => {
    return appointments.map(appointment => ({
      id: appointment.id,
      title: appointment.service_type,
      name: `${appointment.first_name} ${appointment.last_name}`,
      start: new Date(`${appointment.appointment_date}T${appointment.appointment_time}`),
      end: new Date(new Date(`${appointment.appointment_date}T${appointment.appointment_time}`).getTime() + 3600000), // +1 hour
      staff: appointment.staff_name,
      branch: appointment.branch_name,
      status: appointment.status
    }));
  };

  // Custom event component
  const EventComponent = ({ event }) => (
    <div className="custom-event">
      <strong>{event.title}</strong>
      <div className="event-client">{event.name}</div>
      {event.staff && <div className="event-staff">Staff: {event.staff}</div>}
      {event.status && <div className={`event-status ${event.status}`}>{event.status}</div>}
    </div>
  );

  // Custom Toolbar Component
  const CustomToolbar = (toolbar) => {
    const goToToday = () => {
      toolbar.onNavigate("TODAY");
      setDate(new Date());
    };

    const changeView = (newView) => {
      toolbar.onView(newView);
      setView(newView);
    };

    return (
      <div className="rbc-toolbar">
        <div className="rbc-btn-group">
          <button onClick={goToToday} className="rbc-toolbar-button">
            Today
          </button>
        </div>

        <div className="rbc-btn-group">
          <button
            className="rbc-toolbar-button"
            onClick={() => toolbar.onNavigate("PREV")}
          >
            Back
          </button>
          <button
            className="rbc-toolbar-button"
            onClick={() => toolbar.onNavigate("NEXT")}
          >
            Next
          </button>
        </div>

        <div className="rbc-toolbar-label">{toolbar.label}</div>

        <div className="rbc-btn-group view-buttons">
          <button
            className={`rbc-toolbar-button ${view === "month" ? "active" : ""}`}
            onClick={() => changeView("month")}
          >
            Month
          </button>
          <button
            className={`rbc-toolbar-button ${view === "week" ? "active" : ""}`}
            onClick={() => changeView("week")}
          >
            Week
          </button>
          <button
            className={`rbc-toolbar-button ${view === "day" ? "active" : ""}`}
            onClick={() => changeView("day")}
          >
            Day
          </button>
        </div>
      </div>
    );
  };

  // Handle event click with enhanced SweetAlert
  const handleEventClick = (event) => {
    MySwal.fire({
      title: `<strong style="color: ${alertStyle.info.titleColor}">Appointment Details</strong>`,
      html: `
        <div style="text-align: left; color: #444; line-height: 1.6;">
          <p style="margin-bottom: 8px;"><strong style="color: #555;">Service:</strong> <span style="color: #333;">${event.title}</span></p>
          <p style="margin-bottom: 8px;"><strong style="color: #555;">Client:</strong> <span style="color: #333;">${event.name}</span></p>
          <p style="margin-bottom: 8px;"><strong style="color: #555;">Date:</strong> <span style="color: #333;">${moment(event.start).format("MMMM Do YYYY")}</span></p>
          <p style="margin-bottom: 8px;"><strong style="color: #555;">Time:</strong> <span style="color: #333;">${moment(event.start).format("h:mm a")} - ${moment(event.end).format("h:mm a")}</span></p>
          <p style="margin-bottom: 8px;"><strong style="color: #555;">Staff:</strong> <span style="color: #333;">${event.staff || "Not assigned"}</span></p>
          <p style="margin-bottom: 8px;"><strong style="color: #555;">Branch:</strong> <span style="color: #333;">${event.branch || "Not specified"}</span></p>
          <p style="margin-bottom: 0;"><strong style="color: #555;">Status:</strong> <span class="status-badge" style="
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            background: ${event.status === 'confirmed' ? '#E3F5EC' : event.status === 'cancelled' ? '#FFE8E8' : '#F0F0F0'};
            color: ${event.status === 'confirmed' ? '#17904B' : event.status === 'cancelled' ? '#C03221' : '#555'};
          ">${event.status || "Unknown"}</span></p>
        </div>
      `,
      background: alertStyle.info.background,
      showConfirmButton: true,
      confirmButtonColor: alertStyle.info.confirmButton,
      confirmButtonText: 'Close',
      showCloseButton: true,
      width: '600px',
      padding: '2rem',
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        htmlContainer: 'custom-swal-html',
        confirmButton: 'custom-swal-confirm-button',
        closeButton: 'custom-swal-close-button'
      }
    });
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Header Cards */}
      <div className="dashboard-header">
        {[
          { icon: <IoBriefcase size={28} />, bg: "#068B92", text: "Total Services", count: totalServices },
          { icon: <FaCartShopping size={28} />, bg: "#F16A1B", text: "Total Products", count: totalProducts },
          { icon: <FaBriefcaseMedical size={28} />, bg: "#17904B", text: "Weekly Appointments", count: events.filter(e => moment(e.start).isSame(new Date(), "week")).length },
          { icon: <FaUsers size={28} />, bg: "#C03221", text: "Registered Users", count: totalCustomers }
        ].map((card, i) => (
          <div className="dashboard-card" key={i}>
            <div className="dashboard-card-icon" style={{ backgroundColor: card.bg }}>
              {card.icon}
            </div>
            <div className="dashboard-card-info">
              <span className="dashboard-card-text">{card.text}</span>
              <span className="dashboard-card-count">{card.count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Calendar Area */}
      <div className="calendar-main-container">
        <div className="calendar-container">
          {isLoading ? (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Loading appointments...</p>
            </div>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              date={date}
              view={view}
              onNavigate={setDate}
              onView={setView}
              defaultView="week"
              views={["month", "week", "day"]}
              components={{
                event: EventComponent,
                toolbar: CustomToolbar
              }}
              onSelectEvent={handleEventClick}
              style={{ height: "100%", padding: "1rem" }}
            />
          )}
        </div>

        {/* Side Container with Filters */}
        <div className="dashboard-calendar-sidecontainer">
          <div className="filters-section">
            <h3>Filter Appointments</h3>
            
            <div className="filter-group">
              <label htmlFor="branch-filter">Branch:</label>
              <select
                id="branch-filter"
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  setSelectedStaff("");
                }}
                disabled={isLoading}
              >
                <option value="">All Branches</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="staff-filter">Staff:</label>
              <select
                id="staff-filter"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                disabled={!selectedBranch || isLoading}
              >
                <option value="">All Staff</option>
                {staff.map(staffMember => (
                  <option key={staffMember.id} value={staffMember.id}>
                    {staffMember.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-results">
              <h4>Current Filters:</h4>
              <p>
                <strong>Branch:</strong> {selectedBranch ? branches.find(b => b.id == selectedBranch)?.name : "All"}
              </p>
              <p>
                <strong>Staff:</strong> {selectedStaff ? staff.find(s => s.id == selectedStaff)?.name : "All"}
              </p>
              <p>
                <strong>Appointments:</strong> {events.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles for SweetAlert */}
      <style>
        {`
          .custom-swal-popup {
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border: 1px solid #e0e0e0;
          }
          .custom-swal-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
          }
          .custom-swal-html {
            font-size: 1rem;
            line-height: 1.5;
          }
          .custom-swal-confirm-button {
            padding: 8px 24px;
            border-radius: 6px;
            font-weight: 500;
            transition: all 0.2s;
          }
          .custom-swal-confirm-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
          .custom-swal-close-button {
            color: #999;
            transition: color 0.2s;
          }
          .custom-swal-close-button:hover {
            color: #666;
          }
        `}
      </style>
    </div>
  );
};

export default DashboardCalendar;