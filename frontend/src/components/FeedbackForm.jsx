import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FeedbackForm = ({ onFeedbackAdded }) => {
    const [name, setName] = useState('');
    const [topic, setTopic] = useState('');
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState('5');
    const [category, setCategory] = useState('Other');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        const formData = new FormData();
        formData.append('name', name);
        formData.append('topic', topic);
        formData.append('message', message);
        formData.append('rating', rating);
        formData.append('category', category);
        if (image) formData.append('image', image);

        try {
            await axios.post('http://localhost:5000/api/feedback', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${userInfo.token}`
                }
            });
            toast.success('Feedback submitted successfully!');
            setName('');
            setTopic('');
            setMessage('');
            setRating('5');
            setCategory('Other');
            setImage(null);
            // the websocket will trigger onFeedbackAdded
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error submitting feedback');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass p-6 rounded-xl space-y-4 shadow-xl border-t-4 border-teal-500">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">
                Submit Feedback
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm text-gray-300 font-semibold mb-1">
                        Name / Title <span className="text-red-400">*</span> <span className="text-xs text-gray-500 font-normal ml-1">(which app are you giving feedback on?)</span>
                    </label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                        className="w-full mt-1 p-2 bg-gray-800 rounded-md focus:ring-2 focus:ring-teal-500 border border-gray-700 outline-none" />
                </div>
                <div>
                    <label className="block text-sm text-gray-300">Specific Topic</label>
                    <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} required placeholder="e.g. Login Button"
                        className="w-full mt-1 p-2 bg-gray-800 rounded-md focus:ring-2 focus:ring-teal-500 border border-gray-700 outline-none" />
                </div>
                <div>
                    <label className="block text-sm text-gray-300">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}
                        className="w-full mt-1 p-2 bg-gray-800 rounded-md focus:ring-2 focus:ring-teal-500 border border-gray-700 outline-none">
                        <option value="Bug">Bug</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="UI/UX">UI/UX</option>
                        <option value="Performance">Performance</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm text-gray-300">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows="3"
                    className="w-full mt-1 p-2 bg-gray-800 rounded-md focus:ring-2 focus:ring-teal-500 border border-gray-700 outline-none"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-300">Rating (1-5)</label>
                    <input type="range" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)}
                        className="w-full mt-2 accent-teal-500" />
                    <div className="text-center mt-1 text-yellow-400 font-bold tracking-widest">
                        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-gray-300">Screenshot (Optional)</label>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*"
                        className="w-full mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-700 file:text-teal-400 hover:file:bg-gray-600 cursor-pointer" />
                </div>
            </div>

            <button type="submit" disabled={loading}
                className="w-full mt-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 rounded-md font-bold transition-all disabled:opacity-50 shadow-lg shadow-teal-500/20">
                {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
        </form>
    );
};

export default FeedbackForm;
