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

const FAQTable = ({ setActivePage, activePage, data, setFaqs, setFaqToEdit }) => {
  const handleDelete = (id) => {
    console.log("Deleting FAQ with ID:", id); // Debugging
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this FAQ!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('http://localhost/admin_dashboard_backend/delete_faq.php', {
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
            // Refresh FAQs list
            fetch('http://localhost/admin_dashboard_backend/fetch_faqs.php')
              .then(response => response.json())
              .then(data => {
                console.log("Updated FAQs after delete:", data); // Debugging
                setFaqs(data);
              })
              .catch(error => console.error('Error fetching FAQs:', error));
          })
          .catch(error => {
            console.error('Error deleting FAQ:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete FAQ. Please check the console for details.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          });
      }
    });
  };

  // Define columns
  const columns = [
    {
      name: 'Questions',
      selector: row => row.question,
      sortable: true,
      wrap: true,
      minWidth: '150px',
      maxWidth: '300px',
    },
    {
      name: 'Answer',
      selector: row => row.answer,
      sortable: true,
      wrap: true,
      minWidth: '150px',
      maxWidth: '900px',
    },
    {
      name: 'Action',
      cell: row => (
        <div>
          <button onClick={() => { setFaqToEdit(row); setActivePage("ManageFAQEdit"); }} className="edit-button">
            <FaRegEdit />
          </button>
          <button onClick={() => handleDelete(row.id)} className="delete-button">
            <FaRegTrashAlt />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
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

const ManageFAQEdit = ({ setActivePage, activePage, faqToEdit, setFaqs }) => {
  const [question, setQuestion] = useState(faqToEdit.question);
  const [answer, setAnswer] = useState(faqToEdit.answer);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const payload = {
      id: faqToEdit.id,
      question,
      answer,
    };
  
    fetch('http://localhost/admin_dashboard_backend/update_faq.php', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Update response data:", data); // Debugging
        Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setActivePage("FAQs"); // Redirect back to FAQs page
        // Refresh FAQs list
        fetch('http://localhost/admin_dashboard_backend/fetch_faqs.php')
          .then(response => response.json())
          .then(data => {
            console.log("Updated FAQs after edit:", data); // Debugging
            setFaqs(data);
          })
          .catch(error => console.error('Error fetching FAQs:', error));
      })
      .catch(error => {
        console.error('Error updating FAQ:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update FAQ. Please check the console for details.',
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
          <p className="faq-text">Edit FaQ</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="questionInput">Question</label>
            <input
              className="questionInput"
              id="questionInput"
              name="questionInput"
              placeholder="Value"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="Answer">Answer</label>
            <input
              className="answerInput"
              id="answerInput"
              name="answerInput"
              placeholder="Value"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button-ManageFAQEdit">Save</button>
        </form>
      </div>
    </div>
  );
};

const ManageFAQAdd = ({ setActivePage, activePage, setFaqs }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = {
      question: question,
      answer: answer,
    };
  
    fetch('http://localhost/admin_dashboard_backend/add_faq.php', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Add response data:", data); // Debugging
        Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setActivePage("FAQs"); // Redirect back to FAQs page
        // Refresh FAQs list
        fetch('http://localhost/admin_dashboard_backend/fetch_faqs.php')
          .then(response => response.json())
          .then(data => {
            console.log("Updated FAQs after add:", data); // Debugging
            setFaqs(data);
          })
          .catch(error => console.error('Error fetching FAQs:', error));
      })
      .catch(error => {
        console.error('Error adding FAQ:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add FAQ. Please check the console for details.',
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
          <p className="faq-text">Add FaQ</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="questionInput">Question</label>
            <input
              className="questionInput"
              id="questionInput"
              name="questionInput"
              placeholder="Value"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="Answer">Answer</label>
            <input
              className="answerInput"
              id="answerInput"
              name="answerInput"
              placeholder="Value"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
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
  const [faqs, setFaqs] = useState([]);
  const [faqToEdit, setFaqToEdit] = useState(null);

  // Fetch FAQs from backend
  useEffect(() => {
    console.log("Fetching FAQs..."); // Debugging
    fetch('http://localhost/admin_dashboard_backend/fetch_faqs.php')
      .then(response => {
        console.log("Fetch response:", response); // Debugging
        return response.json();
      })
      .then(data => {
        console.log("Fetched FAQs:", data); // Debugging
        setFaqs(data);
      })
      .catch(error => console.error('Error fetching FAQs:', error));
  }, []);

  // Filter data based on search text
  const filteredData = faqs.filter(item =>
    item.question.toLowerCase().includes(searchText.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      {activePage === "FAQs" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Frequently Asked Questions</p>
            <div className="faq-header-actions">
              <button className="add-faq-button" onClick={() => setActivePage("ManageFAQAdd")}>
                + Add FAQ
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
            setFaqs={setFaqs}
            setFaqToEdit={setFaqToEdit}
          />
        </div>
      ) : activePage === "ManageFAQEdit" ? (
        <ManageFAQEdit
          setActivePage={setActivePage}
          activePage={activePage}
          faqToEdit={faqToEdit}
          setFaqs={setFaqs}
        />
      ) : (
        <ManageFAQAdd
          setActivePage={setActivePage}
          activePage={activePage}
          setFaqs={setFaqs}
        />
      )}
    </>
  );
};

export default FAQs;