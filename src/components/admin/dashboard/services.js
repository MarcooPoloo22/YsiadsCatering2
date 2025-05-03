import { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import "../../../styles/admin/dashboard/faqs.css";
import Swal from 'sweetalert2';

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

const FAQTable = ({ setActivePage, activePage, data, setServices, setServiceToEdit }) => {
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this service!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('http://localhost/admin_dashboard_backend/delete_service.php', {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        })
          .then(response => response.json())
          .then(data => {
            Swal.fire({
              title: 'Deleted!',
              text: data.message,
              icon: 'success',
              confirmButtonText: 'OK',
            });
            fetch('http://localhost/admin_dashboard_backend/fetch_services.php')
              .then(response => response.json())
              .then(data => setServices(data));
          })
          .catch(error => {
            console.error('Error deleting service:', error);
            Swal.fire('Error!', 'Failed to delete service', 'error');
          });
      }
    });
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
      cell: row => (
        <a href={row.file_url} target="_blank" rel="noopener noreferrer">View File</a>
      ),
      ignoreRowClick: true,
      width: '100px',
    },
    {
      name: 'Action',
      cell: row => (
        <div>
          <button onClick={() => { setServiceToEdit(row); setActivePage("ManageFAQEdit"); }} className="edit-button">
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

const MultiSelectDropdown = ({ options = [], selectedValues, onToggle, placeholder, disabled }) => {
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



const ServiceForm = ({ setActivePage, initialData, isEditing, setServices }) => {
  const [formData, setFormData] = useState(initialData);
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
  
      // Ensure data is an array
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format: expected an array");
      }
  
      setBranches(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
      setBranches([]); // Fallback to empty array
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

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formPayload = new FormData();
    formPayload.append('id', formData.id || '');
    formPayload.append('name', formData.name);
    formPayload.append('description', formData.description);
    formPayload.append('price', formData.price);
    formPayload.append('selectedBranches', JSON.stringify(formData.selectedBranches));
    formPayload.append('selectedStaff', JSON.stringify(formData.selectedStaff));
    formPayload.append('duration', formData.duration);
    if (formData.file) {
      formPayload.append('file', formData.file);
    }
  
    fetch(`http://localhost/admin_dashboard_backend/${isEditing ? 'update' : 'add'}_service.php`, {
      method: 'POST',
      credentials: 'include',
      body: formPayload,
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then(data => {
        Swal.fire('Success!', data.message, 'success');
        setActivePage("FAQs");
        fetch('http://localhost/admin_dashboard_backend/fetch_services.php')
          .then(response => response.json())
          .then(data => setServices(data));
      })
      .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error!', 'Operation failed: ' + error.message, 'error');
      });
  };

  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage("FAQs")} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">{isEditing ? 'Edit' : 'Add'} Service</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          {/* Service Fields */}
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
              required={!isEditing}
            />
          </div>

          {/* Branch Selection */}
          <div className="form-group">
            <label className="questionLabel">Select Branches:</label>
            <MultiSelectDropdown
              options={branches}
              selectedValues={formData.selectedBranches}
              onToggle={handleBranchToggle}
              placeholder="Select branches..."
            />
            {!branches.length && <p className="text-muted">No branches available</p>}
          </div>

          {/* Staff Selection */}
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

          {/* Duration Selection */}
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

          <button type="submit" className="button-ManageFAQEdit">
            {isEditing ? 'Update' : 'Create'} Service
          </button>
        </form>
      </div>
    </div>
  );
};

const FAQs = () => {
  const [activePage, setActivePage] = useState("FAQs");
  const [searchText, setSearchText] = useState("");
  const [services, setServices] = useState([]);
  const [serviceToEdit, setServiceToEdit] = useState(null);

  useEffect(() => {
    fetch('http://localhost/admin_dashboard_backend/fetch_services.php')
      .then(response => response.json())
      .then(data => setServices(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const filteredData = services.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <>
      {activePage === "FAQs" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Services</p>
            <div className="faq-header-actions">
              <button style={{width:'150px'}} className="add-faq-button" onClick={() => setActivePage("ManageFAQAdd")}>
                + Add Service
              </button>
              <div className="search-container">
                <CiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  className="faq-search-bar"
                />
              </div>
            </div>
          </div>
          <FAQTable {...{ setActivePage, activePage, data: filteredData, setServices, setServiceToEdit }} />
        </div>
      ) : (
        <ServiceForm
          setActivePage={setActivePage}
          initialData={activePage === "ManageFAQEdit" ? {
            ...serviceToEdit,
            selectedBranches: serviceToEdit?.branch_ids || [],
            selectedStaff: serviceToEdit?.staff_ids || [],
          } : {
            name: '',
            description: '',
            price: '',
            file: null,
            selectedBranches: [],
            selectedStaff: [],
            duration: 1
          }}
          isEditing={activePage === "ManageFAQEdit"}
          setServices={setServices}
        />
      )}
    </>
  );
};

export default FAQs;