import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { matchAPI } from '../services/api';
import { getTeamById } from '../data/teams';
import { getStadiumById } from '../data/stadiums';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './MatchDetail.css';

const MatchDetail = () => {
    const { id } = useParams();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isFan, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMatch = async () => {
            setLoading(true);
            try {
                const result = await matchAPI.getById(id);
                if (result.success) {
                    setMatch(result.data);
                } else {
                    setError(result.error);
                }
            } catch (error) {
                setError('Failed to load match details');
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();
    }, [id]);

    if (loading) return <LoadingSpinner message="Loading match details..." />;
    if (error) return <div className="container alert alert-error">{error}</div>;
    if (!match) return <div className="container alert alert-warning">Match not found</div>;

    const homeTeam = getTeamById(match.homeTeamId);
    const awayTeam = getTeamById(match.awayTeamId);
    const stadium = getStadiumById(match.stadiumId);

    const matchDate = new Date(match.dateTime);
    const isUpcoming = matchDate > new Date();

    return (
        <div className="match-detail-page">
            <div className="container">
                <div className="match-hero glass-card">
                    <div className="match-hero-content">
                        <div className="team-large home">
                            <div className="team-logo-large">{homeTeam.logo}</div>
                            <h2>{homeTeam.name}</h2>
                        </div>

                        <div className="match-center">
                            <div className="match-time">
                                <span className="date">{matchDate.toLocaleDateString()}</span>
                                <span className="time">{matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="vs-large">VS</div>
                            <div className="stadium-name">
                                ??? {stadium.name}
                            </div>
                        </div>

                        <div className="team-large away">
                            <div className="team-logo-large">{awayTeam.logo}</div>
                            <h2>{awayTeam.name}</h2>
                        </div>
                    </div>
                </div>

                <div className="match-details-grid">
                    <div className="details-card card">
                        <h3>Match Information</h3>
                        <ul className="info-list">
                            <li>
                                <span className="label">Competition</span>
                                <span className="value">Egyptian Premier League</span>
                            </li>
                            <li>
                                <span className="label">Venue</span>
                                <span className="value">{stadium.name}, {stadium.city}</span>
                            </li>
                            <li>
                                <span className="label">Main Referee</span>
                                <span className="value">{match.mainReferee}</span>
                            </li>
                            <li>
                                <span className="label">Linesmen</span>
                                <span className="value">{match.linesman1}, {match.linesman2}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="booking-card card">
                        <h3>Ticket Reservation</h3>
                        {isUpcoming ? (
                            <div className="booking-action">
                                <p className="price-tag">
                                    <span className="amount">250 EGP</span>
                                    <span className="per-ticket">/ ticket</span>
                                </p>
                                <p className="booking-note">
                                    VIP Lounge Access included. Select your preferred seat.
                                </p>

                                {isAuthenticated ? (
                                    isFan ? (
                                        <Link to={`/matches/${match.id}/seats`} className="btn btn-primary btn-lg btn-block">
                                            Select Seats
                                        </Link>
                                    ) : (
                                        <div className="alert alert-info">
                                            Only registered fans can book tickets. You are logged in as {user?.role}.
                                        </div>
                                    )
                                ) : (
                                    <div className="login-prompt">
                                        <p>Please login to book tickets</p>
                                        <div className="auth-buttons">
                                            <Link to="/login" className="btn btn-primary">Login</Link>
                                            <Link to="/register" className="btn btn-outline">Register</Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="alert alert-warning">
                                This match has already ended. Tickets are no longer available.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchDetail;
