import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import './Profile.css';

const Profile = () => {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        gender: 'male',
        city: '',
        address: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                birthDate: user.birthDate || '',
                gender: user.gender || 'male',
                city: user.city || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const result = await userAPI.updateProfile(formData);

            if (result.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully' });            } else {
                setMessage({ type: 'error', text: result.error });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-card glass-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </div>
                        <div className="profile-title">
                            <h2>{user?.firstName} {user?.lastName}</h2>
                            <p>@{user?.username} � {user?.role}</p>
                        </div>
                    </div>

                    {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-section">
                            <h3>Personal Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        className="form-input"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        className="form-input"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Birth Date</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        className="form-input"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Gender</label>
                                    <select
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
                        </div>

                        <div className="form-section">
                            <h3>Contact Details</h3>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={user?.email || ''}
                                    disabled
                                    title="Email cannot be changed"
                                />
                                <small className="text-muted">Email cannot be changed</small>
                            </div>

                            <div className="form-group">
                                <label className="form-label">City</label>
                                <select
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
                                <label className="form-label">Address</label>
                                <textarea
                                    name="address"
                                    className="form-textarea"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="2"
                                ></textarea>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
