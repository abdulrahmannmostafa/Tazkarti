import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        gender: 'male',
        city: 'Cairo',
        address: '',
        role: 'fan' // Default role
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);

        try {
            // Remove confirmPassword before sending
            const { confirmPassword, ...registerData } = formData;

            const result = await register(registerData);

            if (result.success) {
                if (result.requiresApproval) {
                    setSuccess(result.message);
                    // Reset form or redirect after delay
                    setTimeout(() => navigate('/login'), 3000);
                } else {
                    navigate('/');
                }
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="register-page">
            <div className="container">
                <div className="auth-card glass-card register-card">
                    <div className="auth-header">
                        <h2 className="text-gradient">Create Account</h2>
                        <p>Join the Egyptian Premier League community</p>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    className="form-input"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    className="form-input"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="form-input"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="form-input"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="form-input"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="birthDate" className="form-label">Birth Date</label>
                                <input
                                    type="date"
                                    id="birthDate"
                                    name="birthDate"
                                    className="form-input"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gender" className="form-label">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    className="form-select"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city" className="form-label">City</label>
                                <select
                                    id="city"
                                    name="city"
                                    className="form-select"
                                    value={formData.city}
                                    onChange={handleChange}
                                >
                                    <option value="Cairo">Cairo</option>
                                    <option value="Alexandria">Alexandria</option>
                                    <option value="Giza">Giza</option>
                                    <option value="Port Said">Port Said</option>
                                    <option value="Suez">Suez</option>
                                    <option value="Luxor">Luxor</option>
                                    <option value="Aswan">Aswan</option>
                                    <option value="Ismailia">Ismailia</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="role" className="form-label">Register As</label>
                                <select
                                    id="role"
                                    name="role"
                                    className="form-select"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="fan">Fan (Customer)</option>
                                    <option value="manager">EFA Manager</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address" className="form-label">Address (Optional)</label>
                            <textarea
                                id="address"
                                name="address"
                                className="form-textarea"
                                value={formData.address}
                                onChange={handleChange}
                                rows="2"
                                style={{ minHeight: 'auto' }}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg btn-block"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/login">Sign In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
