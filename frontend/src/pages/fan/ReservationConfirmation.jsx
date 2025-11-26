import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { getTeamById } from '../../data/teams';
import { getStadiumById } from '../../data/stadiums';
import { getMatchById } from '../../data/matches';
import './ReservationConfirmation.css';

const ReservationConfirmation = () => {
    const location = useLocation();
    const reservation = location.state?.reservation;

    if (!reservation) {
        return <Navigate to="/" replace />;
    }

    const match = getMatchById(reservation.matchId);
    const homeTeam = getTeamById(match.homeTeamId);
    const awayTeam = getTeamById(match.awayTeamId);
    const stadium = getStadiumById(match.stadiumId);

    return (
        <div className="confirmation-page">
            <div className="container">
                <div className="confirmation-card glass-card">
                    <div className="success-icon">?</div>
                    <h1 className="text-gradient">Reservation Confirmed!</h1>
                    <p className="confirmation-message">
                        Your tickets have been successfully booked. A confirmation email has been sent to you.
                    </p>

                    <div className="ticket-details">
                        <div className="ticket-header">
                            <div className="ticket-number">
                                <span>Ticket Number</span>
                                <strong>{reservation.ticketNumber}</strong>
                            </div>
                            <div className="ticket-status badge badge-success">
                                Confirmed
                            </div>
                        </div>

                        <div className="match-info-row">
                            <div className="match-teams-mini">
                                <span className="team-name">{homeTeam.name}</span>
                                <span className="vs">VS</span>
                                <span className="team-name">{awayTeam.name}</span>
                            </div>
                            <div className="match-meta">
                                <p>?? {new Date(match.dateTime).toLocaleDateString()}</p>
                                <p>? {new Date(match.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <p>??? {stadium.name}</p>
                            </div>
                        </div>

                        <div className="seats-summary">
                            <h4>Reserved Seats</h4>
                            <div className="seats-tags">
                                {reservation.seats.map((seat, idx) => (
                                    <span key={idx} className="seat-tag">
                                        Row {seat.row}, Seat {seat.seatNumber}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="payment-summary">
                            <span>Total Paid:</span>
                            <span className="amount">{reservation.totalAmount} EGP</span>
                        </div>
                    </div>

                    <div className="actions">
                        <Link to="/my-reservations" className="btn btn-primary">
                            View My Reservations
                        </Link>
                        <Link to="/" className="btn btn-outline">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationConfirmation;
