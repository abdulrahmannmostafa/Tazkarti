import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { matchAPI } from '../../services/api';
import { teams } from '../../data/teams';
import { stadiums } from '../../data/stadiums';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditMatch = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const result = await matchAPI.getById(id);
                if (result.success) {
                    const match = result.data;
                    setFormData({
                        homeTeamId: match.homeTeamId,
                        awayTeamId: match.awayTeamId,
                        stadiumId: match.stadiumId,
                        dateTime: match.dateTime,
                        mainReferee: match.mainReferee,
                        linesman1: match.linesman1,
                        linesman2: match.linesman2
                    });
                } else {
                    setError('Match not found');
                }
            } catch (err) {
                setError('Failed to load match details');
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();
    }, [id]);

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

            const result = await matchAPI.update(id, matchData);

            if (result.success) {
                navigate(`/matches/${id}`);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Failed to update match');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner message="Loading match details..." />;

    return (
        <div className="edit-match-page">
            <div className="container">
                <div className="form-card glass-card">
                    <h1 className="text-gradient mb-xl">Edit Match Details</h1>

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
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate(`/matches/${id}`)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditMatch;
