import React, { useState, useEffect } from 'react';
import { matchAPI } from '../services/api';
import MatchCard from '../components/matches/MatchCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Matches.css';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, upcoming, past

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            try {
                const result = await matchAPI.getAll();
                if (result.success) {
                    setMatches(result.data);
                }
            } catch (error) {
                console.error('Error fetching matches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    const filteredMatches = matches.filter(match => {
        if (filter === 'all') return true;
        const matchDate = new Date(match.dateTime);
        const now = new Date();
        if (filter === 'upcoming') return matchDate > now;
        if (filter === 'past') return matchDate <= now;
        return true;
    });

    if (loading) {
        return <LoadingSpinner message="Loading matches..." />;
    }

    return (
        <div className="matches-page">
            <div className="container">
                <div className="page-header">
                    <h1 className="text-gradient">Matches</h1>
                    <div className="match-filters">
                        <button
                            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('all')}
                        >
                            All Matches
                        </button>
                        <button
                            className={`btn ${filter === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('upcoming')}
                        >
                            Upcoming
                        </button>
                        <button
                            className={`btn ${filter === 'past' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('past')}
                        >
                            Past Results
                        </button>
                    </div>
                </div>

                {filteredMatches.length === 0 ? (
                    <div className="no-matches">
                        <p>No matches found.</p>
                    </div>
                ) : (
                    <div className="matches-grid">
                        {filteredMatches.map(match => (
                            <MatchCard key={match.id} match={match} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Matches;
