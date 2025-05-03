import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import "../../../styles/admin/dashboard/faqs.css";

// Icons
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";

const customStyles = {
  pagination: {
    style: {
      justifyContent: "center",
    },
  },
  cells: {
    style: {
      whiteSpace: 'normal',
      wordWrap: 'break-word',
    },
  },
  headCells: {
    style: {
      whiteSpace: 'normal',
      wordWrap: 'break-word',
    },
  },
};

// MultiSelectDropdown Component (same as in promos.js)
const MultiSelectDropdown = ({ options, selectedValues, onToggle, placeholder, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="multi-select-dropdown">
      <div
        className={`dropdown-header ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {selectedValues.length > 0
          ? `${selectedValues.length} selected`
          : placeholder}
      </div>
      {isOpen && (
        <div className="dropdown-options">
          {options.map(option => (
            <label
              key={option.id}
              className={`dropdown-option ${selectedValues.includes(option.id) ? 'selected' : ''}`}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option.id)}
                onChange={() => onToggle(option.id)}
              />
              {option.name} - {option.branch_name} 
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const SurgeryTable = ({ setActivePage, activePage, data, fetchSurgeries }) => {
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this surgery appointment!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost/admin_dashboard_backend/delete_surgery.php`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete surgery');
        }

        const result = await response.json();
        Swal.fire({
          title: 'Deleted!',
          text: result.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
        fetchSurgeries();
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete surgery. Please check the console for details.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        console.error('Error deleting surgery:', error);
      }
    }
  };

  const columns = [
    { 
      name: 'Title', 
      selector: row => row.title, 
      sortable: true,
      wrap: true,
      minWidth: '150px',
      maxWidth: '200px',
    },
    { 
      name: 'Description', 
      selector: row => row.description, 
      sortable: true,
      wrap: true,
      minWidth: '300px',
    },
    { 
      name: 'Price', 
      selector: row => row.price, 
      sortable: true,
      width: '100px',
    },
    {
      name: 'Image',
      cell: row => <a href={row.image_url} target="_blank" rel="noopener noreferrer">View Image</a>,
      ignoreRowClick: true,
      width: '100px',
    },
    {
      name: 'Action',
      cell: row => (
        <div>
          <button onClick={() => setActivePage({ page: "ManageSurgeryEdit", surgery: row })} className="edit-button">
            <FaRegEdit />
          </button>
          <button onClick={() => handleDelete(row.id)} className="delete-button">
            <FaRegTrashAlt />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      width: '69px',
    },
  ];

  return (
    <DataTable 
      columns={columns} 
      data={data} 
      pagination 
      paginationRowsPerPageOptions={[10, 20, 30]}
      highlightOnHover 
      responsive 
      customStyles={customStyles}
      dense
      fixedHeader
      fixedHeaderScrollHeight="400px"
    />
  );
};

const ManageSurgeryEdit = ({ setActivePage, activePage, fetchSurgeries }) => {
  const surgery = activePage.surgery || {};

  // Safely parse dates and times
  const parseDateTime = (dateTime) => {
    if (!dateTime) return { date: '', time: '00:00' };
    
    try {
      const [date, time] = dateTime.split('T');
      return {
        date: date || '',
        time: time ? time.substring(0, 5) : '00:00'
      };
    } catch (error) {
      console.error('Error parsing date:', error);
      return { date: '', time: '00:00' };
    }
  };


  const [formData, setFormData] = useState({
    id: surgery.id || '',
    title: surgery.title || '',
    description: surgery.description || '',
    price: surgery.price || '',
    image_url: surgery.image_url || '',
    selectedBranches: surgery.branch_ids || [],
    selectedStaff: surgery.staff_ids || [],
    duration: surgery.duration || 1,
    image: null
  });

  const [branches, setBranches] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (formData.selectedBranches.length > 0) {
      fetchStaff();
    } else {
      setStaff([]);
    }
  }, [formData.selectedBranches]);

  const fetchBranches = async () => {
    try {
      const response = await fetch("http://localhost/admin_dashboard_backend/branch_fetch_branches.php");
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
        `http://localhost/admin_dashboard_backend/branch_fetch_staff.php?branch_ids=${formData.selectedBranches.join(",")}`
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Staff API Response:", result); // Debugging line
  
      if (!result.success) {
        throw new Error(result.message);
      }
  
      if (!Array.isArray(result.data)) {
        throw new Error("Invalid data format: expected an array");
      }
  
      // Filter only those with is_surgery_staff === 1
      const surgeryStaff = result.data.filter(staff => staff.is_surgery_staff === "1" || staff.is_surgery_staff === 1);
  
      setStaff(surgeryStaff);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setStaff([]); // Fallback to empty array
      Swal.fire('Error!', 'Failed to fetch staff. Please check the console for details.', 'error');
    } finally {
      setLoadingStaff(false);
    }
  };
  

  const handleBranchToggle = (branchId) => {
    setFormData(prev => ({
      ...prev,
      selectedBranches: prev.selectedBranches.includes(branchId)
        ? prev.selectedBranches.filter(id => id !== branchId)
        : [...prev.selectedBranches, branchId],
      selectedStaff: []
    }));
  };

  const handleStaffToggle = (staffId) => {
    setFormData(prev => ({
      ...prev,
      selectedStaff: prev.selectedStaff.includes(staffId)
        ? prev.selectedStaff.filter(id => id !== staffId)
        : [...prev.selectedStaff, staffId]
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const startDateTime = `${formData.startDate}T${formData.startTime}`;
  const endDateTime = `${formData.endDate}T${formData.endTime}`;

  const formPayload = new FormData();
  formPayload.append('id', formData.id);
  formPayload.append('title', formData.title);
  formPayload.append('description', formData.description);
  formPayload.append('price', formData.price);
  formPayload.append('duration', formData.duration);
  formPayload.append('branch_ids', JSON.stringify(formData.selectedBranches));
  formPayload.append('staff_ids', JSON.stringify(formData.selectedStaff));
  if (formData.image) {
    formPayload.append('image', formData.image);
  }

  try {
    const response = await fetch('http://localhost/admin_dashboard_backend/update_surgery.php', {
      method: 'POST',
      credentials: 'include',
      body: formPayload,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update surgery');
    }

    const result = await response.json();
    Swal.fire({
      title: 'Success!',
      text: result.message,
      icon: 'success',
      confirmButtonText: 'OK',
    });

    fetchSurgeries();
    setActivePage({ page: "SurgeryAppointments" });
  } catch (error) {
    console.error('Error updating surgery:', error);
    Swal.fire({
      title: 'Error!',
      text: error.message || 'Failed to update surgery. Please check the console for details.',
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
};

  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage({ page: "SurgeryAppointments" })} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Edit Surgery Appointment</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="titleInput">Title</label>
            <input
              className="questionInput"
              id="titleInput"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="descriptionInput">Description</label>
            <input
              className="answerInput"
              id="descriptionInput"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="answerLabel" htmlFor="priceInput">Price</label>
            <input
              className="answerInput"
              id="priceInput"
              type="number"
              value={formData.price}
              onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="imageInput">Image</label>
            <input
              className="answerInput"
              id="imageInput"
              type="file"
              onChange={e => setFormData(prev => ({ ...prev, image: e.target.files[0] }))}
            />
          </div>
          <div className="form-group">
            <label className="questionLabel">Select Branches:</label>
            <MultiSelectDropdown
              options={branches}
              selectedValues={formData.selectedBranches}
              onToggle={handleBranchToggle}
              placeholder="Select branches..."
            />
          </div>
          <div className="form-group">
            <label className="questionLabel">Select Doctor:</label>
            <MultiSelectDropdown
              options={staff}
              selectedValues={formData.selectedStaff}
              onToggle={handleStaffToggle}
              placeholder={formData.selectedBranches.length
                ? (loadingStaff ? "Loading staff..." : "Select staff...")
                : "Select branches first"}
              disabled={!formData.selectedBranches.length || loadingStaff}
            />
          </div>
          <div className="form-group">
            <label className="questionLabel" htmlFor="duration">Duration (hours)</label>
            <select
              className="questionInput"
              id="duration"
              value={formData.duration}
              onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              disabled={!formData.selectedStaff.length}
            >
              {[...Array(12).keys()].map(hour => (
                <option key={hour + 1} value={hour + 1}>
                  {hour + 1} hour{hour + 1 > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="button-ManageFAQEdit">Save</button>
        </form>
      </div>
    </div>
  );
};

const ManageSurgeryAdd = ({ setActivePage, activePage, fetchSurgeries }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: null,
    selectedBranches: [],
    selectedStaff: [],
    duration: 1,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });
  const [branches, setBranches] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (formData.selectedBranches.length > 0) {
      fetchStaff();
    } else {
      setStaff([]);
    }
  }, [formData.selectedBranches]);

  const fetchBranches = async () => {
    try {
      const response = await fetch("http://localhost/admin_dashboard_backend/branch_fetch_branches.php");
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
        `http://localhost/admin_dashboard_backend/branch_fetch_staff.php?branch_ids=${formData.selectedBranches.join(",")}`
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Staff API Response:", result); // Debugging line
  
      if (!result.success) {
        throw new Error(result.message);
      }
  
      if (!Array.isArray(result.data)) {
        throw new Error("Invalid data format: expected an array");
      }
  
      // Filter only those with is_surgery_staff === 1
      const surgeryStaff = result.data.filter(staff => staff.is_surgery_staff === "1" || staff.is_surgery_staff === 1);
  
      setStaff(surgeryStaff);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setStaff([]); // Fallback to empty array
      Swal.fire('Error!', 'Failed to fetch staff. Please check the console for details.', 'error');
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleBranchToggle = (branchId) => {
    setFormData(prev => ({
      ...prev,
      selectedBranches: prev.selectedBranches.includes(branchId)
        ? prev.selectedBranches.filter(id => id !== branchId)
        : [...prev.selectedBranches, branchId],
      selectedStaff: []
    }));
  };

  const handleStaffToggle = (staffId) => {
    setFormData(prev => ({
      ...prev,
      selectedStaff: prev.selectedStaff.includes(staffId)
        ? prev.selectedStaff.filter(id => id !== staffId)
        : [...prev.selectedStaff, staffId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startDateTime = `${formData.startDate}T${formData.startTime}`;
    const endDateTime = `${formData.endDate}T${formData.endTime}`;

    const formPayload = new FormData();
    formPayload.append('title', formData.title);
    formPayload.append('description', formData.description);
    formPayload.append('price', formData.price);
    formPayload.append('duration', formData.duration);
    formPayload.append('branch_ids', JSON.stringify(formData.selectedBranches));
    formPayload.append('staff_ids', JSON.stringify(formData.selectedStaff));
    if (formData.image) {
      formPayload.append('image', formData.image);
    }

    try {
      const response = await fetch(`http://localhost/admin_dashboard_backend/add_surgery.php`, {
        method: 'POST',
        credentials: 'include',
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error('Failed to add surgery');
      }

      const result = await response.json();
      Swal.fire({
        title: 'Success!',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'OK',
      });

      fetchSurgeries();
      setActivePage({ page: "SurgeryAppointments" });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add surgery. Please check the console for details.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error('Error adding surgery:', error);
    }
  };

  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage({ page: "SurgeryAppointments" })} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Add Surgery Appointment</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="titleInput">Title</label>
            <input
              className="questionInput"
              id="titleInput"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="descriptionInput">Description</label>
            <input
              className="answerInput"
              id="descriptionInput"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="priceInput">Price</label>
            <input
              className="answerInput"
              id="priceInput"
              type="number"
              value={formData.price}
              onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="imageInput">Image</label>
            <input
              className="answerInput"
              id="imageInput"
              type="file"
              onChange={e => setFormData(prev => ({ ...prev, image: e.target.files[0] }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="questionLabel">Select Branches:</label>
            <MultiSelectDropdown
              options={branches}
              selectedValues={formData.selectedBranches}
              onToggle={handleBranchToggle}
              placeholder="Select branches..."
            />
          </div>
          <div className="form-group">
            <label className="questionLabel">Select Doctor:</label>
            <MultiSelectDropdown
              options={staff}
              selectedValues={formData.selectedStaff}
              onToggle={handleStaffToggle}
              placeholder={formData.selectedBranches.length
                ? (loadingStaff ? "Loading staff..." : "Select staff...")
                : "Select branches first"}
              disabled={!formData.selectedBranches.length || loadingStaff}
            />
          </div>
          <div className="form-group">
            <label className="questionLabel" htmlFor="duration">Duration (hours)</label>
            <select
              className="questionInput"
              id="duration"
              value={formData.duration}
              onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              disabled={!formData.selectedStaff.length}
            >
              {[...Array(12).keys()].map(hour => (
                <option key={hour + 1} value={hour + 1}>
                  {hour + 1} hour{hour + 1 > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="button-ManageFAQEdit">Create Surgery</button>
        </form>
      </div>
    </div>
  );
};

const SurgeryAppointments = () => {
  const [activePage, setActivePage] = useState({ page: "SurgeryAppointments" });
  const [searchText, setSearchText] = useState("");
  const [surgeries, setSurgeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSurgeries = async () => {
    try {
      const response = await fetch("http://localhost/admin_dashboard_backend/fetch_surgeries.php");
      if (!response.ok) {
        throw new Error('Failed to fetch surgeries');
      }
      const data = await response.json();
      setSurgeries(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurgeries();
  }, []);

  const filteredData = surgeries.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase()) ||
    item.description.toLowerCase().includes(searchText.toLowerCase()) ||
    item.price.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {activePage.page === "SurgeryAppointments" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Surgery Appointments</p>
            <div className="faq-header-actions">
              <button className="add-faq-button" style={{ width: "163px" }} onClick={() => setActivePage({ page: "ManageSurgeryAdd" })}>
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
          <SurgeryTable setActivePage={setActivePage} activePage={activePage} data={filteredData} fetchSurgeries={fetchSurgeries} />
        </div>
      ) : activePage.page === "ManageSurgeryEdit" ? (
        <ManageSurgeryEdit setActivePage={setActivePage} activePage={activePage} fetchSurgeries={fetchSurgeries} />
      ) : (
        <ManageSurgeryAdd setActivePage={setActivePage} activePage={activePage} fetchSurgeries={fetchSurgeries} />
      )}
    </>
  );
};

export default SurgeryAppointments;