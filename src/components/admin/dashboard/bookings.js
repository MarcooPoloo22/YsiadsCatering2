import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "../../../styles/admin/dashboard/faqs.css";
import Swal from 'sweetalert2';
import { CiSearch } from "react-icons/ci";

const customStyles = {
  pagination: {
    style: { justifyContent: "center" },
  },
  cells: {
    style: { whiteSpace: "normal", wordWrap: "break-word" },
  },
  headCells: {
    style: { whiteSpace: "normal", wordWrap: "break-word" },
  },
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // Fetch all bookings from backend
    fetch("http://localhost/admin_dashboard_backend/fetch_bookings.php", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((payload) => {
        if (payload.success) {
          setBookings(payload.bookings);
        } else {
          console.error("Fetch error:", payload.message);
        }
      })
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  // Filter data based on search text
  const filteredData = bookings.filter(item =>
    item.package_title.toLowerCase().includes(searchText.toLowerCase()) ||
    item.contact.toLowerCase().includes(searchText.toLowerCase()) ||
    item.event_date.toLowerCase().includes(searchText.toLowerCase())
  );

  // Define columns to match your table
  const columns = [
    {
      name: "Package Title",
      selector: (row) => row.package_title,
      sortable: true,
      wrap: true,
      minWidth: "150px",
    },
    {
      name: "Event Date",
      selector: (row) => row.event_date,
      sortable: true,
      width: "120px",
    },
    {
      name: "Guests",
      selector: (row) => row.guests,
      sortable: true,
      width: "100px",
    },
    {
      name: "Dietary",
      selector: (row) => row.dietary || "None",
      wrap: true,
      minWidth: "120px",
    },
    {
      name: "Contact",
      selector: (row) => row.contact,
      wrap: true,
      minWidth: "150px",
    },
  ];

  return (
    <div className="faq-main-container">
      <div className="faq-header">
        <p className="faq-text">Catering Orders</p>
        <div className="faq-header-actions">
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
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        paginationRowsPerPageOptions={[10, 20, 30]}
        highlightOnHover
        responsive
        customStyles={customStyles}
        dense
        fixedHeader
        fixedHeaderScrollHeight="400px"
      />
    </div>
  );
};

export default Bookings;