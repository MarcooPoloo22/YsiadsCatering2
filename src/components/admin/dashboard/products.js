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

const FAQTable = ({ setActivePage, activePage, data, setProducts, setProductToEdit }) => {
  const handleDelete = (id) => {
    console.log("Deleting product with ID:", id); // Debugging
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('http://localhost/admin_dashboard_backend/delete_product.php', {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log("Delete response data:", data); // Debugging
            Swal.fire({
              title: 'Deleted!',
              text: data.message,
              icon: 'success',
              confirmButtonText: 'OK',
            });
            // Refresh products list
            fetch('http://localhost/admin_dashboard_backend/fetch_products.php')
              .then(response => response.json())
              .then(data => {
                console.log("Updated products after delete:", data); // Debugging
                setProducts(data);
              })
              .catch(error => console.error('Error fetching products:', error));
          })
          .catch(error => {
            console.error('Error deleting product:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete product. Please check the console for details.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          });
      }
    });
  };

  // Define columns with responsive settings
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
      width: '100px',
    },
    {
      name: 'File',
      cell: row => (
        <a href={row.file_url} target="_blank" rel="noopener noreferrer">
          View File
        </a>
      ),
      ignoreRowClick: true,
      width: '100px',
    },
    {
      name: 'Action',
      cell: row => (
        <div>
          <button onClick={() => { setProductToEdit(row); setActivePage("ManageFAQEdit"); }} className="edit-button">
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

// Rest of your code remains the same...
const ManageFAQEdit = ({ setActivePage, activePage, productToEdit, setProducts }) => {
  const [name, setName] = useState(productToEdit.name);
  const [description, setDescription] = useState(productToEdit.description);
  const [price, setPrice] = useState(productToEdit.price);
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("id", productToEdit.id); // Ensure the ID is included
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    if (file) {
      formData.append("file", file);
    }
  
    fetch('http://localhost/admin_dashboard_backend/update_product.php', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setActivePage("FAQs"); // Redirect back to Products page
        // Refresh products list
        fetch('http://localhost/admin_dashboard_backend/fetch_products.php')
          .then(response => response.json())
          .then(data => {
            console.log("Updated products after edit:", data); // Debugging
            setProducts(data);
          })
          .catch(error => console.error('Error fetching products:', error));
      })
      .catch(error => {
        console.error('Error updating product:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update product. Please check the console for details.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  };

  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage("FAQs")} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Edit Product</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="nameInput">Name</label>
            <input
              className="questionInput"
              id="nameInput"
              name="nameInput"
              placeholder="Value"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="descriptionInput">Description</label>
            <input
              className="answerInput"
              id="descriptionInput"
              name="descriptionInput"
              placeholder="Value"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="priceInput">Price</label>
            <input
              className="answerInput"
              id="priceInput"
              name="priceInput"
              placeholder="Value"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="fileInput">File</label>
            <input
              type="file"
              className="answerInput"
              id="fileInput"
              name="fileInput"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <button type="submit" className="button-ManageFAQEdit">Save</button>
        </form>
      </div>
    </div>
  );
};

const ManageFAQAdd = ({ setActivePage, activePage, setProducts }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("file", file);

    fetch('http://localhost/admin_dashboard_backend/add_product.php', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setActivePage("FAQs"); // Redirect back to Products page
        // Refresh products list
        fetch('http://localhost/admin_dashboard_backend/fetch_products.php')
          .then(response => response.json())
          .then(data => {
            console.log("Updated products after add:", data); // Debugging
            setProducts(data);
          })
          .catch(error => console.error('Error fetching products:', error));
      })
      .catch(error => {
        console.error('Error adding product:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add product. Please check the console for details.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  };

  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage("FAQs")} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Add Product</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="nameInput">Name</label>
            <input
              className="questionInput"
              id="nameInput"
              name="nameInput"
              placeholder="Value"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="descriptionInput">Description</label>
            <input
              className="answerInput"
              id="descriptionInput"
              name="descriptionInput"
              placeholder="Value"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="priceInput">Price</label>
            <input
              className="answerInput"
              id="priceInput"
              name="priceInput"
              placeholder="Value"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="fileInput">File</label>
            <input
              type="file"
              className="answerInput"
              id="fileInput"
              name="fileInput"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          <button type="submit" className="button-ManageFAQEdit">Save</button>
        </form>
      </div>
    </div>
  );
};

const FAQs = () => {
  const [activePage, setActivePage] = useState("FAQs");
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    console.log("Fetching products..."); // Debugging
    fetch('http://localhost/admin_dashboard_backend/fetch_products.php')
      .then(response => {
        console.log("Fetch response:", response); // Debugging
        return response.json();
      })
      .then(data => {
        console.log("Fetched products:", data); // Debugging
        setProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  // Filter data based on search text
  const filteredData = products.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.description.toLowerCase().includes(searchText.toLowerCase()) ||
    item.price.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      {activePage === "FAQs" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Products</p>
            <div className="faq-header-actions">
              <button className="add-faq-button" style={{ width: "120px" }} onClick={() => setActivePage("ManageFAQAdd")}>
                + Add Product
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
          <FAQTable
            setActivePage={setActivePage}
            activePage={activePage}
            data={filteredData}
            setProducts={setProducts}
            setProductToEdit={setProductToEdit}
          />
        </div>
      ) : activePage === "ManageFAQEdit" ? (
        <ManageFAQEdit
          setActivePage={setActivePage}
          activePage={activePage}
          productToEdit={productToEdit}
          setProducts={setProducts}
        />
      ) : (
        <ManageFAQAdd
          setActivePage={setActivePage}
          activePage={activePage}
          setProducts={setProducts}
        />
      )}
    </>
  );
};

export default FAQs;