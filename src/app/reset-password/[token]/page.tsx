'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, ArrowRight, ShieldAlert, CheckCircle2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();
    const params = useParams();
    const token = params.token as string;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                toast.success('Password updated', {
                    description: 'Your password has been reset successfully.',
                });
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setError(data.message || 'Invalid or expired token.');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-navy relative overflow-hidden font-display">
            {/* Background */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -ml-64 -mb-64 animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full relative z-10 px-6"
            >
                <div className="glass-premium p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-50" />

                    {!success ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/10 mb-6 relative group-hover:border-gold/30 transition-all duration-500">
                                    <Shield className="w-10 h-10 text-gold drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
                                    <div className="absolute -inset-2 bg-gold/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Set New Password</h2>
                                <p className="text-sm text-white/40 font-medium">Please enter your new secure password</p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
                                        >
                                            <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0" />
                                            <p className="text-xs font-bold text-red-200">{error}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">New Password</label>
                                        <div className="relative group/field">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/field:text-gold transition-colors">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl pl-12 pr-12 py-4 text-sm font-medium focus:outline-none focus:border-gold/50 focus:bg-white/[0.06] transition-all"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Confirm Password</label>
                                        <div className="relative group/field">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/field:text-gold transition-colors">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:outline-none focus:border-gold/50 focus:bg-white/[0.06] transition-all"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full group relative flex items-center justify-center gap-3 py-5 rounded-3xl text-sm font-black uppercase tracking-[0.2em] transition-all overflow-hidden ${loading
                                        ? 'bg-white/10 text-white/40 border border-white/10 cursor-not-allowed'
                                        : 'bg-gold text-navy border border-gold shadow-[0_0_30px_rgba(255,215,0,0.2)] hover:shadow-[0_0_50px_rgba(255,215,0,0.3)] hover:-translate-y-1 active:translate-y-0'
                                        }`}
                                >
                                    <div className="relative z-10 flex items-center gap-3">
                                        {loading ? 'Updating...' : 'Set Password'}
                                        {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                    </div>
                                    {!loading && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-green-500/10 border border-green-500/20 mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Success!</h2>
                            <p className="text-sm text-white/40 font-medium mb-8 leading-relaxed">
                                Your password has been successfully updated. Redirecting you to the login page...
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-xs font-black text-gold uppercase tracking-[0.2em] hover:text-gold/80 transition-colors"
                            >
                                <ArrowRight className="w-4 h-4" />
                                Go to login now
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}