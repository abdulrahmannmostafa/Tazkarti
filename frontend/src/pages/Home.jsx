import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="home">
            <div className="container">
                <div className="hero">
                    <h1 className="hero-title">
                        Welcome to <span className="text-gradient">Tazkarti</span>
                    </h1>
                    <p className="hero-subtitle">
                        Egyptian Premier League Match Reservation System
                    </p>
                    <p className="hero-description">
                        Book your tickets for the most exciting football matches in Egypt.
                        Secure your seat in the VIP lounge and experience the thrill of Egyptian football!
                    </p>
                    <div className="hero-buttons">
                        <Link to="/matches" className="btn btn-lg btn-primary">
                            View Matches
                        </Link>
                        {!user && (
                            <Link to="/register" className="btn btn-lg btn-outline">
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>

                <div className="features">
                    <div className="feature-card card">
                        <div className="feature-icon">🎟️</div>
                        <h3>Easy Booking</h3>
                        <p>Book your seats with just a few clicks</p>
                    </div>
                    <div className="feature-card card">
                        <div className="feature-icon">🏟️</div>
                        <h3>VIP Seating</h3>
                        <p>Choose your exact seat in the VIP lounge</p>
                    </div>
                    <div className="feature-card card">
                        <div className="feature-icon">⚽</div>
                        <h3>All Matches</h3>
                        <p>Access to all Egyptian Premier League matches</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
