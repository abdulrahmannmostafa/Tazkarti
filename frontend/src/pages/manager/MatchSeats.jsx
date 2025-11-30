import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { seatAPI, matchAPI } from '../../services/api';
import SeatGrid from '../../components/seats/SeatGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getTeamById } from '../../data/teams';
import { getStadiumById } from '../../data/stadiums';

const MatchSeats = () => {
    const { id } = useParams();
    const [seats, setSeats] = useState([]);
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const matchResult = await matchAPI.getById(id);
                if (matchResult.success) {
                    setMatch(matchResult.data);

                    const seatsResult = await seatAPI.getByMatch(id);
                    if (seatsResult.success) {
                        setSeats(seatsResult.data);
                    }
                } else {
                    setError('Match not found');
                }
            } catch (err) {
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <LoadingSpinner message="Loading seat status..." />;
    if (error) return <div className="container alert alert-error">{error}</div>;
    if (!match) return null;

    const homeTeam = getTeamById(match.homeTeamId);
    const awayTeam = getTeamById(match.awayTeamId);
    const stadium = getStadiumById(match.stadiumId);
    const totalSeats = seats.length;
    const reservedSeats = seats.filter(s => s.status === 'reserved').length;
    const vacantSeats = totalSeats - reservedSeats;
    const occupancyRate = Math.round((reservedSeats / totalSeats) * 100);

    return (
        <div className="match-seats-page">
            <div className="container">
                <div className="page-header">
                    <h1 className="text-gradient">Seat Status</h1>
                    <div className="match-info">
                        <h2>{homeTeam.name} vs {awayTeam.name}</h2>
                        <p>{stadium.name}</p>
                    </div>
                </div>

                <div className="stats-grid mb-xl" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="card text-center">
                        <h3>Total Capacity</h3>
                        <p className="text-xl font-bold">{totalSeats}</p>
                    </div>
                    <div className="card text-center">
                        <h3 className="text-success">Vacant</h3>
                        <p className="text-xl font-bold text-success">{vacantSeats}</p>
                    </div>
                    <div className="card text-center">
                        <h3 className="text-error">Reserved</h3>
                        <p className="text-xl font-bold text-error">{reservedSeats}</p>
                    </div>
                    <div className="card text-center">
                        <h3>Occupancy</h3>
                        <p className="text-xl font-bold">{occupancyRate}%</p>
                    </div>
                </div>

                <div className="stadium-view glass-card p-lg" style={{ overflowX: 'auto' }}>
                    <SeatGrid seats={seats} onSeatToggle={() => { }} />
                </div>
            </div>
        </div>
    );
};

export default MatchSeats;
