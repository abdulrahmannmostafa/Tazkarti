// Real API Service for Backend Integration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        ...options
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, defaultOptions);
        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.error || data.message || 'Request failed' };
        }

        return { success: true, data };
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
};

// Authentication API
export const authAPI = {
    login: async ({ username, password }) => {
        const result = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        if (result.success && result.data.token) {
            localStorage.setItem('token', result.data.token);
        }

        return result;
    },

    register: async (userData) => {
        return await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    logout: () => {
        localStorage.removeItem('token');
        return { success: true };
    }
};
export const userAPI = {
    getProfile: async () => {
        return await apiCall('/users/profile');
    },

    updateProfile: async (profileData) => {
        return await apiCall('/users/profile', {
            method: 'PATCH',
            body: JSON.stringify(profileData)
        });
    }
};
export const adminAPI = {
    getAllUsers: async () => {
        return await apiCall('/users');
    },

    getPendingUsers: async () => {
        return await apiCall('/users/pending');
    },

    approveUser: async (userId) => {
        return await apiCall(`/users/${userId}/approve`, {
            method: 'PATCH'
        });
    },

    removeUser: async (userId) => {
        return await apiCall(`/users/${userId}`, {
            method: 'DELETE'
        });
    }
};
export const teamAPI = {
    getAll: async () => {
        return await apiCall('/teams');
    },

    getById: async (id) => {
        return await apiCall(`/teams/${id}`);
    }
};
export const stadiumAPI = {
    getAll: async () => {
        return await apiCall('/stadiums');
    },

    getById: async (id) => {
        return await apiCall(`/stadiums/${id}`);
    },

    create: async (stadiumData) => {
        return await apiCall('/stadiums', {
            method: 'POST',
            body: JSON.stringify(stadiumData)
        });
    },

    update: async (id, stadiumData) => {
        return await apiCall(`/stadiums/${id}`, {
            method: 'PUT',
            body: JSON.stringify(stadiumData)
        });
    }
};
export const matchAPI = {
    getAll: async () => {
        return await apiCall('/matches');
    },

    getById: async (id) => {
        return await apiCall(`/matches/${id}`);
    },

    create: async (matchData) => {
        return await apiCall('/matches', {
            method: 'POST',
            body: JSON.stringify(matchData)
        });
    },

    update: async (id, matchData) => {
        return await apiCall(`/matches/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(matchData)
        });
    },

    delete: async (id) => {
        return await apiCall(`/matches/${id}`, {
            method: 'DELETE'
        });
    }
};
export const seatAPI = {
    getByMatch: async (matchId) => {
        return await apiCall(`/matches/${matchId}/seats`);
    }
};
export const reservationAPI = {
    create: async (reservationData) => {
        return await apiCall('/reservations', {
            method: 'POST',
            body: JSON.stringify(reservationData)
        });
    },

    getMyReservations: async () => {
        return await apiCall('/reservations/my-reservations');
    },

    getByUser: async (userId) => {
        return await apiCall(`/reservations/user/${userId}`);
    },

    cancel: async (reservationId) => {
        return await apiCall(`/reservations/${reservationId}`, {
            method: 'DELETE'
        });
    },

    getById: async (reservationId) => {
        return await apiCall(`/reservations/${reservationId}`);
    }
};

