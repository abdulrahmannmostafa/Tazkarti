import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { seatAPI, matchAPI, reservationAPI } from '../../services/api';
import { useReservation } from '../../context/ReservationContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SeatGrid from '../../components/seats/SeatGrid';
import './SeatSelection.css';

const SeatSelection = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedSeats, setSelectedSeats, setMatchId } = useReservation();
    const { user } = useAuth();
    
    const [match, setMatch] = useState(null);
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reserving, setReserving] = useState(false);
    const [error, setError] = useState('');
    const [socket, setSocket] = useState(null);

    const fetchSeats = async () => {
        try {
            const seatResult = await seatAPI.getByMatch(id);
            if (seatResult.success) {
                const transformedSeats = seatResult.data.map(seat => ({
                    ...seat,
                    seatNumber: seat.number
                }));
                setSeats(transformedSeats);
            }
        } catch (err) {
            console.error('Failed to refresh seats:', err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            
            try {
                const [matchResult, seatResult] = await Promise.all([
                    matchAPI.getById(id),
                    seatAPI.getByMatch(id)
                ]);

                if (matchResult.success) {
                    setMatch(matchResult.data.match);
                }
                if (seatResult.success) {
                    const transformedSeats = seatResult.data.map(seat => ({
                        ...seat,
                        seatNumber: seat.number
                    }));
                    setSeats(transformedSeats);
                }
            } catch (err) {
                setError('Failed to load seat information');
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);
        newSocket.emit('joinMatch', id);

        newSocket.on('seatReserved', ({ seats: reservedSeats }) => {
            setSeats(prevSeats => 
                prevSeats.map(seat => {
                    const isReserved = reservedSeats.some(
                        rs => rs.row === seat.row && rs.seatNumber === seat.seatNumber
                    );
                    return isReserved ? { ...seat, status: 'reserved' } : seat;
                })
            );

            setSelectedSeats(prevSelected => 
                prevSelected.filter(selected => 
                    !reservedSeats.some(
                        rs => rs.row === selected.row && rs.seatNumber === selected.seatNumber
                    )
                )
            );
        });

        newSocket.on('seatCancelled', ({ seats: cancelledSeats }) => {
            setSeats(prevSeats => 
                prevSeats.map(seat => {
                    const isCancelled = cancelledSeats.some(
                        cs => cs.row === seat.row && cs.seatNumber === seat.seatNumber
                    );
                    return isCancelled ? { ...seat, status: 'vacant' } : seat;
                })
            );
        });

        return () => {
            newSocket.emit('leaveMatch', id);
            newSocket.disconnect();
        };
    }, [id]);

    const handleSeatToggle = (seat) => {
        if (seat.status === 'reserved') return;

        setSelectedSeats(prev => {
            const isSelected = prev.some(s => s.id === seat.id);
            if (isSelected) {
                return prev.filter(s => s.id !== seat.id);
            } else {
                return [...prev, { id: seat.id, row: seat.row, seatNumber: seat.seatNumber }];
            }
        });
    };

    const handleReserve = async () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }

        // Refresh seat data before reserving to ensure we have latest status
        await fetchSeats();
        const stillAvailable = selectedSeats.every(selected => {
            const seat = seats.find(s => s.row === selected.row && s.seatNumber === selected.seatNumber);
            return seat && seat.status === 'vacant';
        });

        if (!stillAvailable) {
            setError('Some of your selected seats are no longer available. Please refresh and try again.');
            fetchSeats();
            return;
        }

        setReserving(true);
        setError('');

        try {
            const reservationData = {
                matchId: id,
                seats: selectedSeats.map(s => ({
                    row: s.row,
                    seatNumber: s.seatNumber
                })),
                creditCardNumber: '1234567890123456',
                creditCardPin: '1234'
            };

            const result = await reservationAPI.create(reservationData);

            if (result.success) {
                alert('Seats reserved successfully! Ticket Number: ' + result.data.ticketNumber);
                setSelectedSeats([]);
                navigate('/fan/reservations');
            } else {
                if (result.error && result.error.includes('already reserved')) {
                    setError('One or more seats were just reserved by another user. Refreshing...');
                    fetchSeats();
                    setSelectedSeats([]);
                } else {
                    setError(result.error || 'Failed to reserve seats');
                }
            }
        } catch (err) {
            setError('Failed to reserve seats. The seats may have been taken by another user.');
            fetchSeats();
        } finally {
            setReserving(false);
        }
    };

    if (loading) return <LoadingSpinner message="Loading seats..." />;
    if (error && !match) return <div className="container alert alert-error">{error}</div>;
    if (!match) return <div className="container">Match not found</div>;

    const displaySeats = seats.map(seat => ({
        ...seat,
        status: selectedSeats.some(s => s.id === seat.id) ? 'selected' : seat.status
    }));

    const selectedCount = selectedSeats.length;
    const totalPrice = selectedCount * 150;

    return (
        <div className="seat-selection-page">
            <div className="container">
                <div className="match-header-info">
                    <h1>{match.homeTeam} vs {match.awayTeam}</h1>
                    <p>{new Date(match.dateTime).toLocaleDateString()} - {match.stadium?.name}</p>
                    <div className="live-indicator">
                        <span className="live-dot"></span>
                        <span>Live Updates</span>
                    </div>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <div className="selection-info glass-card">
                    <div className="selection-stats">
                        <div className="stat">
                            <span className="stat-label">Selected:</span>
                            <span className="stat-value">{selectedCount}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Total:</span>
                            <span className="stat-value">{totalPrice} EGP</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleReserve}
                        className="btn btn-primary"
                        disabled={selectedCount === 0 || reserving}
                    >
                        {reserving ? 'Reserving...' : `Reserve ${selectedCount} Seat${selectedCount !== 1 ? 's' : ''}`}
                    </button>
                </div>

                <SeatGrid seats={displaySeats} onSeatToggle={handleSeatToggle} />
            </div>
        </div>
    );
};

export default SeatSelection;
