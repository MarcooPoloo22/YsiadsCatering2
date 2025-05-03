import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/admin/ASR Logo.png";
import frame1 from "../../assets/admin/DashboardDesign.png";
import welcome from "../../assets/admin/Graphic Side.png";
import "../../styles/admin/adminDashboard.css";
import { TbLogout2 } from "react-icons/tb";
import { RxDashboard } from "react-icons/rx";
import { VscSettings } from "react-icons/vsc";
import { LuMessageSquareMore } from "react-icons/lu";
import { RiDiscountPercentLine, RiEditBoxLine } from "react-icons/ri";
import { AiOutlineShopping } from "react-icons/ai";
import { FaRegHandPaper } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlinePolicy } from "react-icons/md";
import { MdOutlineMedicalServices, MdOutlineEditCalendar, MdPayment } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { IoCallOutline, IoSettingsOutline } from "react-icons/io5";
import Admin from "../../components/admin/dashboard/admin.js";
import Appointments from "../../components/admin/dashboard/appointments.js";
import Branch from "../../components/admin/dashboard/branch.js";
import Contact from "../../components/admin/dashboard/contact.js";
import DashboardCalendar from "../../components/admin/dashboard/dashboard.js";
import Faqs from "../../components/admin/dashboard/faqs.js";
import Logs from "../../components/admin/dashboard/logs.js";
import Messages from "../../components/admin/dashboard/messages.js";
import Products from "../../components/admin/dashboard/products.js";
import Promos from "../../components/admin/dashboard/promos.js";
import Services from "../../components/admin/dashboard/services.js";
import Surgeries from "../../components/admin/dashboard/surgeries.js";
import Users from "../../components/admin/dashboard/users.js";
import Password from "../../components/admin/dashboard/password.js";
import Payment from "../../components/admin/dashboard/payment.js";
import Policy from "../../components/admin/dashboard/policy.js";

const Button = ({ children, onClick, isActive }) => (
  <button className={`button ${isActive ? "active" : ""}`} onClick={onClick}>
    {children}
  </button>
);

const Header = ({ onLogout, user }) => {
  return (
    <nav className="header">
      <div className="admin-header">
        <div className="admin">
          <span className="admin-name">{user?.first_name || "User"}</span>
          <span className="role">
            {user?.role === "admin" ? "Administrator" : "Employee"}
          </span>
        </div>
        <button className="admin-logout" onClick={onLogout}>
          <TbLogout2 style={{ marginRight: "4px" }} />
          Log Out
        </button>
      </div>
    </nav>
  );
};

