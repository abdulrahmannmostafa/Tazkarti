import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { matchAPI, teamAPI, stadiumAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditMatch = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [teams, setTeams] = useState([]);
    const [stadiums, setStadiums] = useState([]);
    const [formData, setFormData] = useState({
        homeTeam: '',
        awayTeam: '',
        stadium: '',
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
                const [matchResult, teamsResult, stadiumsResult] = await Promise.all([
                    matchAPI.getById(id),
                    teamAPI.getAll(),
                    stadiumAPI.getAll()
                ]);

                if (teamsResult.success) {
                    setTeams(teamsResult.data);
                }
                if (stadiumsResult.success) {
                    setStadiums(stadiumsResult.data);
                }

                if (matchResult.success) {
                    const match = matchResult.data.match;
                    setFormData({
                        homeTeam: match.homeTeam,
                        awayTeam: match.awayTeam,
                        stadium: match.stadium?._id || match.stadium,
                        dateTime: match.dateTime ? new Date(match.dateTime).toISOString().slice(0, 16) : '',
                        mainReferee: match.mainReferee || '',
                        linesman1: match.linesmen?.[0] || '',
                        linesman2: match.linesmen?.[1] || ''
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

        fetchData();
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

        if (formData.homeTeam === formData.awayTeam) {
            setError('Home and Away teams cannot be the same');
            return;
        }

        setIsSubmitting(true);

        try {
            const matchData = {
                homeTeam: formData.homeTeam,
                awayTeam: formData.awayTeam,
                stadium: formData.stadium,
                dateTime: formData.dateTime,
                mainReferee: formData.mainReferee,
                linesmen: [formData.linesman1, formData.linesman2]
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
                                    name="homeTeam"
                                    className="form-select"
                                    value={formData.homeTeam}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Home Team</option>
                                    {teams.map(team => (
                                        <option key={team._id} value={team.name}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Away Team</label>
                                <select
                                    name="awayTeam"
                                    className="form-select"
                                    value={formData.awayTeam}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Away Team</option>
                                    {teams.map(team => (
                                        <option key={team._id} value={team.name}>
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
                                    name="stadium"
                                    className="form-select"
                                    value={formData.stadium}
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
