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
};

const UserTable = ({ setActivePage, users, fetchUsers }) => {
  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });
  
    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost/admin_dashboard_backend/user_delete_user.php?id=${id}`,
          { 
            method: "DELETE",
            credentials: "include"
          }
        );
  
        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(responseData.error || "Failed to delete user");
        }
        
        Swal.fire("Deleted!", responseData.message, "success");
        fetchUsers();
      } catch (error) {
        Swal.fire("Error!", error.message, "error");
      }
    }
  };

  const columns = [
    {
      name: 'Name',
      selector: row => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Contact Number',
      selector: row => row.contact_no,
      sortable: true,
    },
    {
      name: 'Role',
      selector: row => row.role,
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div>
          <button 
            onClick={() => setActivePage({ page: "ManageUserEdit", user: row })} 
            className="edit-button"
          >
            <FaRegEdit />
          </button>
          <button 
            onClick={() => handleDeleteUser(row.id)} 
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
      data={users}
      pagination
      highlightOnHover
      responsive
      customStyles={customStyles}
    />
  );
};

const ManageUserEdit = ({ setActivePage, user, fetchUsers }) => {
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    middle_initial: user.middle_initial,
    last_name: user.last_name,
    email: user.email,
    contact_no: user.contact_no,
    role: user.role,
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost/admin_dashboard_backend/user_update_user.php",
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, id: user.id }),
        }
      );

      if (!response.ok) throw new Error("Failed to update user");
      
      Swal.fire("Success!", "User updated successfully", "success");
      fetchUsers();
      setActivePage({ page: "Users" });
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    }
  };

  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage({ page: "Users" })} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Edit User</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel">First Name</label>
            <input
              className="questionInput"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="questionLabel">Middle Initial</label>
            <input
              className="questionInput"
              value={formData.middle_initial}
              onChange={(e) => setFormData({ ...formData, middle_initial: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="questionLabel">Last Name</label>
            <input
              className="questionInput"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="questionLabel">Email</label>
            <input
              className="questionInput"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="questionLabel">Contact Number</label>
            <input
              className="questionInput"
              value={formData.contact_no}
              onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="questionLabel">Role</label>
            <select
              className="questionInput"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            >
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          <div className="form-group">
            <label className="questionLabel">New Password (leave blank to keep current)</label>
            <input
              className="questionInput"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button type="submit" className="button-ManageFAQEdit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

const ManageUserAdd = ({ setActivePage, fetchUsers }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_initial: '',
    last_name: '',
    email: '',
    contact_no: '',
    role: 'employee', // Default role set to 'employee'
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.password_confirmation) {
        throw new Error("Passwords do not match");
      }

      // Prepare the data to send, excluding password_confirmation
      const dataToSend = {
        first_name: formData.first_name,
        middle_initial: formData.middle_initial,
        last_name: formData.last_name,
        email: formData.email,
        contact_no: formData.contact_no,
        role: formData.role,
        password: formData.password
      };

      const response = await fetch(
        "http://localhost/admin_dashboard_backend/user_add_user.php",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) throw new Error("Failed to create user");
      
      Swal.fire("Success!", "User created successfully", "success");
      fetchUsers();
      setActivePage({ page: "Users" });
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    }
  };

  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage({ page: "Users" })} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Add New User</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel">First Name</label>
            <input
              className="questionInput"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="questionLabel">Middle Initial</label>
            <input
              className="questionInput"
              value={formData.middle_initial}
              onChange={(e) => setFormData({ ...formData, middle_initial: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="questionLabel">Last Name</label>
            <input
              className="questionInput"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="questionLabel">Email</label>
            <input
              className="questionInput"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="questionLabel">Contact Number</label>
            <input
              className="questionInput"
              value={formData.contact_no}
              onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="questionLabel">Role</label>
            <select
              className="questionInput"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            >
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          <div className="form-group">
            <label className="questionLabel">Password</label>
            <input
              className="questionInput"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="questionLabel">Confirm Password</label>
            <input
              className="questionInput"
              type="password"
              value={formData.password_confirmation}
              onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="button-ManageFAQEdit">Create User</button>
        </form>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [activePage, setActivePage] = useState({ page: "Users" });
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost/admin_dashboard_backend/user_fetch_users.php"
      );
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      Swal.fire("Error!", "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredData = users.filter(user =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase()) ||
    user.role.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {activePage.page === "Users" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">User Management</p>
            <div className="faq-header-actions">
              <button 
                className="add-faq-button" 
                onClick={() => setActivePage({ page: "ManageUserAdd" })}
              >
                + Add User
              </button>
              <div className="search-container">
                <CiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="faq-search-bar"
                />
              </div>
            </div>
          </div>
          <UserTable 
            setActivePage={setActivePage} 
            users={filteredData} 
            fetchUsers={fetchUsers} 
          />
        </div>
      ) : activePage.page === "ManageUserEdit" ? (
        <ManageUserEdit 
          setActivePage={setActivePage} 
          user={activePage.user} 
          fetchUsers={fetchUsers} 
        />
      ) : (
        <ManageUserAdd 
          setActivePage={setActivePage} 
          fetchUsers={fetchUsers} 
        />
      )}
    </>
  );
};

export default UserManagement;