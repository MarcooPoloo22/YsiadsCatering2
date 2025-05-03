import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/customer/CreateAccount.css";

const CreateAccount = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        middle_initial: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
        contact_no: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        if (!formData.first_name || !formData.last_name) {
            Swal.fire('Error', 'First name and last name are required', 'error');
            return false;
        }

        if (!formData.email) {
            Swal.fire('Error', 'Email is required', 'error');
            return false;
        }

        if (formData.password !== formData.confirm_password) {
            Swal.fire('Error', 'Passwords do not match', 'error');
            return false;
        }

        if (formData.password.length < 6) {
            Swal.fire('Error', 'Password must be at least 6 characters', 'error');
            return false;
        }

        if (!formData.contact_no) {
            Swal.fire('Error', 'Contact number is required', 'error');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost/createAccount.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include' // Important for cookies if using sessions
            });

            const responseText = await response.text();
            let result;
            
            try {
                result = JSON.parse(responseText);
            } catch (jsonError) {
                console.error('JSON Parsing Error:', jsonError);
                throw new Error('Server returned invalid response');
            }

            if (!response.ok) {
                throw new Error(result.message || 'Registration failed');
            }

            // Success case
            await Swal.fire({
                icon: 'success',
                title: 'Success!',
                html: `
                    <p>${result.message}</p>
                    <p class="small">You will be redirected to login page</p>
                `,
                timer: 5000,
                timerProgressBar: true,
                willClose: () => {
                    navigate("/login");
                }
            });

            navigate("/login");

        } catch (error) {
            console.error('Registration Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.message || 'An error occurred during registration',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-account-container d-flex justify-content-center align-items-center">
            <div className="form-box p-4">
                <h2 className="text-center mb-4">Create your Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-12 col-md-4 mb-3 mb-md-0">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="First Name *"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-4 mb-3 mb-md-0">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Middle Initial"
                                name="middle_initial"
                                value={formData.middle_initial}
                                onChange={handleChange}
                                maxLength="1"
                            />
                        </div>
                        <div className="col-12 col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Last Name *"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email Address *"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password * (min 6 chars)"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                        <small className="form-text text-muted">
                            Must contain uppercase, lowercase, and number
                        </small>
                    </div>

                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm Password *"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="tel"
                            className="form-control"
                            placeholder="Contact No. * (e.g., 09123456789)"
                            name="contact_no"
                            value={formData.contact_no}
                            onChange={handleChange}
                            required
                            pattern="^09\d{9}$"
                            title="Philippine format: 09123456789"
                        />
                    </div>

                    <div className="mb-4 d-flex justify-content-center">
                        <button 
                            className="regsubmit" 
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Registering...
                                </>
                            ) : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;