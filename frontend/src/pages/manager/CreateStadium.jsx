import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stadiumAPI } from '../../services/api';
import './CreateStadium.css';

const CreateStadium = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        city: 'Cairo',
        capacity: '',
        vipRows: '',
        vipSeatsPerRow: ''
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setIsSubmitting(true);

        try {
            const stadiumData = {
                ...formData,
                capacity: parseInt(formData.capacity),
                vipRows: parseInt(formData.vipRows),
                vipSeatsPerRow: parseInt(formData.vipSeatsPerRow)
            };

            const result = await stadiumAPI.create(stadiumData);

            if (result.success) {
                navigate('/matches'); // Or back to dashboard
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Failed to create stadium');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-stadium-page">
            <div className="container">
                <div className="form-card glass-card">
                    <h1 className="text-gradient mb-xl">Add New Stadium</h1>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Stadium Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Cairo International Stadium"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">City</label>
                                <select
                                    name="city"
                                    className="form-select"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Cairo">Cairo</option>
                                    <option value="Alexandria">Alexandria</option>
                                    <option value="Giza">Giza</option>
                                    <option value="Port Said">Port Said</option>
                                    <option value="Suez">Suez</option>
                                    <option value="Ismailia">Ismailia</option>
                                    <option value="Aswan">Aswan</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Total Capacity</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    className="form-input"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    required
                                    min="1000"
                                />
                            </div>
                        </div>

                        <div className="vip-section">
                            <h3>VIP Lounge Configuration</h3>
                            <p className="text-muted mb-md">Define the rectangular shape of the VIP area.</p>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Number of Rows</label>
                                    <input
                                        type="number"
                                        name="vipRows"
                                        className="form-input"
                                        value={formData.vipRows}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        max="50"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Seats per Row</label>
                                    <input
                                        type="number"
                                        name="vipSeatsPerRow"
                                        className="form-input"
                                        value={formData.vipSeatsPerRow}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        max="100"
                                    />
                                </div>
                            </div>

                            {formData.vipRows && formData.vipSeatsPerRow && (
                                <div className="alert alert-info">
                                    Total VIP Seats: <strong>{formData.vipRows * formData.vipSeatsPerRow}</strong>
                                </div>
                            )}
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Stadium'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateStadium;
