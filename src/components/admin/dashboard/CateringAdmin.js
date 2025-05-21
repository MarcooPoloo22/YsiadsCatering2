import { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import "../../../styles/admin/dashboard/faqs.css";
import Swal from 'sweetalert2';
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

const CateringTable = ({ setActivePage, activePage, data, setPackages, setSelectedPackage }) => {
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the package and all its images!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('http://localhost/admin_dashboard_backend/delete_catering.php', {
          method: 'DELETE',
          credentials: 'include',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            Swal.fire('Deleted!', data.message, 'success');
            setPackages(prev => prev.filter(pkg => pkg.id !== id));
          } else {
            Swal.fire('Error!', data.message, 'error');
          }
        })
        .catch(error => {
          Swal.fire('Error!', 'Failed to delete package', 'error');
          console.error('Delete error:', error);
        });
      }
    });
  };

  const columns = [
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true,
      wrap: true,
      maxWidth: '200px',
    },
    {
      name: 'Description',
      selector: row => row.description,
      wrap: true,
      maxWidth: '400px',
    },
    {
      name: 'Price',
      selector: row => `₱${parseFloat(row.price).toFixed(2)}`,
      sortable: true,
      maxWidth: '100px',
    },
    {
      name: 'Images',
      cell: row => <div>{(row.images || []).length} images</div>,
      maxWidth: '100px',
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <button 
            onClick={() => { 
              setSelectedPackage({
                ...row,
                images: Array.isArray(row.images) ? row.images : []
              }); 
              setActivePage("EditPackage"); 
            }} 
            className="edit-button"
          >
            <FaRegEdit />
          </button>
          <button 
            onClick={() => handleDelete(row.id)} 
            className="delete-button"
          >
            <FaRegTrashAlt />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '100px',
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      pagination
      customStyles={customStyles}
      highlightOnHover
      responsive
      dense
      fixedHeader
      fixedHeaderScrollHeight="400px"
    />
  );
};

const PackageForm = ({ packageData, setActivePage, setPackages, isEditing }) => {
  const [formData, setFormData] = useState({
    title: packageData?.title || '',
    description: packageData?.description || '',
    price: packageData?.price || '',
    images: Array.isArray(packageData?.images) ? packageData.images : []
  });
  const [newImages, setNewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formPayload = new FormData();
    formPayload.append('title', formData.title);
    formPayload.append('description', formData.description);
    formPayload.append('price', formData.price);
    newImages.forEach(file => formPayload.append('images[]', file));

    const url = isEditing ? 
      `http://localhost/admin_dashboard_backend/update_catering.php?id=${formData.id}` :
      'http://localhost/admin_dashboard_backend/add_catering.php';

    fetch(url, {
      method: isEditing ? 'PUT' : 'POST',
      credentials: 'include',
      body: formPayload,
    })
    .then(response => response.json())
    .then(data => {
      setIsSubmitting(false);
      if (data.success) {
        Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        setActivePage("Catering");
        setPackages(prev => isEditing ? 
          prev.map(p => p.id === formData.id ? {
            ...data.package,
            images: Array.isArray(data.package.images) ? data.package.images : []
          } : p) : 
          [...prev, {
            ...data.package,
            images: Array.isArray(data.package.images) ? data.package.images : []
          }]
        );
      } else {
        Swal.fire({
          title: 'Error!',
          text: data.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    })
    .catch(error => {
      setIsSubmitting(false);
      Swal.fire({
        title: 'Error!',
        text: 'Operation failed',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      console.error(error);
    });
  };

  const handleFileChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({...formData, images: updatedImages});
  };

  return (
    <div className="faq-main-container">
      <button 
        onClick={() => setActivePage("Catering")} 
        className="faq-edit-backbutton"
      >
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">{isEditing ? 'Edit' : 'Add'} Package</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel">Title</label>
            <input
              className="questionInput"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel">Description</label>
            <textarea
              className="answerInput"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
              rows={5}
            />
          </div>
          <div className="form-group">
            <label className="questionLabel">Price</label>
            <input
              className="questionInput"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel">Images</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*"
              className="file-input"
            />
            {formData.images.length > 0 && (
              <div className="existing-images-container">
                <p>Existing Images:</p>
                <div className="existing-images-grid">
                  {formData.images.map((img, index) => (
                    <div key={index} className="existing-image">
                      <img 
                        src={img} 
                        alt={`Package ${index}`} 
                        className="image-thumbnail"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="remove-image-button"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {newImages.length > 0 && (
              <div className="new-images-container">
                <p>New Images to Upload:</p>
                <div className="new-images-grid">
                  {Array.from(newImages).map((file, index) => (
                    <div key={index} className="new-image">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="image-thumbnail"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button 
            type="submit" 
            className="button-ManageFAQEdit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : (isEditing ? 'Update' : 'Create')} Package
          </button>
        </form>
      </div>
    </div>
  );
};

const CateringAdmin = () => {
  const [activePage, setActivePage] = useState("Catering");
  const [searchText, setSearchText] = useState("");
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://localhost/admin_dashboard_backend/fetch_catering.php');
        const data = await response.json();
        if (data.success) {
          setPackages(data.packages.map(pkg => ({
            ...pkg,
            images: Array.isArray(pkg.images) ? pkg.images : []
          })));
        } else {
          console.error(data.message);
          Swal.fire('Error!', 'Failed to load packages', 'error');
        }
      } catch (error) {
        console.error(error);
        Swal.fire('Error!', 'Network error', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const filteredData = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchText.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchText.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="faq-main-container">
        <div className="loading-container">
          <p>Loading catering packages...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {activePage === "Catering" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Catering Packages</p>
            <div className="faq-header-actions">
              <button 
                className="add-faq-button" 
                style={{width:'160px'}}
                onClick={() => setActivePage("AddPackage")}
              >
                + Add Package
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
          <CateringTable
            setActivePage={setActivePage}
            activePage={activePage}
            data={filteredData}
            setPackages={setPackages}
            setSelectedPackage={setSelectedPackage}
          />
        </div>
      ) : (
        <PackageForm
          packageData={selectedPackage}
          setActivePage={setActivePage}
          setPackages={setPackages}
          isEditing={activePage === "EditPackage"}
        />
      )}
    </>
  );
};

export default CateringAdmin;