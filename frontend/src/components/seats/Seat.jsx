import React from 'react';
import './Seat.css';

const Seat = ({ seat, onToggle }) => {
    const { status, row, seatNumber } = seat;

    // Status: vacant, reserved, selected
    const getStatusClass = () => {
        switch (status) {
            case 'reserved': return 'seat-reserved';
            case 'selected': return 'seat-selected';
            default: return 'seat-vacant';
        }
    };

    const handleClick = () => {
        if (status !== 'reserved') {
            onToggle(seat);
        }
    };

    return (
        <div
            className={`seat ${getStatusClass()}`}
            onClick={handleClick}
            title={`Row ${row}, Seat ${seatNumber} - ${status}`}
        >
            <span className="seat-icon">💺</span>
            <span className="seat-number">{seatNumber}</span>
        </div>
    );
};

export default Seat;
