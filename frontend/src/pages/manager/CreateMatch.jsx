import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchAPI, teamAPI, stadiumAPI } from '../../services/api';
import './CreateMatch.css';

const CreateMatch = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [stadiums, setStadiums] = useState([]);
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
        const fetchData = async () => {
            try {
                const [teamsResult, stadiumsResult] = await Promise.all([
                    teamAPI.getAll(),
                    stadiumAPI.getAll()
                ]);

                if (teamsResult.success) {
                    setTeams(teamsResult.data);
                }
                if (stadiumsResult.success) {
                    setStadiums(stadiumsResult.data);
                }
            } catch (err) {
                setError('Failed to load teams and stadiums');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
            const homeTeam = teams.find(t => t._id === formData.homeTeamId);
            const awayTeam = teams.find(t => t._id === formData.awayTeamId);

            if (!homeTeam || !awayTeam) {
                setError('Invalid team selection');
                setIsSubmitting(false);
                return;
            }

            const matchData = {
                homeTeam: homeTeam.name,  // Send team name, not ID
                awayTeam: awayTeam.name,  // Send team name, not ID
                stadium: formData.stadiumId,  // Send stadium ID (backend will populate)
                dateTime: formData.dateTime,
                mainReferee: formData.mainReferee,
                linesmen: [formData.linesman1, formData.linesman2]
            };

            const result = await matchAPI.create(matchData);

            if (result.success) {
                navigate('/matches');
            } else {
                setError(result.error || 'Failed to create match');
            }
        } catch (err) {
            setError('Failed to create match');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="create-match-page">
                <div className="container">
                    <div className="loading">Loading teams and stadiums...</div>
                </div>
            </div>
        );
    }

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
                                        <option key={team._id} value={team._id}>
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
                                        <option key={team._id} value={team._id}>
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
                                        <option key={stadium._id} value={stadium._id}>
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
