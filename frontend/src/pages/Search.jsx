import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa'; // Make sure react-icons is installed

const Search = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [feedbacks, setFeedbacks] = useState([]);
    
    // Filters
    const [search, setSearch] = useState('');
    const [rating, setRating] = useState('');
    const [sort, setSort] = useState('latest');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchFeedbacks();

        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
        
        socket.on('new_feedback', (newFeedback) => {
            setFeedbacks(prev => {
                if (sort === 'latest') {
                    return [newFeedback, ...prev];
                }
                fetchFeedbacks();
                return prev;
            });
        });

        return () => socket.disconnect();
    }, [user, navigate, sort, rating, search]);

    const fetchFeedbacks = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/feedback?search=${search}&rating=${rating}&sort=${sort}`);
            setFeedbacks(data);
        } catch (error) {
            console.error(error);
        }
    };

    if (!user) return null;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <header className="flex justify-between items-center glass p-4 rounded-xl">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">
                        Search Feedback
                    </h1>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 text-gray-300 hover:bg-gray-500 hover:text-white rounded-md transition-colors border border-gray-500/30">
                        <FaArrowLeft /> Dashboard
                    </button>
                    <button onClick={() => { logout(); navigate('/login'); }} className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition-colors border border-red-500/30">
                        Logout
                    </button>
                </div>
            </header>

            <div className="space-y-4">
                {/* Filters */}
                <div className="glass p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
                    <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="bg-gray-800 p-2 rounded-md border border-gray-700 outline-none focus:border-teal-500 w-full" />
                    
                    <select value={rating} onChange={(e) => setRating(e.target.value)}
                        className="bg-gray-800 p-2 rounded-md border border-gray-700 outline-none w-full md:w-32">
                        <option value="">All Ratings</option>
                        {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                    </select>

                    <select value={sort} onChange={(e) => setSort(e.target.value)}
                        className="bg-gray-800 p-2 rounded-md border border-gray-700 outline-none w-full md:w-40">
                        <option value="latest">Latest First</option>
                        <option value="oldest">Oldest</option>
                        <option value="rating_high">Highest Rated</option>
                        <option value="rating_low">Lowest Rated</option>
                        <option value="topic_asc">Topic (A-Z)</option>
                        <option value="topic_desc">Topic (Z-A)</option>
                    </select>
                </div>

                {/* Feedbacks Grid */}
                {feedbacks.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 bg-gray-800/80 rounded-xl p-8 border border-gray-700">No feedback found. Try adjusting your search!</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {feedbacks.map(f => (
                            <div key={f._id} className="glass p-5 rounded-xl border-l-4 group hover:bg-gray-800/50 transition-colors" 
                                 style={{ borderLeftColor: f.sentiment.label === 'Positive' ? '#10b981' : f.sentiment.label === 'Negative' ? '#ef4444' : '#6b7280' }}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-lg text-teal-300">{f.name}</h4>
                                        <p className="text-xs text-gray-400 mt-1">Topic: <span className="text-gray-200">{f.topic}</span></p>
                                    </div>
                                    <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">{f.category}</span>
                                </div>
                                <div className="text-yellow-400 text-sm mt-1">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</div>
                                <p className="text-gray-300 mt-3 text-sm">{f.message}</p>
                                
                                {f.imageUrl && (
                                    <img src={f.imageUrl} alt="attachment" className="mt-3 rounded-md w-full max-h-32 object-cover border border-gray-700" />
                                )}

                                <div className="mt-4 flex justify-between items-center text-xs">
                                    <span className={`px-2 py-1 rounded font-semibold ${
                                        f.sentiment.label === 'Positive' ? 'bg-green-500/20 text-green-400' :
                                        f.sentiment.label === 'Negative' ? 'bg-red-500/20 text-red-400' :
                                        'bg-gray-500/20 text-gray-300'
                                    }`}>
                                        {f.sentiment.label} (Score: {f.sentiment.score})
                                    </span>
                                    <span className="text-gray-500">{new Date(f.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
