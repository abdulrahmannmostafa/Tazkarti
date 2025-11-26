import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchAPI } from '../../services/api';
import { teams } from '../../data/teams';
import { stadiums } from '../../data/stadiums';
import './CreateMatch.css';

const CreateMatch = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        homeTeamId: '',
        awayTeamId: '',
        stadiumId: '',
        dateTime: '',
        mainReferee: '',
        linesman1: '',
        linesman2: ''
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

        if (formData.homeTeamId === formData.awayTeamId) {
            setError('Home and Away teams cannot be the same');
            return;
        }

        setIsSubmitting(true);

        try {
            const matchData = {
                ...formData,
                homeTeamId: parseInt(formData.homeTeamId),
                awayTeamId: parseInt(formData.awayTeamId),
                stadiumId: parseInt(formData.stadiumId)
            };

            const result = await matchAPI.create(matchData);

            if (result.success) {
                navigate('/matches');
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Failed to create match');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-match-page">
            <div className="container">
                <div className="form-card glass-card">
                    <h1 className="text-gradient mb-xl">Create New Match</h1>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Home Team</label>
                                <select
                                    name="homeTeamId"
                                    className="form-select"
                                    value={formData.homeTeamId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Home Team</option>
                                    {teams.map(team => (
                                        <option key={team.id} value={team.id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Away Team</label>
                                <select
                                    name="awayTeamId"
                                    className="form-select"
                                    value={formData.awayTeamId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Away Team</option>
                                    {teams.map(team => (
                                        <option key={team.id} value={team.id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Stadium</label>
                                <select
                                    name="stadiumId"
                                    className="form-select"
                                    value={formData.stadiumId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Stadium</option>
                                    {stadiums.map(stadium => (
                                        <option key={stadium.id} value={stadium.id}>
                                            {stadium.name} ({stadium.city})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    name="dateTime"
                                    className="form-input"
                                    value={formData.dateTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Main Referee</label>
                            <input
                                type="text"
                                name="mainReferee"
                                className="form-input"
                                value={formData.mainReferee}
                                onChange={handleChange}
                                required
                                placeholder="Enter referee name"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Linesman 1</label>
                                <input
                                    type="text"
                                    name="linesman1"
                                    className="form-input"
                                    value={formData.linesman1}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter linesman 1 name"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Linesman 2</label>
                                <input
                                    type="text"
                                    name="linesman2"
                                    className="form-input"
                                    value={formData.linesman2}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter linesman 2 name"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/matches')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Match'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateMatch;
