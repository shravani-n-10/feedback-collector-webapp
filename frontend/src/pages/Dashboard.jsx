import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import FeedbackForm from '../components/FeedbackForm';
import { FaSearch } from 'react-icons/fa';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [stats, setStats] = useState({ totalFeedbacks: 0, avgRating: 0, positiveCount: 0, negativeCount: 0, neutralCount: 0 });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchStats();

        const socket = io('http://localhost:5000');
        
        socket.on('new_feedback', () => {
            fetchStats();
            toast('New feedback arrived!', { icon: '🔔' });
        });

        return () => socket.disconnect();
    }, [user, navigate]);

    const fetchStats = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/feedback/stats');
            setStats(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <header className="flex justify-between items-center glass p-4 rounded-xl">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">
                        Smart Feedback Analyzer
                    </h1>
                    <p className="text-gray-400 text-sm">Welcome back, {user.name} 👋</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/search')} className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500 hover:text-white rounded-md transition-colors border border-indigo-500/30">
                        <FaSearch /> Search Feedbacks
                    </button>
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition-colors border border-red-500/30">
                        Logout
                    </button>
                </div>
            </header>

            {/* Stats section */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass p-4 rounded-xl text-center border-b-4 border-indigo-500">
                    <p className="text-gray-400 text-sm">Total Feedback</p>
                    <p className="text-3xl font-bold text-white">{stats.totalFeedbacks}</p>
                </div>
                <div className="glass p-4 rounded-xl text-center border-b-4 border-teal-500">
                    <p className="text-gray-400 text-sm">Average Rating</p>
                    <p className="text-3xl font-bold text-white">{stats.avgRating.toFixed(1)} ⭐</p>
                </div>
                <div className="glass p-4 rounded-xl text-center border-b-4 border-green-500">
                    <p className="text-gray-400 text-sm">Positive Vibes</p>
                    <p className="text-3xl font-bold text-green-400">{stats.positiveCount} 😊</p>
                </div>
                <div className="glass p-4 rounded-xl text-center border-b-4 border-red-500">
                    <p className="text-gray-400 text-sm">Negative Feedback</p>
                    <p className="text-3xl font-bold text-red-400">{stats.negativeCount} 😡</p>
                </div>
            </div>

            {/* Centered Feedback Form */}
            <div className="max-w-2xl mx-auto">
                <FeedbackForm />
            </div>
        </div>
    );
};

export default Dashboard;
