import React, { createContext, useContext, useState } from 'react';

const ReservationContext = createContext();

export const useReservation = () => {
    const context = useContext(ReservationContext);
    if (!context) {
        throw new Error('useReservation must be used within a ReservationProvider');
    }
    return context;
};

export const ReservationProvider = ({ children }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [currentMatch, setCurrentMatch] = useState(null);
    const [matchId, setMatchId] = useState(null);

    const addSeat = (seat) => {
        setSelectedSeats(prev => {
            const exists = prev.find(s => s.row === seat.row && s.seatNumber === seat.seatNumber);
            if (exists) return prev;
            return [...prev, seat];
        });
    };

    const removeSeat = (seat) => {
        setSelectedSeats(prev =>
            prev.filter(s => !(s.row === seat.row && s.seatNumber === seat.seatNumber))
        );
    };

    const toggleSeat = (seat) => {
        const exists = selectedSeats.find(s => s.row === seat.row && s.seatNumber === seat.seatNumber);
        if (exists) {
            removeSeat(seat);
        } else {
            addSeat(seat);
        }
    };

    const clearSeats = () => {
        setSelectedSeats([]);
    };

    const setMatch = (match) => {
        setCurrentMatch(match);
    };

    const getTotalAmount = () => {
        return selectedSeats.length * 150; // 150 EGP per seat
    };

    const value = {
        selectedSeats,
        setSelectedSeats, // Direct setter for easier use
        currentMatch,
        matchId,
        setMatchId,
        addSeat,
        removeSeat,
        toggleSeat,
        clearSeats,
        setMatch,
        getTotalAmount,
        seatCount: selectedSeats.length
    };

    return (
        <ReservationContext.Provider value={value}>
            {children}
        </ReservationContext.Provider>
    );
};
