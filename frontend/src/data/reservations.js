// Mock reservation data
export const reservations = [
    {
        id: 1,
        userId: 3, // fan1
        matchId: 1,
        seats: [
            { row: 5, seatNumber: 10 },
            { row: 5, seatNumber: 11 }
        ],
        ticketNumber: 'TKT-1638456789-001',
        creditCardLast4: '1234',
        totalAmount: 500,
        createdAt: '2025-11-20T10:30:00',
        status: 'confirmed' // confirmed, cancelled
    },
    {
        id: 2,
        userId: 4, // fan2
        matchId: 2,
        seats: [
            { row: 3, seatNumber: 5 }
        ],
        ticketNumber: 'TKT-1638556789-002',
        creditCardLast4: '5678',
        totalAmount: 250,
        createdAt: '2025-11-21T14:20:00',
        status: 'confirmed'
    }
];

export const getReservationsByUser = (userId) => {
    return reservations.filter(res => res.userId === userId && res.status === 'confirmed');
};

export const getReservationsByMatch = (matchId) => {
    return reservations.filter(res => res.matchId === matchId && res.status === 'confirmed');
};

export const getReservedSeatsForMatch = (matchId) => {
    const matchReservations = getReservationsByMatch(matchId);
    const reservedSeats = [];

    matchReservations.forEach(reservation => {
        reservation.seats.forEach(seat => {
            reservedSeats.push({
                ...seat,
                reservedBy: reservation.userId
            });
        });
    });

    return reservedSeats;
};

export const generateTicketNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TKT-${timestamp}-${random}`;
};
