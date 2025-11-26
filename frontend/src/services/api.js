// ==========================================
// api.js - Updated to use real backend
// ==========================================

import axios from 'axios';


// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==========================================
// AUTH API
// ==========================================
export const authAPI = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      
      // Save token and user to localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return { 
        success: true, 
        data: { 
          user: response.data.user, 
          token: response.data.token 
        } 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', {
        username: userData.username,
        password: userData.password,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        birthDate: userData.birthDate,
        gender: userData.gender,
        city: userData.city,
        address: userData.address,
        role: userData.role
      });

      // Check if user needs approval
      const requiresApproval = userData.role === 'manager' && !response.data.user.isApproved;

      if (requiresApproval) {
        return {
          success: true,
          data: {
            message: response.data.message || 'Registration successful. Your account is pending admin approval.',
            requiresApproval: true
          }
        };
      }

      // Auto-approved (fan) - save token if provided
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return { 
        success: true, 
        data: { 
          user: response.data.user,
          token: response.data.token 
        } 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  }
};

// ==========================================
// MATCH API
// ==========================================
export const matchAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/matches');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch matches' 
      };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/matches/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Match not found' 
      };
    }
  },

  getUpcoming: async () => {
    try {
      const response = await api.get('/matches');
      const now = new Date();
      const upcoming = response.data
        .filter(match => new Date(match.dateTime) > now)
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
      return { success: true, data: upcoming };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch matches' 
      };
    }
  },

  create: async (matchData) => {
    try {
      const response = await api.post('/matches', {
        homeTeam: matchData.homeTeam,
        awayTeam: matchData.awayTeam,
        stadium: matchData.stadiumId, // Backend expects 'stadium' not 'stadiumId'
        dateTime: matchData.dateTime,
        mainReferee: matchData.mainReferee,
        linesmen: matchData.linesmen
      });
      return { success: true, data: response.data.match };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create match' 
      };
    }
  },

  update: async (id, matchData) => {
    try {
      const updatePayload = {};
      if (matchData.homeTeam) updatePayload.homeTeam = matchData.homeTeam;
      if (matchData.awayTeam) updatePayload.awayTeam = matchData.awayTeam;
      if (matchData.stadiumId) updatePayload.stadium = matchData.stadiumId;
      if (matchData.dateTime) updatePayload.dateTime = matchData.dateTime;
      if (matchData.mainReferee) updatePayload.mainReferee = matchData.mainReferee;
      if (matchData.linesmen) updatePayload.linesmen = matchData.linesmen;

      const response = await api.patch(`/matches/${id}`, updatePayload);
      return { success: true, data: response.data.match };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update match' 
      };
    }
  },

  getStats: async (id) => {
    try {
      const response = await api.get(`/matches/${id}/stats`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch match stats' 
      };
    }
  }
};

// ==========================================
// STADIUM API
// ==========================================
export const stadiumAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/stadiums');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch stadiums' 
      };
    }
  },

  create: async (stadiumData) => {
    try {
      const response = await api.post('/stadiums', {
        name: stadiumData.name,
        city: stadiumData.city,
        vipRows: stadiumData.vipRows,
        seatsPerRow: stadiumData.vipSeatsPerRow || stadiumData.seatsPerRow
      });
      return { success: true, data: response.data.stadium };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create stadium' 
      };
    }
  }
};

// ==========================================
// SEAT API
// ==========================================
export const seatAPI = {
  getByMatch: async (matchId) => {
    try {
      const response = await api.get(`/matches/${matchId}`);
      const { match, reservedSeats, totalSeats, availableSeats } = response.data;
      
      // Generate seat grid based on stadium dimensions
      const seats = [];
      for (let row = 1; row <= match.stadium.vipRows; row++) {
        for (let seatNumber = 1; seatNumber <= match.stadium.seatsPerRow; seatNumber++) {
          const seatId = `${row}-${seatNumber}`;
          const isReserved = reservedSeats.includes(seatId);
          
          seats.push({
            row,
            seatNumber,
            status: isReserved ? 'reserved' : 'vacant',
            reservedBy: isReserved ? 'reserved' : null
          });
        }
      }
      
      return { success: true, data: seats };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch seats' 
      };
    }
  }
};

