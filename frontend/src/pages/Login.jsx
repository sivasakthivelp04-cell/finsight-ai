import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '' // Company Name for registration
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.type === 'password' ? 'password' : e.target.type === 'email' ? 'email' : 'name']: e.target.value });
    };

    // Keep name separate in case types overlap or for clarity
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/register';

        try {
            console.log("Attempting auth at:", `${API_BASE_URL}/auth/${isLogin ? 'login' : 'register'}`);
            const response = await fetch(`${API_BASE_URL}/auth/${isLogin ? 'login' : 'register'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(isLogin ? {
                    email: formData.email,
                    password: formData.password
                } : {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(`Server error (not JSON): ${text.substring(0, 100)}`);
            }

            if (!response.ok) {
                if (isLogin && response.status === 404) {
                    throw new Error('Account not found. Please register.');
                }
                throw new Error(data.detail || 'Authentication failed');
            }

            // Success: Store items and redirect
            console.log("Auth Success:", data.company_name);
            if (isLogin) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('company_id', data.company_id);
                localStorage.setItem('company_name', data.company_name);
                localStorage.setItem('user_email', data.email);

                // Clear any refresh flags if they exist
                sessionStorage.removeItem('just_refreshed');

                navigate('/dashboard');
            } else {
                setSuccessMsg('Registered successfully! Please login now.');
                setIsLogin(true);
                setFormData(prev => ({ ...prev, password: '' }));
            }

        } catch (err) {
            console.error("Auth Error Detail:", err);
            setError(err.message || "Connection to server failed. Please ensure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-md shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">FinSight AI</h1>
                    <p className="text-slate-400">Financial Intelligence for SMEs</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
                            <input
                                type="text"
                                required={!isLogin}
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                placeholder="Acme Corp"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            placeholder="name@company.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {successMsg && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm text-center">
                            {successMsg}
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-between items-center text-sm">
                        <span
                            onClick={async () => {
                                if (!formData.email) {
                                    setError('Please enter your email first to reset password');
                                    return;
                                }
                                setLoading(true);
                                setSuccessMsg('');
                                setError('');
                                try {
                                    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ email: formData.email })
                                    });
                                    const data = await response.json();
                                    if (response.ok) {
                                        setSuccessMsg(data.message);
                                        setError('');
                                    } else {
                                        setError(data.detail || 'Reset failed');
                                    }
                                } catch (err) {
                                    setError('Connection failed');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            className="text-emerald-400 cursor-pointer hover:underline"
                        >
                            Forgot Password?
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>

                    <p className="text-center text-sm text-slate-500 mt-4">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-emerald-400 cursor-pointer hover:underline"
                        >
                            {isLogin ? 'Register' : 'Sign In'}
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
