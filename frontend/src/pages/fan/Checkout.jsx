import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../../context/ReservationContext';
import { useAuth } from '../../context/AuthContext';
import { reservationAPI } from '../../services/api';
import { getTeamById } from '../../data/teams';
import { getStadiumById } from '../../data/stadiums';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { selectedSeats, currentMatch, getTotalAmount, clearSeats } = useReservation();
    const { user } = useAuth();

    const [creditCard, setCreditCard] = useState('');
    const [pin, setPin] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    if (!currentMatch || selectedSeats.length === 0) {
        navigate('/matches');
        return null;
    }

    const homeTeam = getTeamById(currentMatch.homeTeamId);
    const awayTeam = getTeamById(currentMatch.awayTeamId);
    const stadium = getStadiumById(currentMatch.stadiumId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsProcessing(true);

        if (creditCard.length < 16 || pin.length < 4) {
            setError('Please enter valid payment details');
            setIsProcessing(false);
            return;
        }

        try {
            const result = await reservationAPI.create({
                userId: user.id,
                matchId: currentMatch.id,
                seats: selectedSeats,
                creditCard
            });

            if (result.success) {
                clearSeats();
                navigate('/confirmation', { state: { reservation: result.data } });
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Transaction failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="text-gradient mb-xl">Checkout</h1>

                <div className="checkout-grid">
                    <div className="order-summary card">
                        <h3>Order Summary</h3>

                        <div className="match-info-mini">
                            <h4>{homeTeam.name} vs {awayTeam.name}</h4>
                            <p>{stadium.name}</p>
                            <p>{new Date(currentMatch.dateTime).toLocaleString()}</p>
                        </div>

                        <div className="seats-list">
                            <h4>Selected Seats ({selectedSeats.length})</h4>
                            {selectedSeats.map((seat, index) => (
                                <div key={index} className="seat-item">
                                    <span>Row {seat.row}, Seat {seat.seatNumber}</span>
                                    <span>250 EGP</span>
                                </div>
                            ))}
                        </div>

                        <div className="total-section">
                            <span>Total Amount</span>
                            <span className="total-price">{getTotalAmount()} EGP</span>
                        </div>
                    </div>

                    <div className="payment-form glass-card">
                        <h3>Payment Details</h3>
                        {error && <div className="alert alert-error">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Cardholder Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={`${user.firstName} ${user.lastName}`}
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="creditCard" className="form-label">Credit Card Number</label>
                                <input
                                    type="text"
                                    id="creditCard"
                                    className="form-input"
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    value={creditCard}
                                    onChange={(e) => setCreditCard(e.target.value.replace(/\D/g, '').slice(0, 16))}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="expiry" className="form-label">Expiry Date</label>
                                    <input type="text" className="form-input" placeholder="MM/YY" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="pin" className="form-label">PIN / CVV</label>
                                    <input
                                        type="password"
                                        id="pin"
                                        className="form-input"
                                        placeholder="***"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg btn-block"
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Processing Payment...' : `Pay ${getTotalAmount()} EGP`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
