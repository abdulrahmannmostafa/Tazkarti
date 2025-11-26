import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { seatAPI, matchAPI } from '../../services/api';
import { useReservation } from '../../context/ReservationContext';
import SeatGrid from '../../components/seats/SeatGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getTeamById } from '../../data/teams';
import { getStadiumById } from '../../data/stadiums';
import './SeatSelection.css';

const SeatSelection = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const {
        selectedSeats,
        toggleSeat,
        clearSeats,
        setMatch,
        currentMatch,
        getTotalAmount
    } = useReservation();const pollInterval = useRef(null);

    useEffect(() => {        if (currentMatch && currentMatch.id !== parseInt(id)) {
            clearSeats();
        }

        const fetchData = async () => {
            setLoading(true);
            try {const matchResult = await matchAPI.getById(id);
                if (matchResult.success) {
                    setMatch(matchResult.data);
                } else {
                    setError('Match not found');
                    setLoading(false);
                    return;
                }const seatsResult = await seatAPI.getByMatch(id);
                if (seatsResult.success) {
                    setSeats(seatsResult.data);
                } else {
                    setError('Failed to load seats');
                }
            } catch (err) {
                setError('An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();        pollInterval.current = setInterval(async () => {
            try {
                const result = await seatAPI.getByMatch(id);
                if (result.success) {
                    setSeats(result.data);
                }
            } catch (err) {
                console.error('Polling error', err);
            }
        }, 3000);

        return () => {
            if (pollInterval.current) {
                clearInterval(pollInterval.current);
            }
        };
    }, [id]);

    const handleSeatToggle = (seat) => {
        toggleSeat(seat);
    };

    const handleProceed = () => {
        if (selectedSeats.length > 0) {
            navigate('/checkout');
        }
    };

    if (loading) return <LoadingSpinner message="Loading stadium map..." />;
    if (error) return <div className="container alert alert-error">{error}</div>;
    if (!currentMatch) return null;

    const homeTeam = getTeamById(currentMatch.homeTeamId);
    const awayTeam = getTeamById(currentMatch.awayTeamId);
    const stadium = getStadiumById(currentMatch.stadiumId);    const displaySeats = seats.map(seat => {
        const isSelected = selectedSeats.some(
            s => s.row === seat.row && s.seatNumber === seat.seatNumber
        );
        return isSelected ? { ...seat, status: 'selected' } : seat;
    });

    return (
        <div className="seat-selection-page">
            <div className="container">
                <div className="selection-header">
                    <div className="match-summary">
                        <h2>{homeTeam.name} vs {awayTeam.name}</h2>
                        <p>{stadium.name} • VIP Lounge</p>
                    </div>

                    <div className="selection-summary glass-card">
                        <div className="stat">
                            <span className="label">Selected</span>
                            <span className="value">{selectedSeats.length}</span>
                        </div>
                        <div className="stat">
                            <span className="label">Total</span>
                            <span className="value">{getTotalAmount()} EGP</span>
                        </div>
                        <button
                            className="btn btn-primary"
                            disabled={selectedSeats.length === 0}
                            onClick={handleProceed}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>

                <div className="stadium-container">
                    <SeatGrid seats={displaySeats} onSeatToggle={handleSeatToggle} />
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
