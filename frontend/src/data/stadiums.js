export const stadiums = [
    {
        id: 1,
        name: 'Cairo International Stadium',
        city: 'Cairo',
        capacity: 74100,
        vipRows: 15,
        vipSeatsPerRow: 20
    },
    {
        id: 2,
        name: 'Borg El Arab Stadium',
        city: 'Alexandria',
        capacity: 86000,
        vipRows: 18,
        vipSeatsPerRow: 22
    },
    {
        id: 3,
        name: 'Al Salam Stadium',
        city: 'Cairo',
        capacity: 30000,
        vipRows: 10,
        vipSeatsPerRow: 15
    },
    {
        id: 4,
        name: 'Port Said Stadium',
        city: 'Port Said',
        capacity: 18000,
        vipRows: 8,
        vipSeatsPerRow: 12
    },
    {
        id: 5,
        name: 'Alexandria Stadium',
        city: 'Alexandria',
        capacity: 20000,
        vipRows: 10,
        vipSeatsPerRow: 16
    },
    {
        id: 6,
        name: 'Ismailia Stadium',
        city: 'Ismailia',
        capacity: 18525,
        vipRows: 8,
        vipSeatsPerRow: 14
    }
];

export const getStadiumById = (id) => {
    return stadiums.find(stadium => stadium.id === parseInt(id));
};
export const generateSeats = (vipRows, vipSeatsPerRow) => {
    const seats = [];
    for (let row = 1; row <= vipRows; row++) {
        for (let seatNum = 1; seatNum <= vipSeatsPerRow; seatNum++) {
            seats.push({
                row,
                seatNumber: seatNum,
                status: 'vacant', // vacant, reserved, selected
                reservedBy: null
            });
        }
    }
    return seats;
};
