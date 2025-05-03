import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import '../../../styles/admin/dashboard/faqs.css';

const Rating = () => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');

    const fetchRatings = async () => {
        try {
            const response = await fetch('http://localhost/booking.php?get_ratings=true');
            const data = await response.json();
            
            if (data.status === 'success') {
                setRatings(data.ratings);
            } else {
                throw new Error(data.message || 'Failed to fetch ratings');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRatings();
    }, []);

    const filteredRatings = ratings.filter(rating => 
        rating.staff_name.toLowerCase().includes(searchText.toLowerCase()) ||
        (rating.first_name + ' ' + rating.last_name).toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            name: 'Booking ID',
            selector: row => row.id,
            sortable: true
        },
        {
            name: 'Staff',
            selector: row => row.staff_name,
            sortable: true
        },
        {
            name: 'User',
            selector: row => `${row.first_name} ${row.last_name}`,
            sortable: true
        },
        {
            name: 'Date',
            selector: row => row.appointment_date,
            sortable: true
        },
        {
            name: 'Rating',
            cell: row => (
                <div>
                    {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ color: i < row.rating ? 'gold' : 'lightgray' }}>
                            ★
                        </span>
                    ))}
                    <span style={{ marginLeft: '5px' }}>({row.rating}/5)</span>
                </div>
            ),
            sortable: true
        }
    ];

    if (loading) return <div>Loading ratings...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="faq-main-container">
            <div className="faq-header">
                <p className="faq-text">Customer Ratings</p>
                <div className="faq-header-actions">
                    <div className="search-container">
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
            <DataTable
                columns={columns}
                data={filteredRatings}
                pagination
                highlightOnHover
                responsive
            />
        </div>
    );
};

export default Rating;