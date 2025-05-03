import { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import "../../../styles/admin/dashboard/faqs.css";

// Icons
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";

const customStyles = {
  pagination: {
    style: {
      justifyContent: 'center',
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

// MultiSelectDropdown Component
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

// FAQTable Component
const FAQTable = ({ setActivePage, activePage, data, fetchPromos }) => {
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this promo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost/admin_dashboard_backend/delete_promo.php`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete promo');
        }

        const result = await response.json();
        Swal.fire({
          title: 'Deleted!',
          text: result.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });

        fetchPromos();
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete promo. Please check the console for details.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        console.error('Error deleting promo:', error);
      }
    }
  };

  const columns = [
    { 
      name: 'Name', 
      selector: row => row.name, 
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
      width: '80px',
    },
    {
      name: 'File',
      cell: row => <a href={row.file_url} target="_blank" rel="noopener noreferrer">View File</a>,
      ignoreRowClick: true,
      width: '100px',
    },
    { 
      name: 'Start Date & Time', 
      selector: row => new Date(row.start_date).toLocaleString(), 
      sortable: true,
      wrap: true,
      minWidth: '150px',
    },
    { 
      name: 'End Date & Time', 
      selector: row => new Date(row.end_date).toLocaleString(), 
      sortable: true,
      wrap: true,
      minWidth: '150px',
    },
    {
      name: 'Action',
      cell: row => (
        <div>
          <button onClick={() => setActivePage({ page: "ManageFAQEdit", promo: row })} className="edit-button">
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

  return <DataTable 
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
/>;
};

// ManageFAQEdit Component
const ManageFAQEdit = ({ setActivePage, activePage, fetchPromos }) => {
  const promo = activePage.promo || {};
  const startDate = promo.start_date ? promo.start_date.split('T')[0] : '';
  const startTime = promo.start_date ? promo.start_date.split('T')[1].substring(0, 5) : '00:00';
  const endDate = promo.end_date ? promo.end_date.split('T')[0] : '';
  const endTime = promo.end_date ? promo.end_date.split('T')[1].substring(0, 5) : '00:00';

  const [formData, setFormData] = useState({
    ...promo,
    selectedBranches: promo.branch_ids || [],
    selectedStaff: promo.staff_ids || [],
    duration: promo.duration || 1,
    startDate: startDate,
    startTime: startTime,
    endDate: endDate,
    endTime: endTime,
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
  
      setStaff(result.data);
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
      selectedStaff: [] // Reset staff when branches change
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
  formPayload.append('id', formData.id); // Include the promo ID for updating
  formPayload.append('name', formData.name);
  formPayload.append('description', formData.description);
  formPayload.append('price', formData.price);
  formPayload.append('duration', formData.duration);
  formPayload.append('branch_ids', JSON.stringify(formData.selectedBranches));
  formPayload.append('staff_ids', JSON.stringify(formData.selectedStaff));
  formPayload.append('start_date', startDateTime);
  formPayload.append('end_date', endDateTime);
  if (formData.file) {
    formPayload.append('file', formData.file); // Append the file
  }

  try {
    const response = await fetch(`http://localhost/admin_dashboard_backend/update_promo.php`, {
      method: 'POST',
      credentials: 'include',
      body: formPayload, // Send as FormData
    });

    if (!response.ok) {
      throw new Error('Failed to update promo');
    }

    const result = await response.json();
    Swal.fire({
      title: 'Success!',
      text: result.message,
      icon: 'success',
      confirmButtonText: 'OK',
    });

    fetchPromos();
    setActivePage({ page: "FAQs" });
  } catch (error) {
    Swal.fire({
      title: 'Error!',
      text: 'Failed to update promo. Please check the console for details.',
      icon: 'error',
      confirmButtonText: 'OK',
    });
    console.error('Error updating promo:', error);
  }
};

  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage({ page: "FAQs" })} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Edit Promo</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="nameInput">Name</label>
            <input
              className="questionInput"
              id="nameInput"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
            <label className="answerLabel" htmlFor="fileInput">File</label>
            <input
              className="answerInput"
              id="fileInput"
              type="file"
              onChange={e => setFormData(prev => ({ ...prev, file: e.target.files[0] }))}
            />
          </div>
          <div className="date-row">
            <div className="date-input">
              <label className="answerLabel" htmlFor="startDateInput">Start Date</label>
              <input
                type="date"
                className="answerInput"
                id="startDateInput"
                value={formData.startDate}
                onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            <div className="date-input">
              <label className="answerLabel" htmlFor="startTimeInput">Start Time</label>
              <input
                type="time"
                className="answerInput"
                id="startTimeInput"
                value={formData.startTime}
                onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="date-row">
            <div className="date-input">
              <label className="answerLabel" htmlFor="endDateInput">End Date</label>
              <input
                type="date"
                className="answerInput"
                id="endDateInput"
                value={formData.endDate}
                onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
            <div className="date-input">
              <label className="answerLabel" htmlFor="endTimeInput">End Time</label>
              <input
                type="time"
                className="answerInput"
                id="endTimeInput"
                value={formData.endTime}
                onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>
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
            <label className="questionLabel">Select Staff:</label>
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

