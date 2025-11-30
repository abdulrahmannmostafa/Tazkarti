import React from 'react';
import { Link } from 'react-router-dom';
import './MatchCard.css';

const MatchCard = ({ match }) => {
    // Backend returns team names directly, not IDs
    const homeTeam = match.homeTeam || 'Unknown Team';
    const awayTeam = match.awayTeam || 'Unknown Team';
    const stadium = match.stadium || {};

    const matchDate = new Date(match.dateTime);
    const formattedDate = matchDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
    const formattedTime = matchDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Determine match status based on date
    const now = new Date();
    const status = matchDate > now ? 'Upcoming' : 'Completed';

    return (
        <div className="match-card glass-card">
            <div className="match-header">
                <span className={`match-status badge ${matchDate > now ? 'badge-success' : 'badge-secondary'}`}>
                    {status}
                </span>
                <span className="match-date">
                    {formattedDate} • {formattedTime}
                </span>
            </div>

            <div className="match-teams">
                <div className="team home-team">
                    <div className="team-logo">⚽</div>
                    <h3 className="team-name">{homeTeam}</h3>
                </div>

                <div className="match-vs">
                    <span>VS</span>
                </div>

                <div className="team away-team">
                    <div className="team-logo">⚽</div>
                    <h3 className="team-name">{awayTeam}</h3>
                </div>
            </div>

            <div className="match-info">
                <div className="match-venue">
                    <span className="icon">🏟️</span>
                    {stadium.name || 'Unknown Stadium'}
                </div>
                <div className="match-location">
                    <span className="icon">📍</span>
                    {stadium.city || 'Unknown City'}
                </div>
            </div>

            <div className="match-actions">
                <Link to={`/matches/${match._id}`} className="btn btn-primary btn-block">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default MatchCard;
