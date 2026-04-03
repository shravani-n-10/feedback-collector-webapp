import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Logged in successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="glass p-8 rounded-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-teal-400 mb-6">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300">Email</label>
                        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required
                            className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <div>
                        <label className="block text-gray-300">Password</label>
                        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required
                            className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <button type="submit"
                        className="w-full py-2 bg-teal-500 hover:bg-teal-600 rounded-md font-bold transition-all shadow-lg hover:shadow-teal-500/50">
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-400">Don't have an account? <Link to="/register" className="text-teal-400 hover:underline">Register</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
