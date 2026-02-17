import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Layers, BarChart3, Package, Zap } from 'lucide-react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const features = [
        { icon: Package, text: "Full product & materials management" },
        { icon: BarChart3, text: "Real-time inventory tracking" },
        { icon: Zap, text: "Smart production workflows" },
        { icon: Layers, text: "End-to-end manufacturing control" },
    ];

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Fill in all fields');
            return;
        }

        setSubmitting(true);
        try {
            await login(email, password);
            navigate('/products');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Login failed';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0d1b2e] relative overflow-hidden flex-col justify-between p-12">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
                    <div className="absolute top-1/2 -right-20 w-72 h-72 rounded-full bg-blue-500/8 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl" />
                    {/* Grid pattern */}
                    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Logo */}
                <div className="relative">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                            <Layers size={20} className="text-white" />
                        </div>
                        <div>
                            <span className="text-white text-2xl tracking-widest font-bold" style={{ letterSpacing: "0.2em" }}>NUX</span>
                            <p className="text-blue-400 text-xs tracking-wider" style={{ letterSpacing: "0.15em" }}>MANUFACTURING OS</p>
                        </div>
                    </div>
                </div>

                {/* Center content */}
                <div className="relative space-y-10">
                    <div className="space-y-4">
                        <h1 className="text-white text-4xl font-bold leading-tight">
                            Manufacturing<br />
                            <span className="text-blue-400">at scale.</span>
                        </h1>
                        <p className="text-slate-400 text-base leading-relaxed">
                            The complete operations platform for modern manufacturers. Manage inventory, plan production, and track everything in real time.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {features.map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                                    <Icon size={15} className="text-blue-400" />
                                </div>
                                <span className="text-slate-300 text-sm">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <div className="relative">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        All systems operational
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center p-8 bg-[#f8fafc]">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                            <Layers size={20} className="text-white" />
                        </div>
                        <div>
                            <span className="text-[#0d1b2e] text-2xl tracking-widest font-bold" style={{ letterSpacing: "0.2em" }}>NUX</span>
                            <p className="text-blue-500 text-xs tracking-wider" style={{ letterSpacing: "0.15em" }}>MANUFACTURING OS</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
                        <div className="mb-8">
                            <h2 className="text-[#0d1b2e] text-2xl font-bold">Welcome back</h2>
                            <p className="text-slate-500 mt-1 text-sm">Sign in to your account to continue</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-sm text-slate-700 font-medium" htmlFor="email">Email address</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Mail size={16} />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@company.com"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-slate-700 font-medium" htmlFor="password">Password</label>
                                    <a href="#" className="text-xs text-blue-500 hover:text-blue-600 transition-colors">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Signing in...' : 'Sign in'}
                                {!submitting && <ArrowRight size={16} />}
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-blue-500 hover:text-blue-600 transition-colors font-semibold">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
