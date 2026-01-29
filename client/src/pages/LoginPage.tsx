import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ShieldCheck, Activity, User, Mail, Lock } from 'lucide-react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true); // Toggle State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '' // Added department field
    });
    const [isGovEmployee, setIsGovEmployee] = useState(false); // Added toggle for Gov Employee
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        const url = `http://localhost:3001${endpoint}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    isGovEmployee // Send boolean flag
                }),
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    login(data.token, data.user);
                    navigate('/projects');
                } else {
                    // Auto-switch to login or auto-login after signup
                    alert('Account created! Please sign in.');
                    setIsLogin(true);
                    setFormData(prev => ({ ...prev, password: '' })); // Clear password
                }
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen overflow-hidden lg:grid lg:grid-cols-2">

            {/* LEFT SIDE - FORM SECTION */}
            <div className="flex flex-col items-center justify-center h-full w-full bg-background px-4 sm:px-6 lg:px-12 relative">

                {/* Scrollable Container for smaller screens if needed, otherwise centered */}
                <div className="w-full max-w-[380px] flex flex-col justify-center space-y-6 animate-in slide-in-from-left-4 fade-in duration-500">

                    {/* Header */}
                    <div className="flex flex-col space-y-2 text-left">
                        <div className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 w-fit cursor-pointer">
                            GovTransparency
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground transition-all">
                            {isLogin ? "Welcome back" : "Create an account"}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {isLogin
                                ? "Enter your credentials to access the ledger."
                                : "Sign up to track projects and ensure accountability."}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive font-medium border border-destructive/20 animate-in fade-in">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="grid gap-4">

                        {/* Name Field (Signup Only) */}
                        {!isLogin && (
                            <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="text-sm font-medium leading-none">Full Name</label>
                                <div className="relative">
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="flex h-11 w-full rounded-lg border border-input bg-transparent pl-10 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                        required={!isLogin}
                                    />
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        )}

                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none">Email</label>
                            <div className="relative">
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="flex h-11 w-full rounded-lg border border-input bg-transparent pl-10 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    required
                                />
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium leading-none">Password</label>
                            </div>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="flex h-11 w-full rounded-lg border border-input bg-transparent pl-10 pr-10 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    required
                                />
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>



                        {/* Gov Employee Toggle and Department Field (Signup Only) */}
                        {!isLogin && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-400">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="isGovEmployee"
                                        checked={isGovEmployee}
                                        onChange={(e) => setIsGovEmployee(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="isGovEmployee" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        I am a Government Employee
                                    </label>
                                </div>

                                {isGovEmployee && (
                                    <div className="grid gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                        <label className="text-sm font-medium leading-none">Department</label>
                                        <div className="relative">
                                            <input
                                                name="department"
                                                type="text"
                                                placeholder="e.g. Public Works"
                                                value={formData.department}
                                                onChange={handleChange}
                                                className="flex h-11 w-full rounded-lg border border-input bg-transparent pl-10 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                                required={isGovEmployee}
                                            />
                                            <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 mt-2 text-md rounded-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                        </Button>
                    </form>

                    {/* Toggle Section */}
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                {isLogin ? 'New to platform?' : 'Returning user?'}
                            </span>
                        </div>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                        </span>
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setFormData({ name: '', email: '', password: '', department: '' });
                                setIsGovEmployee(false);
                            }}
                            className="font-semibold text-primary hover:underline focus:outline-none"
                        >
                            {isLogin ? "Register now" : "Sign in"}
                        </button>
                    </div>
                </div>
            </div >

            {/* RIGHT SIDE - HERO VISUALS */}
            < div className="hidden lg:flex flex-col items-center justify-center h-full relative overflow-hidden bg-muted" >
                {/* Background Gradient */}
                < div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-90" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                {/* Content */}
                <div className="relative z-10 p-12 text-center text-white max-w-lg animate-in zoom-in duration-700">
                    {/* Dynamic Icon based on State */}
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-2xl mx-auto flex items-center justify-center mb-8 shadow-2xl border border-white/20">
                        {isLogin ? (
                            <ShieldCheck size={48} className="text-white drop-shadow-md" />
                        ) : (
                            <Activity size={48} className="text-white drop-shadow-md" />
                        )}
                    </div>

                    <h2 className="text-4xl font-bold mb-6 tracking-tight">
                        {isLogin ? "Transparency for Everyone" : "Join the Movement"}
                    </h2>
                    <p className="text-lg text-blue-100 leading-relaxed mb-10">
                        {isLogin
                            ? "Secure, immutable, and open. Access the official government project ledger and track progress in real-time."
                            : "Be the change. Create an account to monitor funds, report issues, and ensure public accountability."
                        }
                    </p>

                    {/* Visual Card */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500 max-w-xs mx-auto">
                        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                <span className="text-xs font-mono text-blue-100">SYSTEM STATUS</span>
                            </div>
                            <span className="text-xs font-bold text-green-300 px-2 py-1 bg-green-500/20 rounded-full">OPERATIONAL</span>
                        </div>
                        <div className="space-y-3">
                            <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
                            <div className="h-2 bg-white/20 rounded-full w-1/2"></div>
                            <div className="h-2 bg-white/10 rounded-full w-full mt-4"></div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}