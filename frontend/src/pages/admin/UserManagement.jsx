import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './UserManagement.css';

const UserManagement = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        setLoading(true);
        try {
            const result = await adminAPI.getPendingUsers();
            if (result.success) {
                setPendingUsers(result.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
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
                setPendingUsers(prev => prev.filter(u => u.id !== userId));
                setMessage({ type: 'success', text: 'User approved successfully' });
            } else {
                setMessage({ type: 'error', text: result.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to approve user' });
        } finally {
            setActionLoading(null);
        }
    };

    const handleRemove = async (userId) => {
        if (!window.confirm('Are you sure you want to reject/remove this user?')) return;

        setActionLoading(userId);
        setMessage(null);
        try {
            const result = await adminAPI.removeUser(userId);
            if (result.success) {
                setPendingUsers(prev => prev.filter(u => u.id !== userId));
                setMessage({ type: 'success', text: 'User removed successfully' });
            } else {
                setMessage({ type: 'error', text: result.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to remove user' });
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <LoadingSpinner message="Loading pending users..." />;

    return (
        <div className="user-management-page">
            <div className="container">
                <h1 className="text-gradient mb-xl">User Management</h1>

                {message && (
                    <div className={`alert alert-${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="admin-section">
                    <h3>Pending Approvals</h3>
                    <p className="section-desc">The following users have registered as Managers and require approval.</p>

                    {pendingUsers.length === 0 ? (
                        <div className="card empty-state">
                            <p>No pending user approvals.</p>
                        </div>
                    ) : (
                        <div className="users-list">
                            {pendingUsers.map(user => (
                                <div key={user.id} className="user-card glass-card">
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                        </div>
                                        <div className="user-details">
                                            <h4>{user.firstName} {user.lastName}</h4>
                                            <p className="username">@{user.username}</p>
                                            <p className="email">{user.email}</p>
                                            <div className="user-meta">
                                                <span className="badge badge-manager">Manager Role Requested</span>
                                                <span className="city">?? {user.city}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="user-actions">
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleApprove(user.id)}
                                            disabled={actionLoading === user.id}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleRemove(user.id)}
                                            disabled={actionLoading === user.id}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
