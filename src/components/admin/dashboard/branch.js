import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import "../../../styles/admin/dashboard/faqs.css";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { MdOutlineEventAvailable } from "react-icons/md";

const customStyles = {
  pagination: {
    style: {
      justifyContent: "center",
    },
  },
};

const BranchTable = ({ setActivePage, branches, fetchBranches }) => {
  const handleDeleteBranch = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this branch!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          "http://localhost/admin_dashboard_backend/branch_delete_branch.php",
          {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete branch");
        }

        const resData = await response.json();
        Swal.fire({
          title: "Deleted!",
          text: resData.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        fetchBranches();
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete branch. Please check the console for details.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error deleting branch:", error);
      }
    }
  };

  const columns = [
    {
      name: "Branch Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            onClick={() =>
              setActivePage({ page: "ManageBranchEdit", branch: row })
            }
            className="edit-button"
          >
            <FaRegEdit />
          </button>
          <button
            onClick={() => handleDeleteBranch(row.id)}
            className="delete-button"
          >
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
      data={branches}
      pagination
      highlightOnHover
      responsive
      customStyles={customStyles}
    />
  );
};

const StaffTable = ({ staff, handleEditStaff, handleDeleteStaff, manageDoctorAvailability }) => {
  const columns = [
    {
      name: "Staff Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Branch",
      selector: (row) => row.branch_name,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.is_surgery_staff === 1 ? "DOCTOR" : "STAFF",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button onClick={() => handleEditStaff(row)} className="edit-button">
            <FaRegEdit size={16.72} />
          </button>
          {row.is_surgery_staff === 1 && (
            <button onClick={() => manageDoctorAvailability(row.id, row.name)} className="available-button">
              <MdOutlineEventAvailable size={16.72}/>
            </button>
          )}
          <button
            onClick={() => handleDeleteStaff(row.id)}
            className="delete-button"
          >
            <FaRegTrashAlt size={14.5} />
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
      data={staff}
      pagination
      highlightOnHover
      responsive
      customStyles={customStyles}
    />
  );
};

const ManageBranchEdit = ({ setActivePage, branch, fetchBranches }) => {
  const [branchName, setBranchName] = useState(branch.name);
  const [staff, setStaff] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchStaff = async () => {
    try {
      const response = await fetch(
        `http://localhost/admin_dashboard_backend/branch_fetch_staff.php?branch_ids=${branch.id}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch staff');
      }
      
      const resData = await response.json();
      
      if (resData.success) {
        setStaff(resData.data.map(member => ({
          ...member,
          is_surgery_staff: member.is_surgery_staff === 1 ? 1 : 0
        })));
      } else {
        throw new Error(resData.message);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [refreshKey]);

  const handleUpdateBranch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost/admin_dashboard_backend/branch_update_branch.php",
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: branch.id, name: branchName }),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update branch');
      }
      
      const resData = await response.json();
      Swal.fire({
        title: "Success!",
        text: resData.message,
        icon: "success",
        confirmButtonText: "OK",
      });
      fetchBranches();
      setActivePage({ page: "Branches" });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to update branch",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error updating branch:", error);
    }
  };

  const manageDoctorAvailability = async (doctorId, doctorName) => {
    let currentAvailability = [];
    
    const fetchAvailability = async () => {
      try {
        const response = await fetch(
          `http://localhost/admin_dashboard_backend/doctor_get_availability.php?doctor_id=${doctorId}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            currentAvailability = data.availability || [];
          }
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    await fetchAvailability();

    const container = document.createElement('div');
    container.style.textAlign = 'left';
    
    const title = document.createElement('h4');
    title.textContent = `Manage Availability for ${doctorName}`;
    container.appendChild(title);
    
    const instructions = document.createElement('p');
    instructions.textContent = 'Add available date and time slots for this doctor:';
    container.appendChild(instructions);
    
    const inputGroup = document.createElement('div');
    inputGroup.style.display = 'grid';
    inputGroup.style.gridTemplateColumns = '1fr 1fr auto';
    inputGroup.style.gap = '10px';
    inputGroup.style.marginBottom = '15px';
    
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'availability-date';
    dateInput.style.padding = '8px';
    dateInput.min = new Date().toISOString().split('T')[0];
    inputGroup.appendChild(dateInput);
    
    const timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.id = 'availability-time';
    timeInput.style.padding = '8px';
    timeInput.step = '1800';
    inputGroup.appendChild(timeInput);
    
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Slot';
    addButton.style.padding = '8px 15px';
    addButton.style.backgroundColor = '#4CAF50';
    addButton.style.color = 'white';
    addButton.style.border = 'none';
    addButton.style.borderRadius = '4px';
    addButton.style.cursor = 'pointer';
    addButton.onclick = async () => {
      const date = dateInput.value;
      const time = timeInput.value;
      
      if (!date || !time) {
        Swal.showValidationMessage('Please select both date and time');
        return;
      }
      
      const dateTime = `${date} ${time}:00`;
      
      try {
        const response = await fetch(
          "http://localhost/admin_dashboard_backend/doctor_add_availability.php",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              doctor_id: doctorId,
              date_time: dateTime 
            }),
          }
        );
        
        if (!response.ok) {
          throw new Error("Failed to add availability");
        }
        
        const resData = await response.json();
        if (resData.success) {
          await fetchAvailability();
          renderAvailabilityList();
          dateInput.value = '';
          timeInput.value = '';
          setRefreshKey(prev => prev + 1);
        } else {
          Swal.showValidationMessage(resData.message || "Failed to add availability");
        }
      } catch (error) {
        Swal.showValidationMessage("Failed to add availability");
        console.error("Error adding availability:", error);
      }
    };
    inputGroup.appendChild(addButton);
    container.appendChild(inputGroup);
    
    const availabilityList = document.createElement('div');
    availabilityList.id = 'availability-list';
    availabilityList.style.maxHeight = '300px';
    availabilityList.style.overflowY = 'auto';
    container.appendChild(availabilityList);
    
    const renderAvailabilityList = () => {
      availabilityList.innerHTML = '';
      
      if (currentAvailability.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'No availability slots added yet';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.color = '#777';
        availabilityList.appendChild(emptyMsg);
        return;
      }
      
      const groupedByDate = currentAvailability.reduce((acc, dt) => {
        const date = dt.split(' ')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(dt.split(' ')[1].substring(0, 5));
        return acc;
      }, {});
      
      Object.entries(groupedByDate).forEach(([date, times]) => {
        const dateGroup = document.createElement('div');
        dateGroup.style.marginBottom = '15px';
        
        const dateHeader = document.createElement('div');
        dateHeader.style.display = 'flex';
        dateHeader.style.justifyContent = 'space-between';
        dateHeader.style.alignItems = 'center';
        dateHeader.style.marginBottom = '5px';
        dateHeader.style.paddingBottom = '5px';
        dateHeader.style.borderBottom = '1px solid #eee';
        
        const dateText = document.createElement('strong');
        dateText.textContent = new Date(date).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        dateHeader.appendChild(dateText);
        
        const deleteDateButton = document.createElement('button');
        deleteDateButton.textContent = 'Remove All';
        deleteDateButton.style.padding = '3px 8px';
        deleteDateButton.style.fontSize = '12px';
        deleteDateButton.style.backgroundColor = '#f44336';
        deleteDateButton.style.color = 'white';
        deleteDateButton.style.border = 'none';
        deleteDateButton.style.borderRadius = '3px';
        deleteDateButton.style.cursor = 'pointer';
        deleteDateButton.onclick = async () => {
          try {
            const response = await fetch(
              "http://localhost/admin_dashboard_backend/doctor_remove_availability.php",
              {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                  doctor_id: doctorId,
                  date_time: `${date}%`
                }),
              }
            );
            
            if (!response.ok) {
              throw new Error("Failed to remove availability");
            }
            
            const resData = await response.json();
            if (resData.success) {
              await fetchAvailability();
              renderAvailabilityList();
              setRefreshKey(prev => prev + 1);
            } else {
              Swal.showValidationMessage(resData.message || "Failed to remove availability");
            }
          } catch (error) {
            Swal.showValidationMessage("Failed to remove availability");
            console.error("Error removing availability:", error);
          }
        };
        dateHeader.appendChild(deleteDateButton);
        dateGroup.appendChild(dateHeader);
        
        const timesContainer = document.createElement('div');
        timesContainer.style.display = 'flex';
        timesContainer.style.flexWrap = 'wrap';
        timesContainer.style.gap = '5px';
        
        times.forEach(time => {
          const timeItem = document.createElement('div');
          timeItem.style.display = 'flex';
          timeItem.style.alignItems = 'center';
          timeItem.style.gap = '5px';
          timeItem.style.padding = '3px 8px';
          timeItem.style.backgroundColor = '#e3f2fd';
          timeItem.style.borderRadius = '3px';
          
          const timeText = document.createElement('span');
          timeText.textContent = time;
          timeItem.appendChild(timeText);
          
          const deleteButton = document.createElement('button');
          deleteButton.textContent = '×';
          deleteButton.style.background = 'none';
          deleteButton.style.border = 'none';
          deleteButton.style.color = '#f44336';
          deleteButton.style.cursor = 'pointer';
          deleteButton.style.padding = '0';
          deleteButton.onclick = async () => {
            try {
              const response = await fetch(
                "http://localhost/admin_dashboard_backend/doctor_remove_availability.php",
                {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ 
                    doctor_id: doctorId,
                    date_time: `${date} ${time}:00`
                  }),
                }
              );
              
              if (!response.ok) {
                throw new Error("Failed to remove availability");
              }
              
              const resData = await response.json();
              if (resData.success) {
                await fetchAvailability();
                renderAvailabilityList();
                setRefreshKey(prev => prev + 1);
              } else {
                Swal.showValidationMessage(resData.message || "Failed to remove availability");
              }
            } catch (error) {
              Swal.showValidationMessage("Failed to remove availability");
              console.error("Error removing availability:", error);
            }
          };
          timeItem.appendChild(deleteButton);
          timesContainer.appendChild(timeItem);
        });
        
        dateGroup.appendChild(timesContainer);
        availabilityList.appendChild(dateGroup);
      });
    };
    
    renderAvailabilityList();
    
    await Swal.fire({
      title: `Manage Doctor Availability`,
      html: container,
      width: '700px',
      showConfirmButton: false,
      showCloseButton: true
    });
  };

  const handleAddStaff = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add New Staff",
      html: `
        <input id="staff-name" class="swal2-input" placeholder="Staff Name">
        <div style="margin-top: 4rem; text-align: center;">
          <label>
            <input type="checkbox" id="doctor-checkbox"> 
            This staff member is a DOCTOR (Surgery Staff)
          </label>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          name: document.getElementById('staff-name').value,
          isDoctor: document.getElementById('doctor-checkbox').checked
        };
      },
      inputValidator: (value) => {
        if (!document.getElementById('staff-name').value) {
          return "You need to enter a staff name!";
        }
      }
    });

    if (formValues) {
      try {
        const response = await fetch(
          "http://localhost/admin_dashboard_backend/branch_add_staff.php",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              name: formValues.name, 
              branch_id: branch.id,
              is_surgery_staff: formValues.isDoctor ? 1 : 0
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add staff');
        }

        const resData = await response.json();
        
        if (resData.status === "success") {
          const newStaff = { 
            id: resData.id, 
            name: formValues.name,
            branch_name: branch.name,
            is_surgery_staff: resData.is_surgery_staff
          };
          
          setStaff([...staff, newStaff]);
          
          Swal.fire({
            title: "Success!",
            text: "Staff added successfully!",
            icon: "success",
          });
          
          if (formValues.isDoctor) {
            await manageDoctorAvailability(resData.id, formValues.name);
          }
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to add staff",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error adding staff:", error);
      }
    }
  };

  const handleDeleteStaff = async (staffId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this staff!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });
    
    if (result.isConfirmed) {
      try {
        const response = await fetch(
          "http://localhost/admin_dashboard_backend/branch_delete_staff.php",
          {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: staffId }),
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete staff');
        }
        
        const resData = await response.json();
        Swal.fire({
          title: "Deleted!",
          text: resData.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        setStaff(staff.filter((member) => member.id !== staffId));
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to delete staff",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error deleting staff:", error);
      }
    }
  };

  const handleEditStaff = async (staffMember) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Staff",
      html: `
        <input id="staff-name" class="swal2-input" placeholder="Staff Name" value="${staffMember.name}">
        <div style="margin-top: 4rem; text-align: center;">
          <label>
            <input type="checkbox" id="doctor-checkbox" ${staffMember.is_surgery_staff === 1 ? 'checked' : ''}> 
            This staff member is a DOCTOR (Surgery Staff)
          </label>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          name: document.getElementById('staff-name').value,
          isDoctor: document.getElementById('doctor-checkbox').checked
        };
      },
      inputValidator: (value) => {
        if (!document.getElementById('staff-name').value) {
          return "You need to enter a staff name!";
        }
      }
    });

    if (formValues && (formValues.name !== staffMember.name || formValues.isDoctor !== (staffMember.is_surgery_staff === 1))) {
      try {
        const response = await fetch(
          "http://localhost/admin_dashboard_backend/branch_update_staff.php",
          {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              id: staffMember.id, 
              name: formValues.name,
              is_surgery_staff: formValues.isDoctor ? 1 : 0
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update staff');
        }

        const resData = await response.json();

        Swal.fire({
          title: "Success!",
          text: resData.message,
          icon: "success",
          confirmButtonText: "OK",
        });

        const updatedStaff = staff.map((member) =>
          member.id === staffMember.id 
            ? { 
                ...member, 
                name: formValues.name,
                is_surgery_staff: resData.is_surgery_staff
              } 
            : member
        );

        setStaff(updatedStaff);

        if (formValues.isDoctor) {
          await manageDoctorAvailability(staffMember.id, formValues.name);
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to update staff",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error updating staff:", error);
      }
    }
  };

  return (
    <div className="faq-main-container">
      <button
        onClick={() => setActivePage({ page: "Branches" })}
        className="faq-edit-backbutton"
      >
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Edit Branch</p>
        </div>
        <form className="faq-edit" onSubmit={handleUpdateBranch}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="branchNameInput">
              Branch Name
            </label>
            <input
              className="questionInput"
              id="branchNameInput"
              name="branchNameInput"
              placeholder="Branch Name"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button-ManageFAQEdit">
            Save Branch
          </button>
        </form>
        <div className="form-group">
          <label className="questionLabel">Staff Available:</label>
          <StaffTable
            staff={staff}
            handleEditStaff={handleEditStaff}
            handleDeleteStaff={handleDeleteStaff}
            manageDoctorAvailability={manageDoctorAvailability}
          />
          <div className="edit-branch-button-center">
            <button onClick={handleAddStaff} className="button-ManageFAQEdit">
                Add Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManageBranchAdd = ({ setActivePage, fetchBranches }) => {
  const [branchName, setBranchName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!branchName) return;
    try {
      const response = await fetch(
        "http://localhost/admin_dashboard_backend/branch_add_branch.php",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: branchName }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add branch");
      }
      const resData = await response.json();
      Swal.fire({
        title: "Success!",
        text: resData.message,
        icon: "success",
        confirmButtonText: "OK",
      });
      fetchBranches();
      setActivePage({ page: "Branches" });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to add branch. Please check the console for details.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error adding branch:", error);
    }
  };

  return (
    <div className="faq-main-container">
      <button
        onClick={() => setActivePage({ page: "Branches" })}
        className="faq-edit-backbutton"
      >
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Add Branch</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="branchNameInput">
              Branch Name
            </label>
            <input
              className="questionInput"
              id="branchNameInput"
              name="branchNameInput"
              placeholder="Branch Name"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button-ManageFAQEdit">
            Save Branch
          </button>
        </form>
      </div>
    </div>
  );
};

const Branch = () => {
  const [activePage, setActivePage] = useState({ page: "Branches" });
  const [searchText, setSearchText] = useState("");
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBranches = async () => {
    try {
      const response = await fetch(
        "http://localhost/admin_dashboard_backend/branching_fetch_branches.php"
      );
      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Failed to fetch branches");
      }
      setBranches(resData.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {activePage.page === "Branches" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Branches</p>
            <div className="faq-header-actions">
              <button
                className="add-faq-button"
                style={{ width: "110px" }}
                onClick={() => setActivePage({ page: "ManageBranchAdd" })}
              >
                + Add Branch
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
          <BranchTable
            setActivePage={setActivePage}
            branches={filteredBranches}
            fetchBranches={fetchBranches}
          />
        </div>
      ) : activePage.page === "ManageBranchEdit" ? (
        <ManageBranchEdit
          setActivePage={setActivePage}
          branch={activePage.branch}
          fetchBranches={fetchBranches}
        />
      ) : (
        <ManageBranchAdd
          setActivePage={setActivePage}
          fetchBranches={fetchBranches}
        />
      )}
    </>
  );
};

export default Branch;