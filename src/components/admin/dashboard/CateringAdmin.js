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
    id: packageData?.id || '',
    title: packageData?.title || '',
    description: packageData?.description || '',
    price: packageData?.price || '',
    images: Array.isArray(packageData?.images) ? packageData.images : []
  });
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append('title', formData.title);
      formPayload.append('description', formData.description);
      formPayload.append('price', formData.price);
      formPayload.append('id', formData.id);
      formPayload.append('images_to_delete', JSON.stringify(deletedImages));
      
      // Append each image file
      Array.from(newImages).forEach(file => {
        formPayload.append('images[]', file);
      });

      const url = isEditing 
        ? 'http://localhost/admin_dashboard_backend/update_catering.php'
        : 'http://localhost/admin_dashboard_backend/add_catering.php';

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Operation failed');
      }

      // Refresh package list after successful submission
      const refreshResponse = await fetch('http://localhost/admin_dashboard_backend/fetch_caterings.php');
      const refreshData = await refreshResponse.json();

      if (refreshData.success) {
        setPackages(refreshData.packages.map(pkg => ({
          ...pkg,
          images: pkg.images ? pkg.images.map(img => ({ id: img.id, url: img.url })) : []
        })));
      }

      Swal.fire({
        title: 'Success!',
        text: data.message,
        icon: 'success',
        confirmButtonText: 'OK'
      });
      setActivePage("Catering");
    } catch (error) {
      console.error('Submission error:', error);
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) { // Example limit
      Swal.fire('Error!', 'Maximum 10 images allowed', 'error');
      return;
    }
    setNewImages(files);
  };


  const handleRemoveImage = (index) => {
    const imageToRemove = formData.images[index];
    if (imageToRemove?.id) {
      setDeletedImages(prev => [...prev, imageToRemove.id]);
    }
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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
                        src={img.url} 
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
        const response = await fetch('http://localhost/admin_dashboard_backend/fetch_caterings.php');
        const data = await response.json();
        if (data.success) {
          setPackages(data.packages.map(pkg => ({
            ...pkg,
            images: pkg.images ? pkg.images.map(img => ({ id: img.id, url: img.url })) : []
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