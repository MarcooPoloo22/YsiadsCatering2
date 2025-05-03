import React, { useState } from "react";
import Swal from 'sweetalert2';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/customer/ForgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        try {
            const response = await fetch('http://localhost/forgotPassword.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            // Check if the response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response from server.');
            }

            const result = await response.json();

            if (result.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: result.message,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.message,
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while processing your request.',
            });
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <h2 className="text-center mb-4"><strong>Forgot Password</strong></h2>
                <p className="text-center mb-4">Enter your email address to receive a reset link.</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError('');
                            }}
                            required
                        />
                        {emailError && <p className="text-danger">{emailError}</p>}
                    </div>
                    <div className="mb-4 d-flex justify-content-center">
                        <button className="submit-btn" type="submit">Send Reset Link</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;