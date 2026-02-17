import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Layers, User, CheckCircle2 } from 'lucide-react';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const passwordStrength = (pw: string) => {
        if (!pw) return 0;
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return score;
    };

    const strength = passwordStrength(password);
    const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
    const strengthColors = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-400"];
    const strengthTextColors = ["", "text-red-500", "text-yellow-500", "text-blue-500", "text-green-500"];

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');

        if (!name || !email || !password || !confirmPassword) {
            setError('Fill in all fields');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setSubmitting(true);
        try {
            await register(name, email, password);
            navigate('/login');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Registration failed';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0d1b2e] relative overflow-hidden flex-col justify-between p-12">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-20 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
                    <div className="absolute bottom-20 -left-20 w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl" />
                    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid2)" />
                    </svg>
                </div>

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

                <div className="relative space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-white text-4xl font-bold leading-tight">
                            Join your team<br />
                            <span className="text-blue-400">on Nux.</span>
                        </h1>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Set up your account and start managing products, raw materials, and production workflows with your organization.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {[
                            "Manage unlimited products and materials",
                            "Real-time stock level monitoring",
                            "Production suggestion engine",
                            "Role-based access control",
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3">
                                <CheckCircle2 size={16} className="text-blue-400 flex-shrink-0" />
                                <span className="text-slate-300 text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <p className="text-slate-600 text-xs">
                        © 2026 Nux Manufacturing OS. All rights reserved.
                    </p>
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
                            <h2 className="text-[#0d1b2e] text-2xl font-bold">Create your account</h2>
                            <p className="text-slate-500 mt-1 text-sm">Fill in your details to get started</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="text-sm text-slate-700 font-medium" htmlFor="name">Full name</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <User size={16} />
                                    </div>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your full name"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-sm text-slate-700 font-medium" htmlFor="email">Work email</label>
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
                                <label className="text-sm text-slate-700 font-medium" htmlFor="password">Password</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Minimum 8 characters"
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
                                {password && strength > 0 && (
                                    <div className="space-y-1.5 pt-1">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : "bg-slate-200"}`}
                                                />
                                            ))}
                                        </div>
                                        <p className={`text-xs ${strengthTextColors[strength]} font-medium`}>
                                            {strengthLabels[strength]} password
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <label className="text-sm text-slate-700 font-medium" htmlFor="confirmPassword">Confirm password</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        type={showConfirm ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat your password"
                                        className={`w-full pl-10 pr-12 py-3 bg-slate-50 border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all ${confirmPassword && confirmPassword !== password
                                                ? "border-red-300 focus:border-red-400"
                                                : confirmPassword && confirmPassword === password
                                                    ? "border-green-300 focus:border-green-400"
                                                    : "border-slate-200 focus:border-blue-500"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                    >
                                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {confirmPassword && confirmPassword !== password && (
                                    <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Creating account...' : 'Create account'}
                                {!submitting && <ArrowRight size={16} />}
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-500 hover:text-blue-600 transition-colors font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
