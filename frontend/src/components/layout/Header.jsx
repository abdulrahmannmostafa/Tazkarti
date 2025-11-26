import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
    const { isAuthenticated, user, logout, isAdmin, isManager, isFan } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <span className="logo-text text-gradient">Tazkarti</span>
                        <span className="logo-subtitle">Egyptian Premier League</span>
                    </Link>

                    <nav className="nav">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/matches" className="nav-link">Matches</Link>

                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                    <Link to="/admin/users" className="nav-link">
                                        Manage Users
                                    </Link>
                                )}

                                {isManager && (
                                    <>
                                        <Link to="/manager/matches/create" className="nav-link">
                                            Create Match
                                        </Link>
                                        <Link to="/manager/stadiums/create" className="nav-link">
                                            Add Stadium
                                        </Link>
                                    </>
                                )}

                                {isFan && (
                                    <>
                                        <Link to="/my-reservations" className="nav-link">
                                            My Reservations
                                        </Link>
                                        <Link to="/profile" className="nav-link">
                                            Profile
                                        </Link>
                                    </>
                                )}

                                <div className="user-menu">
                                    <span className="user-name">{user?.firstName}</span>
                                    <span className={`badge badge-${user?.role}`}>
                                        {user?.role}
                                    </span>
                                    <button onClick={handleLogout} className="btn btn-sm btn-secondary">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-sm btn-secondary">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-sm btn-primary">
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