// ManageFAQAdd Component
const ManageFAQAdd = ({ setActivePage, activePage, fetchPromos }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    file: null,
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
      
      if (!result.success) {
        throw new Error(result.message);
      }
  
      if (!Array.isArray(result.data)) {
        throw new Error("Invalid data format: expected an array");
      }
  
      // Set the staff data (result.data is the array of staff objects)
      setStaff(result.data);
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
      selectedStaff: [] // Reset staff when branches change
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
    formPayload.append('name', formData.name);
    formPayload.append('description', formData.description);
    formPayload.append('price', formData.price);
    formPayload.append('duration', formData.duration);
    formPayload.append('branch_ids', JSON.stringify(formData.selectedBranches));
    formPayload.append('staff_ids', JSON.stringify(formData.selectedStaff));
    formPayload.append('start_date', startDateTime);
    formPayload.append('end_date', endDateTime);
    if (formData.file) {
      formPayload.append('file', formData.file);
    }

    try {
      const response = await fetch(`http://localhost/admin_dashboard_backend/add_promo.php`, {
        method: 'POST',
        credentials: 'include',
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error('Failed to add promo');
      }

      const result = await response.json();
      Swal.fire({
        title: 'Success!',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'OK',
      });

      fetchPromos();
      setActivePage({ page: "FAQs" });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add promo. Please check the console for details.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error('Error adding promo:', error);
    }
  };

  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage({ page: "FAQs" })} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Add Promo</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="nameInput">Name</label>
            <input
              className="questionInput"
              id="nameInput"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
            <label className="answerLabel" htmlFor="fileInput">File</label>
            <input
              className="answerInput"
              id="fileInput"
              type="file"
              onChange={e => setFormData(prev => ({ ...prev, file: e.target.files[0] }))}
              required
            />
          </div>
          <div className="date-row">
            <div className="date-input">
              <label className="answerLabel" htmlFor="startDateInput">Start Date</label>
              <input
                type="date"
                className="answerInput"
                id="startDateInput"
                value={formData.startDate}
                onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            <div className="date-input">
              <label className="answerLabel" htmlFor="startTimeInput">Start Time</label>
              <input
                type="time"
                className="answerInput"
                id="startTimeInput"
                value={formData.startTime}
                onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="date-row">
            <div className="date-input">
              <label className="answerLabel" htmlFor="endDateInput">End Date</label>
              <input
                type="date"
                className="answerInput"
                id="endDateInput"
                value={formData.endDate}
                onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
            <div className="date-input">
              <label className="answerLabel" htmlFor="endTimeInput">End Time</label>
              <input
                type="time"
                className="answerInput"
                id="endTimeInput"
                value={formData.endTime}
                onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>
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
            <label className="questionLabel">Select Staff:</label>
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
          <button type="submit" className="button-ManageFAQEdit">Create Promo</button>
        </form>
      </div>
    </div>
  );
};

// FAQs Component
const FAQs = () => {
  const [activePage, setActivePage] = useState({ page: "FAQs" });
  const [searchText, setSearchText] = useState("");
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPromos = async () => {
    try {
      const response = await fetch("http://localhost/admin_dashboard_backend/fetch_promos.php");
      if (!response.ok) {
        throw new Error('Failed to fetch promos');
      }
      const data = await response.json();
      setPromos(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const filteredData = promos.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.description.toLowerCase().includes(searchText.toLowerCase()) ||
    item.price.toLowerCase().includes(searchText.toLowerCase()) ||
    new Date(item.start_date).toLocaleString().toLowerCase().includes(searchText.toLowerCase()) ||
    new Date(item.end_date).toLocaleString().toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {activePage.page === "FAQs" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Promos</p>
            <div className="faq-header-actions">
              <button className="add-faq-button" style={{ width: "110px" }} onClick={() => setActivePage({ page: "ManageFAQAdd" })}>
                + Add Promo
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
          <FAQTable setActivePage={setActivePage} activePage={activePage} data={filteredData} fetchPromos={fetchPromos} />
        </div>
      ) : activePage.page === "ManageFAQEdit" ? (
        <ManageFAQEdit setActivePage={setActivePage} activePage={activePage} fetchPromos={fetchPromos} />
      ) : (
        <ManageFAQAdd setActivePage={setActivePage} activePage={activePage} fetchPromos={fetchPromos} />
      )}
    </>
  );
};

export default FAQs;