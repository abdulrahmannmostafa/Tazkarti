import React from 'react';
import Seat from './Seat';
import './SeatGrid.css';

const SeatGrid = ({ seats, onSeatToggle }) => {
    // Group seats by row
    const rows = seats.reduce((acc, seat) => {
        if (!acc[seat.row]) {
            acc[seat.row] = [];
        }
        acc[seat.row].push(seat);
        return acc;
    }, {});

    const rowNumbers = Object.keys(rows).sort((a, b) => parseInt(a) - parseInt(b));

    return (
        <div className="seat-grid-container">
            <div className="pitch-direction">
                <div className="pitch-line"></div>
                <span>PITCH / FIELD</span>
            </div>

            <div className="seat-grid">
                {rowNumbers.map(rowNum => (
                    <div key={rowNum} className="seat-row">
                        <div className="row-label">Row {rowNum}</div>
                        <div className="seats-in-row">
                            {rows[rowNum]
                                .sort((a, b) => a.seatNumber - b.seatNumber)
                                .map(seat => (
                                    <Seat
                                        key={`${seat.row}-${seat.seatNumber}`}
                                        seat={seat}
                                        onToggle={onSeatToggle}
                                    />
                                ))
                            }
                        </div>
                        <div className="row-label">Row {rowNum}</div>
                    </div>
                ))}
            </div>

            <div className="seat-legend">
                <div className="legend-item">
                    <div className="seat seat-vacant static"></div>
                    <span>Available</span>
                </div>
                <div className="legend-item">
                    <div className="seat seat-selected static"></div>
                    <span>Selected</span>
                </div>
                <div className="legend-item">
                    <div className="seat seat-reserved static"></div>
                    <span>Reserved</span>
                </div>
            </div>
        </div>
    );
};

export default SeatGrid;
