import React from 'react';
import { Link } from 'react-router-dom';
import { teams, getTeamById } from '../../data/teams';
import { stadiums, getStadiumById } from '../../data/stadiums';
import './MatchCard.css';

const MatchCard = ({ match }) => {
    const homeTeam = getTeamById(match.homeTeamId);
    const awayTeam = getTeamById(match.awayTeamId);
    const stadium = getStadiumById(match.stadiumId);

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

    return (
        <div className="match-card glass-card">
            <div className="match-header">
                <span className="match-status badge badge-success">
                    {match.status}
                </span>
                <span className="match-date">
                    {formattedDate} • {formattedTime}
                </span>
            </div>

            <div className="match-teams">
                <div className="team home-team">
                    <div className="team-logo">{homeTeam.logo}</div>
                    <h3 className="team-name">{homeTeam.name}</h3>
                </div>

                <div className="match-vs">
                    <span>VS</span>
                </div>

                <div className="team away-team">
                    <div className="team-logo">{awayTeam.logo}</div>
                    <h3 className="team-name">{awayTeam.name}</h3>
                </div>
            </div>

            <div className="match-info">
                <div className="match-venue">
                    <span className="icon">🏟️</span>
                    {stadium.name}
                </div>
                <div className="match-location">
                    <span className="icon">📍</span>
                    {stadium.city}
                </div>
            </div>

            <div className="match-actions">
                <Link to={`/matches/${match.id}`} className="btn btn-primary btn-block">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default MatchCard;
