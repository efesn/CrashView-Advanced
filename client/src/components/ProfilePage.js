import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userActivity, setUserActivity] = useState({
        comments: [],
        discussions: [],
        votes: []
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                console.log('Token:', token);

                if (!token) {
                    console.log('No token found, redirecting to login');
                    navigate('/login');
                    return;
                }

                const response = await axiosInstance.get('/Users/profile');
                
                if (response.data) {
                    setUser(response.data);
                    await fetchUserActivity(response.data.id);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error details:', {
                    status: err.response?.status,
                    data: err.response?.data,
                    message: err.message
                });
                
                if (err.response?.status === 401) {
                    localStorage.removeItem('jwtToken');
                    localStorage.removeItem('isLoggedIn');
                    navigate('/login');
                    return;
                }
                setError('Failed to load profile');
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const fetchUserActivity = async (userId) => {
        try {
            const [commentsRes, discussionsRes, votesRes] = await Promise.all([
                axiosInstance.get(`/Comments/user/${userId}`),
                axiosInstance.get(`/Discussions/user/${userId}`),
                axiosInstance.get(`/PollVotes/user/${userId}`)
            ]);

            setUserActivity({
                comments: commentsRes.data.$values || commentsRes.data,
                discussions: discussionsRes.data.$values || discussionsRes.data,
                votes: votesRes.data.$values || votesRes.data
            });
        } catch (err) {
            console.error('Error fetching user activity:', err);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-red-600">{error}</div>
        </div>
    );

    return (
        <>
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Profile Header */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
                                <span className="text-2xl text-white font-bold">
                                    {user?.userName?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{user?.userName}</h1>
                                <p className="text-gray-600">{user?.email}</p>
                                <p className="text-sm text-gray-500">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Activity Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Comments</h3>
                            <p className="text-3xl font-bold text-red-600">{userActivity.comments.length}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Discussions</h3>
                            <p className="text-3xl font-bold text-red-600">{userActivity.discussions.length}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Poll Votes</h3>
                            <p className="text-3xl font-bold text-red-600">{userActivity.votes.length}</p>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                        
                        {/* Recent Comments */}
                        {userActivity.comments.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Latest Comments</h3>
                                <div className="space-y-3">
                                    {userActivity.comments.slice(0, 3).map(comment => (
                                        <div key={comment.id} className="border-l-4 border-red-600 pl-4 py-2">
                                            <p className="text-gray-700">{comment.commentText}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Discussions */}
                        {userActivity.discussions.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Latest Discussions</h3>
                                <div className="space-y-3">
                                    {userActivity.discussions.slice(0, 3).map(discussion => (
                                        <div key={discussion.id} 
                                             className="border-l-4 border-red-600 pl-4 py-2 cursor-pointer hover:bg-gray-50"
                                             onClick={() => navigate(`/discussions/${discussion.id}`)}>
                                            <p className="font-medium text-gray-800">{discussion.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(discussion.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage; 