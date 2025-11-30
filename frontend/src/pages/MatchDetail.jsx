import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { matchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './MatchDetail.css';

const MatchDetail = () => {
    const { id } = useParams();
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);
    const { isFan, isManager, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMatch = async () => {
            setLoading(true);
            try {
                const result = await matchAPI.getById(id);
                if (result.success) {
                    setMatchData(result.data);
                } else {
                    setError(result.error || 'Failed to load match');
                }
            } catch (error) {
                setError('Failed to load match details');
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this match? All reservations will be cancelled.')) {
            return;
        }

        setDeleting(true);
        try {
            const result = await matchAPI.delete(id);
            if (result.success) {
                alert('Match deleted successfully');
                navigate('/matches');
            } else {
                alert('Failed to delete match: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            alert('Failed to delete match');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <LoadingSpinner message="Loading match details..." />;
    if (error) return <div className="container alert alert-error">{error}</div>;
    if (!matchData || !matchData.match) return <div className="container alert alert-warning">Match not found</div>;

    const match = matchData.match;
    const stadium = match.stadium || {};
    const matchDate = new Date(match.dateTime);
    const isUpcoming = matchDate > new Date();

    return (
        <div className="match-detail-page">
            <div className="container">
                {/* Manager Controls */}
                {isManager && (
                    <div className="manager-controls" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                        <Link
                            to={`/manager/matches/${id}/edit`}
                            className="btn btn-warning"
                        >
                            ✏️ Edit Match
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="btn btn-danger"
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : '🗑️ Delete Match'}
                        </button>
                    </div>
                )}

                <div className="match-hero glass-card">
                    <div className="match-hero-content">
                        <div className="team-large home">
                            <div className="team-logo-large">⚽</div>
                            <h2>{match.homeTeam || 'Unknown Team'}</h2>
                        </div>

                        <div className="match-center">
                            <div className="match-time">
                                <span className="date">{matchDate.toLocaleDateString()}</span>
                                <span className="time">{matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="vs-large">VS</div>
                            <div className="stadium-name">
                                🏟️ {stadium.name || 'Unknown Stadium'}
                            </div>
                        </div>

                        <div className="team-large away">
                            <div className="team-logo-large">⚽</div>
                            <h2>{match.awayTeam || 'Unknown Team'}</h2>
                        </div>
                    </div>
                </div>

                <div className="match-details-grid">
                    <div className="details-card card">
                        <h3>Match Information</h3>
                        <ul className="info-list">
                            <li>
                                <strong>Status:</strong>
                                <span className={`badge ${isUpcoming ? 'badge-success' : 'badge-secondary'}`}>
                                    {isUpcoming ? 'Upcoming' : 'Completed'}
                                </span>
                            </li>
                            <li>
                                <strong>Venue:</strong> {stadium.name || 'Unknown Stadium'}
                            </li>
                            <li>
                                <strong>Location:</strong> {stadium.city || 'Unknown City'}
                            </li>
                            <li>
                                <strong>Date:</strong> {matchDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </li>
                            <li>
                                <strong>Kick-off:</strong> {matchDate.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </li>
                        </ul>
                    </div>

                    <div className="details-card card">
                        <h3>Match Officials</h3>
                        <ul className="info-list">
                            <li>
                                <strong>Main Referee:</strong> {match.mainReferee || 'TBA'}
                            </li>
                            {match.linesmen && match.linesmen.length > 0 && (
                                <>
                                    <li>
                                        <strong>Linesman 1:</strong> {match.linesmen[0] || 'TBA'}
                                    </li>
                                    <li>
                                        <strong>Linesman 2:</strong> {match.linesmen[1] || 'TBA'}
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {matchData.totalSeats && (
                        <div className="details-card card">
                            <h3>Seat Availability</h3>
                            <ul className="info-list">
                                <li>
                                    <strong>Total VIP Seats:</strong> {matchData.totalSeats}
                                </li>
                                <li>
                                    <strong>Available:</strong> {matchData.availableSeats}
                                </li>
                                <li>
                                    <strong>Reserved:</strong> {matchData.totalSeats - matchData.availableSeats}
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="match-actions">
                    {isFan && isAuthenticated && isUpcoming && (
                        <Link
                            to={`/matches/${id}/seats`}
                            className="btn btn-primary btn-lg"
                        >
                            Select Seats
                        </Link>
                    )}
                    <Link to="/matches" className="btn btn-secondary btn-lg">
                        Back to Matches
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MatchDetail;
