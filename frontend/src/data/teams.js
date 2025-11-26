export const teams = [
    { id: 1, name: 'Al Ahly', city: 'Cairo', logo: '🔴' },
    { id: 2, name: 'Zamalek', city: 'Cairo', logo: '⚪' },
    { id: 3, name: 'Pyramids FC', city: 'Cairo', logo: '🔵' },
    { id: 4, name: 'Al Masry', city: 'Port Said', logo: '💚' },
    { id: 5, name: 'Ismaily', city: 'Ismailia', logo: '💛' },
    { id: 6, name: 'Al Ittihad Alexandria', city: 'Alexandria', logo: '⚫' },
    { id: 7, name: 'Ceramica Cleopatra', city: 'Cairo', logo: '🟤' },
    { id: 8, name: 'Future FC', city: 'Cairo', logo: '🟡' },
    { id: 9, name: 'Smouha', city: 'Alexandria', logo: '🔵' },
    { id: 10, name: 'El Gouna', city: 'El Gouna', logo: '🔴' },
    { id: 11, name: 'Pharco FC', city: 'Cairo', logo: '⚪' },
    { id: 12, name: 'ZED FC', city: 'Cairo', logo: '🟣' },
    { id: 13, name: 'National Bank of Egypt', city: 'Cairo', logo: '🟢' },
    { id: 14, name: 'Al Mokawloon', city: 'Cairo', logo: '⚫' },
    { id: 15, name: 'Ghazl El Mahalla', city: 'El Mahalla', logo: '🟢' },
    { id: 16, name: 'Talaea El Gaish', city: 'Cairo', logo: '🔴' },
    { id: 17, name: 'Aswan FC', city: 'Aswan', logo: '🟠' },
    { id: 18, name: 'El Daklyeh', city: 'Dakahlia', logo: '🟤' }
];

export const getTeamById = (id) => {
    return teams.find(team => team.id === parseInt(id));
};

export const getTeamByName = (name) => {
    return teams.find(team => team.name.toLowerCase() === name.toLowerCase());
};
