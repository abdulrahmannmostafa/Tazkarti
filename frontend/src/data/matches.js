// Mock match data
export const matches = [
    {
        id: 1,
        homeTeamId: 1, // Al Ahly
        awayTeamId: 2, // Zamalek
        stadiumId: 1, // Cairo International Stadium
        dateTime: '2025-12-15T19:00:00',
        mainReferee: 'Mohamed El-Hanfy',
        linesman1: 'Ahmed Hassan',
        linesman2: 'Samir Osman',
        status: 'scheduled' // scheduled, completed, cancelled
    },
    {
        id: 2,
        homeTeamId: 3, // Pyramids FC
        awayTeamId: 4, // Al Masry
        stadiumId: 1,
        dateTime: '2025-12-18T17:30:00',
        mainReferee: 'Amin Omar',
        linesman1: 'Ibrahim Nour',
        linesman2: 'Mahmoud Yasser',
        status: 'scheduled'
    },
    {
        id: 3,
        homeTeamId: 5, // Ismaily
        awayTeamId: 9, // Smouha
        stadiumId: 6,
        dateTime: '2025-12-20T15:00:00',
        mainReferee: 'Gehad Grisha',
        linesman1: 'Hossam Zakaria',
        linesman2: 'Tarek Diab',
        status: 'scheduled'
    },
    {
        id: 4,
        homeTeamId: 2, // Zamalek
        awayTeamId: 3, // Pyramids FC
        stadiumId: 1,
        dateTime: '2025-12-22T19:00:00',
        mainReferee: 'Mohamed El-Hanfy',
        linesman1: 'Ahmed Hassan',
        linesman2: 'Samir Osman',
        status: 'scheduled'
    },
    {
        id: 5,
        homeTeamId: 1, // Al Ahly
        awayTeamId: 5, // Ismaily
        stadiumId: 1,
        dateTime: '2025-12-25T18:00:00',
        mainReferee: 'Amin Omar',
        linesman1: 'Ibrahim Nour',
        linesman2: 'Mahmoud Yasser',
        status: 'scheduled'
    },
    {
        id: 6,
        homeTeamId: 10, // El Gouna
        awayTeamId: 13, // National Bank
        stadiumId: 3,
        dateTime: '2025-12-28T16:00:00',
        mainReferee: 'Gehad Grisha',
        linesman1: 'Hossam Zakaria',
        linesman2: 'Tarek Diab',
        status: 'scheduled'
    }
];

export const getMatchById = (id) => {
    return matches.find(match => match.id === parseInt(id));
};

export const getUpcomingMatches = () => {
    const now = new Date();
    return matches.filter(match => {
        const matchDate = new Date(match.dateTime);
        return matchDate > now && match.status === 'scheduled';
    }).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
};

export const getMatchesByTeam = (teamId) => {
    return matches.filter(match =>
        match.homeTeamId === teamId || match.awayTeamId === teamId
    );
};