// ==========================================
// RESERVATION API
// ==========================================
export const reservationAPI = {
  create: async (reservationData) => {
    try {
      const response = await api.post('/reservations', {
        matchId: reservationData.matchId,
        seats: reservationData.seats,
        creditCardNumber: reservationData.creditCard,
        creditCardPin: '1234' // You may want to add this to reservationData
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Reservation failed' 
      };
    }
  },

  getByUser: async (userId) => {
    try {
      const response = await api.get('/reservations/my-reservations');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch reservations' 
      };
    }
  },

  cancel: async (reservationId) => {
    try {
      const response = await api.delete(`/reservations/${reservationId}`);
      return { 
        success: true, 
        data: { message: response.data.message } 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to cancel reservation' 
      };
    }
  }
};

// ==========================================
// ADMIN API
// ==========================================
export const adminAPI = {
  getPendingUsers: async () => {
    try {
      const response = await api.get('/users/pending-managers');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch pending users' 
      };
    }
  },

  approveUser: async (userId) => {
    try {
      const response = await api.patch(`/users/${userId}/approve`);
      return { success: true, data: response.data.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to approve user' 
      };
    }
  },

  removeUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return { 
        success: true, 
        data: { message: response.data.message } 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to remove user' 
      };
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch users' 
      };
    }
  }
};

// ==========================================
// USER API
// ==========================================
export const userAPI = {
  updateProfile: async (userId, userData) => {
    try {
      // Backend doesn't allow updating username and email, so we filter them out
      const { username, email, ...allowedUpdates } = userData;
      
      const response = await api.patch('/users/profile', allowedUpdates);
      return { success: true, data: response.data.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update profile' 
      };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch profile' 
      };
    }
  }
};

// ==========================================
// TEAM API (Static data - can be enhanced)
// ==========================================
export const teamAPI = {
  getAll: async () => {
    // Egyptian Premier League teams
    const teams = [
      { id: 1, name: 'Al Ahly', city: 'Cairo' },
      { id: 2, name: 'Zamalek', city: 'Cairo' },
      { id: 3, name: 'Pyramids FC', city: 'Cairo' },
      { id: 4, name: 'Ismaily', city: 'Ismailia' },
      { id: 5, name: 'Al Masry', city: 'Port Said' },
      { id: 6, name: 'Al Ittihad Alexandria', city: 'Alexandria' },
      { id: 7, name: 'Ceramica Cleopatra', city: 'Cairo' },
      { id: 8, name: 'Future FC', city: 'Cairo' },
      { id: 9, name: 'Ghazl El Mahalla', city: 'Mahalla' },
      { id: 10, name: 'El Gouna', city: 'Hurghada' },
      { id: 11, name: 'ENPPI', city: 'Cairo' },
      { id: 12, name: 'Smouha', city: 'Alexandria' },
      { id: 13, name: 'National Bank of Egypt SC', city: 'Cairo' },
      { id: 14, name: 'Pharco FC', city: 'Cairo' },
      { id: 15, name: 'ZED FC', city: 'Cairo' },
      { id: 16, name: 'Al Mokawloon', city: 'Cairo' },
      { id: 17, name: 'Talaea El Gaish', city: 'Cairo' },
      { id: 18, name: 'Haras El Hodood', city: 'Cairo' }
    ];

    return { success: true, data: teams };
  }
};

// ==========================================
// Helper functions to maintain compatibility
// ==========================================

// Get stadium by ID (helper)
export const getStadiumById = async (stadiumId) => {
  try {
    const response = await api.get(`/stadiums/${stadiumId}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

// Get team by name (helper)
export const getTeamByName = (teams, teamName) => {
  return teams.find(t => t.name === teamName);
};

export default api;