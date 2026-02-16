import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import { authService } from '../../redux/api/authService';
import { X, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthModal = ({ mode, onClose, setMode, initialEmail = '' }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        name: '',
        email: initialEmail,
        password: '',
        role: 'student'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginStart());

        try {
            let data;
            if (mode === 'login') {
                data = await authService.login({ email: formData.email, password: formData.password });
                toast.success(`Welcome back, ${data.user.name}!`);
            } else {
                data = await authService.signup(formData);
                toast.success(`Account created! Welcome, ${data.user.name}!`);
            }
            dispatch(loginSuccess(data));
            onClose();
        } catch (err) {
            console.error("Auth Error:", err);
            // Try to extract the error message from various possible locations in the response
            const message =
                err.response?.data?.error ||
                (err.response?.data?.errors && err.response.data.errors.length > 0 ? err.response.data.errors[0].msg : null) ||
                err.response?.data?.message ||
                err.message ||
                'Authentication failed. Please try again.';

            dispatch(loginFailure(message));
            toast.error(message);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold tracking-tight">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                            {mode === 'login' ? 'Enter your details to sign in' : 'Start your productivity journey today'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="John Doe"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 hover:border-blue-500/50 transition-all outline-none font-medium text-slate-900 dark:text-white"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 hover:border-blue-500/50 transition-all outline-none font-medium text-slate-900 dark:text-white"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 hover:border-blue-500/50 transition-all outline-none font-medium text-slate-900 dark:text-white"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-xl shadow-blue-500/25 active:scale-[0.98]"
                        >
                            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                            className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors uppercase tracking-widest"
                        >
                            {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
