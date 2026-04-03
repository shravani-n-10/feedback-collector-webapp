import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            toast.success('Registration successful!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="glass p-8 rounded-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300">Name</label>
                        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} required
                            className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-gray-300">Email</label>
                        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required
                            className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-gray-300">Password</label>
                        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required
                            className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <button type="submit"
                        className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md font-bold transition-all shadow-lg hover:shadow-indigo-500/50">
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-400">Already have an account? <Link to="/login" className="text-indigo-400 hover:underline">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