const Dashboard = ({ isLoggedIn, user, setUser, setIsLoggedIn }) => {
  const [activePage, setActivePage] = useState("Home");
  const navigate = useNavigate();

  // Use useCallback to ensure handleLogout's reference remains stable.
  const handleLogout = useCallback(async () => {
    try {
      await fetch("http://localhost/admin_dashboard_backend/logout.php", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }, [navigate, setUser, setIsLoggedIn]);

  // Redirect if not logged in, or invalid role.
  useEffect(() => {
    if (!isLoggedIn) {
      return navigate("/login");
    }
    if (isLoggedIn && user) {
      if (user.role !== "admin" && user.role !== "employee") {
        return navigate("/");
      }
    }
  }, [isLoggedIn, user, navigate]);

  // Listen for the popstate event to detect back navigation.
  useEffect(() => {
    const handlePopState = () => {
      // Automatically log out when the user navigates back.
      handleLogout();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handleLogout]);

  // Map pages to corresponding components.
  const pages = {
    Home: <DashboardCalendar />,
    Profile: <Branch />,
    Messages: <Messages />,
    ManageServices: <Services />,
    ManagePromos: <Promos />,
    ManageProducts: <Products />,
    ManageFAQ: <Faqs />,
    ManageSurgeries: <Surgeries />,
    ManageContact: <Contact />,
    ManagePayment: <Payment />,
    ManagePolicy: <Policy />,
    ManageAppointments: <Appointments />,
    ManageUsers: <Users />,
    ManageAdmin: <Admin />,
    Logs: <Logs />,
    Password: <Password />,
  };

  // Sidebar buttons based on user role (admin vs. employee).
  const getSidebarButtons = () => {
    if (user?.role === "admin") {
      return (
        <>
          <Button onClick={() => setActivePage("Home")} isActive={activePage === "Home"}>
            <RxDashboard className="icon" /> Dashboard
          </Button>
          <Button onClick={() => setActivePage("Profile")} isActive={activePage === "Profile"}>
            <VscSettings className="icon" /> Branch
          </Button>
          <div className="divider" />
          <Button onClick={() => setActivePage("Messages")} isActive={activePage === "Messages"}>
            <LuMessageSquareMore className="icon" /> Messages
          </Button>
          <Button onClick={() => setActivePage("ManageServices")} isActive={activePage === "ManageServices"}>
            <FaRegHandPaper className="icon" /> Manage Services
          </Button>
          <Button onClick={() => setActivePage("ManagePromos")} isActive={activePage === "ManagePromos"}>
            <RiDiscountPercentLine className="icon" /> Manage Promos
          </Button>
          <Button onClick={() => setActivePage("ManageProducts")} isActive={activePage === "ManageProducts"}>
            <AiOutlineShopping className="icon" /> Manage Products
          </Button>
          <Button onClick={() => setActivePage("ManageSurgeries")} isActive={activePage === "ManageSurgeries"}>
            <MdOutlineMedicalServices className="icon" /> Manage Surgeries
          </Button>
          <Button onClick={() => setActivePage("ManageFAQ")} isActive={activePage === "ManageFAQ"}>
            <RiEditBoxLine className="icon" /> Manage FAQ
          </Button>
          <Button onClick={() => setActivePage("ManageContact")} isActive={activePage === "ManageContact"}>
            <IoCallOutline className="icon" /> Manage Contact
          </Button>
          <Button onClick={() => setActivePage("ManagePayment")} isActive={activePage === "ManagePayment"}>
            <MdPayment className="icon" /> Manage Payment
          </Button>
          <Button onClick={() => setActivePage("ManagePolicy")} isActive={activePage === "ManagePolicy"}>
            <MdOutlinePolicy className="icon" /> Manage Policy
          </Button>
          <div className="divider" />
          <Button onClick={() => setActivePage("ManageAppointments")} isActive={activePage === "ManageAppointments"}>
            <MdOutlineEditCalendar className="icon" /> Manage Appointments
          </Button>
          <Button onClick={() => setActivePage("ManageUsers")} isActive={activePage === "ManageUsers"}>
            <BsPeople className="icon" /> Manage Users
          </Button>
          <Button onClick={() => setActivePage("ManageAdmin")} isActive={activePage === "ManageAdmin"}>
            <BsPeople className="icon" /> Manage Admin
          </Button>
          <Button onClick={() => setActivePage("Logs")} isActive={activePage === "Logs"}>
            <IoSettingsOutline className="icon" /> Audit Trail
          </Button>
          <div className="divider" />
          <Button onClick={() => setActivePage("Password")} isActive={activePage === "Password"}>
            <RiLockPasswordLine className="icon" /> Change Password
          </Button>
        </>
      );
    } else if (user?.role === "employee") {
      return (
        <>
          <Button onClick={() => setActivePage("Home")} isActive={activePage === "Home"}>
            <RxDashboard className="icon" /> Dashboard
          </Button>
          <Button onClick={() => setActivePage("ManageAppointments")} isActive={activePage === "ManageAppointments"}>
            <MdOutlineEditCalendar className="icon" /> Manage Appointments
          </Button>
          <Button onClick={() => setActivePage("Password")} isActive={activePage === "Password"}>
            <RiLockPasswordLine className="icon" /> Change Password
          </Button>
        </>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <Link className="logo" to="/admindashboard">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <div className="sidebar-buttons">{getSidebarButtons()}</div>
        <img src={frame1} className="design-pic" alt="Dashboard Design" />
      </div>

      <div className="content-area">
        <Header onLogout={handleLogout} user={user} />

        <div className="welcome-container">
          <img src={welcome} className="welcome" alt="Welcome" />
          <div className="welcome-overlay">
            <div className="welcome-role">
              Welcome, {user?.role === "admin" ? "admin!" : "employee!"}
            </div>
            <div className="welcome-message">
              {user?.role === "admin"
                ? "Welcome to the Admin Dashboard – Manage all system features, user accounts, and operations."
                : "Welcome to the Employee Portal – View and manage appointments, and check staff availability."}
            </div>
          </div>
        </div>

        {pages[activePage]}
      </div>
    </div>
  );
};

export default Dashboard;
