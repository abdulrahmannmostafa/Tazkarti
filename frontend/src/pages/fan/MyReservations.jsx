import React, { useState, useEffect } from 'react';
import { reservationAPI, matchAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getTeamById } from '../../data/teams';
import { getStadiumById } from '../../data/stadiums';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './MyReservations.css';

const MyReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [matches, setMatches] = useState({});
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [message, setMessage] = useState(null);

    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch reservations
                const resResult = await reservationAPI.getByUser(user.id);
                if (resResult.success) {
                    setReservations(resResult.data);

                    // Fetch related matches
                    const matchIds = [...new Set(resResult.data.map(r => r.matchId))];
                    const matchesData = {};

                    for (const id of matchIds) {
                        const matchResult = await matchAPI.getById(id);
                        if (matchResult.success) {
                            matchesData[id] = matchResult.data;
                        }
                    }
                    setMatches(matchesData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.id]);

    const handleCancel = async (reservationId) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

        setCancellingId(reservationId);
        setMessage(null);

        try {
            const result = await reservationAPI.cancel(reservationId);
            if (result.success) {
                setReservations(prev => prev.filter(r => r.id !== reservationId));
                setMessage({ type: 'success', text: 'Reservation cancelled successfully' });
            } else {
                setMessage({ type: 'error', text: result.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to cancel reservation' });
        } finally {
            setCancellingId(null);
        }
    };

    if (loading) return <LoadingSpinner message="Loading your reservations..." />;

    return (
        <div className="my-reservations-page">
            <div className="container">
                <h1 className="text-gradient mb-xl">My Reservations</h1>

                {message && (
                    <div className={`alert alert-${message.type}`}>
                        {message.text}
                    </div>
                )}

                {reservations.length === 0 ? (
                    <div className="no-reservations card">
                        <p>You haven't made any reservations yet.</p>
                    </div>
                ) : (
                    <div className="reservations-list">
                        {reservations.map(reservation => {
                            const match = matches[reservation.matchId];
                            if (!match) return null;

                            const homeTeam = getTeamById(match.homeTeamId);
                            const awayTeam = getTeamById(match.awayTeamId);
                            const stadium = getStadiumById(match.stadiumId);
                            const matchDate = new Date(match.dateTime);

                            // Check cancellation rule (3 days before)
                            const now = new Date();
                            const daysDiff = (matchDate - now) / (1000 * 60 * 60 * 24);
                            const canCancel = daysDiff >= 3;

                            return (
                                <div key={reservation.id} className="reservation-card glass-card">
                                    <div className="reservation-header">
                                        <span className="ticket-number">#{reservation.ticketNumber}</span>
                                        <span className="reservation-date">
                                            Booked on {new Date(reservation.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="reservation-body">
                                        <div className="match-details">
                                            <h3>{homeTeam.name} vs {awayTeam.name}</h3>
                                            <p>?? {matchDate.toLocaleDateString()} at {matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            <p>??? {stadium.name}</p>
                                        </div>

                                        <div className="seat-details">
                                            <h4>Seats ({reservation.seats.length})</h4>
                                            <div className="seat-tags">
                                                {reservation.seats.map((seat, idx) => (
                                                    <span key={idx} className="seat-tag">
                                                        R{seat.row}-S{seat.seatNumber}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="reservation-actions">
                                            {canCancel ? (
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleCancel(reservation.id)}
                                                    disabled={cancellingId === reservation.id}
                                                >
                                                    {cancellingId === reservation.id ? 'Cancelling...' : 'Cancel Reservation'}
                                                </button>
                                            ) : (
                                                <span className="text-muted text-sm" title="Cannot cancel less than 3 days before match">
                                                    Cancellation unavailable
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReservations;
