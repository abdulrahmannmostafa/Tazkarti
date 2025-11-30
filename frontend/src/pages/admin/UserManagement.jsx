import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './UserManagement.css';

const UserManagement = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'all'
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchPendingUsers();
        fetchAllUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const result = await adminAPI.getPendingUsers();
            if (result.success) {
                setPendingUsers(result.data);
            }
        } catch (error) {
            console.error('Error fetching pending users:', error);
        }
    };

    const fetchAllUsers = async () => {
        setLoading(true);
        try {
            const result = await adminAPI.getAllUsers();
            if (result.success) {
                setAllUsers(result.data.filter(u => u.role !== 'admin'));
            }
        } catch (error) {
            console.error('Error fetching all users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        setActionLoading(userId);
        setMessage(null);
        try {
            const result = await adminAPI.approveUser(userId);
            if (result.success) {
                setPendingUsers(prev => prev.filter(u => u._id !== userId));
                fetchAllUsers(); // Refresh all users list
                setMessage({ type: 'success', text: result.data.message || 'User approved successfully' });
            } else {
                setMessage({ type: 'error', text: result.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to approve user' });
        } finally {
            setActionLoading(null);
        }
    };

    const handleRemove = async (userId, isFromPending = false) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        setActionLoading(userId);
        setMessage(null);
        try {
            const result = await adminAPI.removeUser(userId);
            if (result.success) {
                if (isFromPending) {
                    setPendingUsers(prev => prev.filter(u => u._id !== userId));
                } else {
                    setAllUsers(prev => prev.filter(u => u._id !== userId));
                }
                setMessage({ type: 'success', text: 'User deleted successfully' });
            } else {
                setMessage({ type: 'error', text: result.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete user' });
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <LoadingSpinner message="Loading users..." />;

    return (
        <div className="user-management-page">
            <div className="container">
                <h1 className="text-gradient mb-xl">User Management</h1>

                {message && (
                    <div className={`alert alert-${message.type}`}>
                        {message.text}
                    </div>
                )}

                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Approvals ({pendingUsers.length})
                    </button>
                    <button
                        className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Users ({allUsers.length})
                    </button>
                </div>

                {/* Pending Users Tab */}
                {activeTab === 'pending' && (
                    <div className="admin-section">
                        <p className="section-desc">The following users have registered and require approval before they can login.</p>

                        {pendingUsers.length === 0 ? (
                            <div className="card empty-state">
                                <p>No pending user approvals.</p>
                            </div>
                        ) : (
                            <div className="users-list">
                                {pendingUsers.map(user => (
                                    <div key={user._id} className="user-card glass-card">
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                            </div>
                                            <div className="user-details">
                                                <h4>{user.firstName} {user.lastName}</h4>
                                                <p className="username">@{user.username}</p>
                                                <p className="email">{user.email}</p>
                                                <div className="user-meta">
                                                    <span className={`badge badge-${user.role}`}>
                                                        {user.role === 'manager' ? 'Manager' : 'Fan'}
                                                    </span>
                                                    <span className="city">📍 {user.city}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="user-actions">
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleApprove(user._id)}
                                                disabled={actionLoading === user._id}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemove(user._id, true)}
                                                disabled={actionLoading === user._id}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* All Users Tab */}
                {activeTab === 'all' && (
                    <div className="admin-section">
                        <p className="section-desc">Manage all existing users. Admin users are hidden for security.</p>

                        {allUsers.length === 0 ? (
                            <div className="card empty-state">
                                <p>No users found.</p>
                            </div>
                        ) : (
                            <div className="users-list">
                                {allUsers.map(user => (
                                    <div key={user._id} className="user-card glass-card">
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                            </div>
                                            <div className="user-details">
                                                <h4>{user.firstName} {user.lastName}</h4>
                                                <p className="username">@{user.username}</p>
                                                <p className="email">{user.email}</p>
                                                <div className="user-meta">
                                                    <span className={`badge badge-${user.role}`}>
                                                        {user.role === 'manager' ? 'Manager' : 'Fan'}
                                                    </span>
                                                    <span className={`badge ${user.isApproved ? 'badge-success' : 'badge-warning'}`}>
                                                        {user.isApproved ? 'Approved' : 'Pending'}
                                                    </span>
                                                    <span className="city">📍 {user.city}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="user-actions">
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemove(user._id, false)}
                                                disabled={actionLoading === user._id}
                                            >
                                                🗑️ Delete User
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
