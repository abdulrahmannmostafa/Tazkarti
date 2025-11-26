import { matches, getMatchById, getUpcomingMatches } from '../data/matches';
import { teams, getTeamById } from '../data/teams';
import { stadiums, getStadiumById, generateSeats } from '../data/stadiums';
import { users, validateCredentials, getPendingUsers, findUserByUsername } from '../data/users';
import { reservations, getReservationsByUser, getReservedSeatsForMatch, generateTicketNumber } from '../data/reservations';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
let matchesDB = [...matches];
let usersDB = [...users];
let stadiumsDB = [...stadiums];
let reservationsDB = [...reservations];
let seatsDB = {}; // matchId -> seats array
matchesDB.forEach(match => {
    const stadium = getStadiumById(match.stadiumId);
    const seats = generateSeats(stadium.vipRows, stadium.vipSeatsPerRow);
    const reservedSeats = getReservedSeatsForMatch(match.id);
    reservedSeats.forEach(reserved => {
        const seat = seats.find(s => s.row === reserved.row && s.seatNumber === reserved.seatNumber);
        if (seat) {
            seat.status = 'reserved';
            seat.reservedBy = reserved.reservedBy;
        }
    });

    seatsDB[match.id] = seats;
});
export const authAPI = {
    login: async (username, password) => {
        await delay(800);
        const user = validateCredentials(username, password);

        if (user) {
            if (!user.approved) {
                return {
                    success: false,
                    error: 'Your account is pending approval by an administrator'
                };
            }

            const token = btoa(JSON.stringify({ userId: user.id, username: user.username }));
            return { success: true, data: { user, token } };
        }

        return { success: false, error: 'Invalid username or password' };
    },

    register: async (userData) => {
        await delay(1000);
        if (findUserByUsername(userData.username)) {
            return { success: false, error: 'Username already exists' };
        }

        const newUser = {
            id: usersDB.length + 1,
            ...userData,
            approved: userData.role === 'fan' // Fans auto-approved, managers need approval
        };

        usersDB.push(newUser);

        if (newUser.approved) {
            const { password, ...userWithoutPassword } = newUser;
            const token = btoa(JSON.stringify({ userId: newUser.id, username: newUser.username }));
            return { success: true, data: { user: userWithoutPassword, token } };
        } else {
            return {
                success: true,
                data: {
                    message: 'Registration successful. Your account is pending admin approval.',
                    requiresApproval: true
                }
            };
        }
    }
};
export const matchAPI = {
    getAll: async () => {
        await delay(400);
        return { success: true, data: matchesDB };
    },

    getById: async (id) => {
        await delay(300);
        const match = matchesDB.find(m => m.id === parseInt(id));
        if (match) {
            return { success: true, data: match };
        }
        return { success: false, error: 'Match not found' };
    },

    getUpcoming: async () => {
        await delay(400);
        const now = new Date();
        const upcoming = matchesDB.filter(match => {
            const matchDate = new Date(match.dateTime);
            return matchDate > now && match.status === 'scheduled';
        }).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
        return { success: true, data: upcoming };
    },

    create: async (matchData) => {
        await delay(600);
        const newMatch = {
            id: matchesDB.length + 1,
            ...matchData,
            status: 'scheduled'
        };
        matchesDB.push(newMatch);
        const stadium = getStadiumById(newMatch.stadiumId);
        seatsDB[newMatch.id] = generateSeats(stadium.vipRows, stadium.vipSeatsPerRow);

        return { success: true, data: newMatch };
    },

    update: async (id, matchData) => {
        await delay(600);
        const index = matchesDB.findIndex(m => m.id === parseInt(id));
        if (index !== -1) {
            matchesDB[index] = { ...matchesDB[index], ...matchData };
            return { success: true, data: matchesDB[index] };
        }
        return { success: false, error: 'Match not found' };
    }
};
export const stadiumAPI = {
    getAll: async () => {
        await delay(300);
        return { success: true, data: stadiumsDB };
    },

    create: async (stadiumData) => {
        await delay(600);
        const newStadium = {
            id: stadiumsDB.length + 1,
            ...stadiumData
        };
        stadiumsDB.push(newStadium);
        return { success: true, data: newStadium };
    }
};
export const seatAPI = {
    getByMatch: async (matchId) => {
        await delay(400);
        const seats = seatsDB[matchId];
        if (seats) {
            return { success: true, data: seats };
        }
        return { success: false, error: 'Seats not found' };
    }
};
export const reservationAPI = {
    create: async (reservationData) => {
        await delay(800);

        const { matchId, seats: selectedSeats, userId, creditCard } = reservationData;
        const matchSeats = seatsDB[matchId];
        for (const selectedSeat of selectedSeats) {
            const seat = matchSeats.find(s =>
                s.row === selectedSeat.row && s.seatNumber === selectedSeat.seatNumber
            );

            if (!seat || seat.status === 'reserved') {
                return {
                    success: false,
                    error: 'One or more seats are no longer available. Please refresh and try again.'
                };
            }
        }
        selectedSeats.forEach(selectedSeat => {
            const seat = matchSeats.find(s =>
                s.row === selectedSeat.row && s.seatNumber === selectedSeat.seatNumber
            );
            seat.status = 'reserved';
            seat.reservedBy = userId;
        });
        const newReservation = {
            id: reservationsDB.length + 1,
            userId,
            matchId,
            seats: selectedSeats,
            ticketNumber: generateTicketNumber(),
            creditCardLast4: creditCard.slice(-4),
            totalAmount: selectedSeats.length * 250, // 250 per seat
            createdAt: new Date().toISOString(),
            status: 'confirmed'
        };

        reservationsDB.push(newReservation);

        return { success: true, data: newReservation };
    },

    getByUser: async (userId) => {
        await delay(400);
        const userReservations = reservationsDB.filter(r => r.userId === userId && r.status === 'confirmed');
        return { success: true, data: userReservations };
    },

    cancel: async (reservationId) => {
        await delay(600);

        const reservation = reservationsDB.find(r => r.id === parseInt(reservationId));
        if (!reservation) {
            return { success: false, error: 'Reservation not found' };
        }
        const match = matchesDB.find(m => m.id === reservation.matchId);
        const matchDate = new Date(match.dateTime);
        const now = new Date();
        const daysDifference = (matchDate - now) / (1000 * 60 * 60 * 24);

        if (daysDifference < 3) {
            return {
                success: false,
                error: 'Cannot cancel reservation less than 3 days before the match'
            };
        }
        reservation.status = 'cancelled';
        const matchSeats = seatsDB[reservation.matchId];
        reservation.seats.forEach(seat => {
            const s = matchSeats.find(ms => ms.row === seat.row && ms.seatNumber === seat.seatNumber);
            if (s) {
                s.status = 'vacant';
                s.reservedBy = null;
            }
        });

        return { success: true, data: { message: 'Reservation cancelled successfully' } };
    }
};
export const adminAPI = {
    getPendingUsers: async () => {
        await delay(400);
        const pending = usersDB.filter(u => !u.approved);
        return { success: true, data: pending };
    },

    approveUser: async (userId) => {
        await delay(600);
        const user = usersDB.find(u => u.id === parseInt(userId));
        if (user) {
            user.approved = true;
            const { password, ...userWithoutPassword } = user;
            return { success: true, data: userWithoutPassword };
        }
        return { success: false, error: 'User not found' };
    },

    removeUser: async (userId) => {
        await delay(600);
        const index = usersDB.findIndex(u => u.id === parseInt(userId));
        if (index !== -1) {
            usersDB.splice(index, 1);
            return { success: true, data: { message: 'User removed successfully' } };
        }
        return { success: false, error: 'User not found' };
    }
};
export const userAPI = {
    updateProfile: async (userId, userData) => {
        await delay(600);
        const user = usersDB.find(u => u.id === parseInt(userId));
        if (user) {
            const { username, email, ...allowedUpdates } = userData;
            Object.assign(user, allowedUpdates);
            const { password, ...userWithoutPassword } = user;
            return { success: true, data: userWithoutPassword };
        }
        return { success: false, error: 'User not found' };
    }
};
export const teamAPI = {
    getAll: async () => {
        await delay(300);
        return { success: true, data: teams };
    }
};
