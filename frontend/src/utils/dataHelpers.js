// Helper functions to work with backend data
import { teamAPI, stadiumAPI } from '../services/api';

// Cache for teams and stadiums
let teamsCache = null;
let stadiumsCache = null;
export const getTeamById = async (id) => {
    if (!teamsCache) {
        const result = await teamAPI.getAll();
        if (result.success) {
            teamsCache = result.data;
        } else {
            return null;
        }
    }

    return teamsCache.find(team => team._id === id || team.id === id) || null;
};
export const getAllTeams = async () => {
    if (!teamsCache) {
        const result = await teamAPI.getAll();
        if (result.success) {
            teamsCache = result.data;
        }
    }
    return teamsCache || [];
};
export const getStadiumById = async (id) => {
    if (!stadiumsCache) {
        const result = await stadiumAPI.getAll();
        if (result.success) {
            stadiumsCache = result.data;
        } else {
            return null;
        }
    }

    return stadiumsCache.find(stadium => stadium._id === id || stadium.id === id) || null;
};
export const getAllStadiums = async () => {
    if (!stadiumsCache) {
        const result = await stadiumAPI.getAll();
        if (result.success) {
            stadiumsCache = result.data;
        }
    }
    return stadiumsCache || [];
};

// Clear cache (call this when data is updated)
export const clearCache = () => {
    teamsCache = null;
    stadiumsCache = null;
};
