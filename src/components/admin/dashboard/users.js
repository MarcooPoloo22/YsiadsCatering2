import { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2'; // Import SweetAlert2

import "../../../styles/admin/dashboard/faqs.css";

// Icons
import { FaRegTrashAlt } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";

const customStyles = {
  pagination: {
    style: {
      justifyContent: 'center',
    },
  },
};

const FAQTable = ({ setActivePage, activePage, data, handleDelete }) => {
  // Define columns
  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Contact Number',
      selector: row => row.contactNumber,
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div>
          <button className="delete-button" onClick={() => handleDelete(row.id)}>
            <FaRegTrashAlt />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
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

const ManageFAQEdit = ({ setActivePage, activePage }) => {
  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage("FAQs")} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Edit FaQ</p>
        </div>
        <form className="faq-edit">
          <div className="form-group">
            <label className="questionLabel" htmlFor="questionInput">Question</label>
            <input className="questionInput" id="questionInput" name="questionInput" placeholder="Value" required />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="Answer">Answer</label>
            <input className="answerInput" id="answerInput" name="answerInput" placeholder="Value" required />
          </div>
          <button className="button-ManageFAQEdit">Save</button>
        </form>
      </div>
    </div>
  );
};

const ManageFAQAdd = ({ setActivePage, activePage }) => {
  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage("FAQs")} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Add FaQ</p>
        </div>
        <form className="faq-edit">
          <div className="form-group">
            <label className="questionLabel" htmlFor="questionInput">Question</label>
            <input className="questionInput" id="questionInput" name="questionInput" placeholder="Value" required />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="Answer">Answer</label>
            <input className="answerInput" id="answerInput" name="answerInput" placeholder="Value" required />
          </div>
          <button className="button-ManageFAQEdit">Save</button>
        </form>
      </div>
    </div>
  );
};

const FAQs = () => {
  const [activePage, setActivePage] = useState("FAQs");
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);

  // Fetch users with role 'customer' from the PHP backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost/admin_dashboard_backend/fetch_users.php?role=customer');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle user deletion
  const handleDelete = async (id) => {
    // Show confirmation dialog
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this user. This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    // If the user confirms, proceed with deletion
    if (confirmResult.isConfirmed) {
      try {
        const response = await fetch('http://localhost/admin_dashboard_backend/delete_user.php', {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        const result = await response.json();

        // Show success message
        await Swal.fire({
          title: 'Deleted!',
          text: result.message || 'User deleted successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });

        // Remove the deleted user from the UI
        setData(data.filter(user => user.id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);

        // Show error message
        await Swal.fire({
          title: 'Error!',
          text: error.message || 'An error occurred while deleting the user.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  // Filter data based on search text
  const filteredData = data.filter(item => {
    const name = item.name?.toLowerCase() || '';
    const email = item.email?.toLowerCase() || '';
    const contactNumber = item.contactNumber || '';

    return (
      name.includes(searchText.toLowerCase()) ||
      email.includes(searchText.toLowerCase()) ||
      contactNumber.includes(searchText)
    );
  });

  return (
    <>
      {activePage === "FAQs" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Users List</p>
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
          <FAQTable setActivePage={setActivePage} activePage={activePage} data={filteredData} handleDelete={handleDelete} />
        </div>
      ) : activePage === "ManageFAQEdit" ? (
        <ManageFAQEdit setActivePage={setActivePage} activePage={activePage} />
      ) : (
        <ManageFAQAdd setActivePage={setActivePage} activePage={activePage} />
      )}
    </>
  );
};

export default FAQs;