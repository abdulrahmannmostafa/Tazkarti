import React, { useState, useEffect } from 'react';
import { reservationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './MyReservations.css';

const MyReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [message, setMessage] = useState(null);

    const { user } = useAuth();

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            try {
                const result = await reservationAPI.getMyReservations();
                if (result.success) {
                    setReservations(result.data);
                }
            } catch (error) {
                console.error('Error fetching reservations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const handleCancel = async (reservationId) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

        setCancellingId(reservationId);
        setMessage(null);

        try {
            const result = await reservationAPI.cancel(reservationId);
            if (result.success) {
                setReservations(prev => prev.filter(r => r._id !== reservationId));
                setMessage({ type: 'success', text: 'Reservation cancelled successfully' });
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to cancel' });
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
                        <p>You haven not made any reservations yet.</p>
                    </div>
                ) : (
                    <div className="reservations-list">
                        {reservations.map(reservation => {
                            const match = reservation.match;
                            if (!match) return null;

                            const matchDate = new Date(match.dateTime);
                            const now = new Date();
                            const daysDiff = (matchDate - now) / (1000 * 60 * 60 * 24);
                            const canCancel = daysDiff >= 3 && reservation.status === 'confirmed';

                            return (
                                <div key={reservation._id} className="reservation-card glass-card">
                                    <div className="reservation-header">
                                        <span className="ticket-number">#{reservation.ticketNumber}</span>
                                        <span className={`badge badge-${reservation.status === 'confirmed' ? 'success' : 'secondary'}`}>
                                            {reservation.status}
                                        </span>
                                    </div>

                                    <div className="reservation-body">
                                        <div className="match-details">
                                            <h3>{match.homeTeam} vs {match.awayTeam}</h3>
                                            <p> {matchDate.toLocaleDateString()} at {matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            <p> {match.stadium?.name || 'Unknown Stadium'}</p>
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
                                                    onClick={() => handleCancel(reservation._id)}
                                                    disabled={cancellingId === reservation._id}
                                                >
                                                    {cancellingId === reservation._id ? 'Cancelling...' : 'Cancel Reservation'}
                                                </button>
                                            ) : (
                                                <span className="text-muted text-sm">
                                                    {reservation.status === 'cancelled' ? 'Cancelled' : 'Cancellation unavailable'}
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
