import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userVerificationService } from '../Services/verifyUserApi';
import { motion, AnimatePresence } from 'framer-motion';
import { MailCheck, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const OTP_LENGTH = 6;

export default function UserVerificationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || localStorage.getItem("verifyEmail") || '';
    const [otp, setOtp] = useState('');
    const cooldownSteps = [45, 60, 120, 300];
    const [timer, setTimer] = useState(cooldownSteps[0]);
    const [resendCount, setResendCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    useEffect(() => {
        if (!email) {
            toast.error("Session expired. Please register again.");
            navigate("/register");
        }
    }, [email, navigate]);

    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const formattedTime = useMemo(() => {
        const min = String(Math.floor(timer / 60)).padStart(2, '0');
        const sec = String(timer % 60).padStart(2, '0');
        return `${min}:${sec}`;
    }, [timer]);

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH);
        setOtp(value);
    };

    const handleOtpSubmit = async () => {
        if (loading) return;

        if (!otp.trim()) {
            toast.error("OTP is required");
            return;
        }

        if (otp.length !== OTP_LENGTH) {
            toast.error("Enter valid 6-digit OTP");
            return;
        }

        setLoading(true);

        try {
            await userVerificationService.verifyOtp({ email, otp });
            toast.success("Account verified successfully!");
            localStorage.removeItem("verifyEmail");
            navigate("/login");
        } catch (err) {
            const message = err.response?.data?.detail || "Verification failed. Please try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resending || timer > 0) return;

        setResending(true);

        try {
            await userVerificationService.resendOtp({ email });
            toast.success("OTP resent successfully!");
            const nextCooldown = cooldownSteps[Math.min(resendCount, cooldownSteps.length - 1)];
            setTimer(nextCooldown);
            setResendCount((prev) => prev + 1);
            setOtp('');
        } catch (err) {
            const message = err.response?.data?.detail || "OTP resend failed. Please try again.";
            toast.error(message);
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 overflow-hidden relative">
            <motion.div
                className="absolute w-72 h-72 rounded-full bg-blue-100 blur-3xl -top-10 -left-10"
                animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                className="absolute w-72 h-72 rounded-full bg-sky-100 blur-3xl bottom-0 right-0"
                animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-blue-100/60">
                    <div className="p-8">
                        <div className="flex justify-center mb-5">
                            <motion.div
                                whileHover={{ rotate: 8, scale: 1.08 }}
                                whileTap={{ scale: 0.96 }}
                                className="p-4 rounded-2xl bg-blue-50 border border-blue-100"
                            >
                                <MailCheck className="w-8 h-8 text-blue-600" />
                            </motion.div>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 text-center">
                            Verify your email
                        </h1>
                        <p className="text-sm text-slate-600 text-center mt-2">
                            We sent a verification code to
                        </p>
                        <p className="text-sm font-semibold text-blue-600 text-center break-all">
                            {email}
                        </p>
                        <div className="mt-7">
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                                Enter 6-digit OTP
                            </label>
                            <input
                                value={otp}
                                onChange={handleOtpChange}
                                placeholder="••••••"
                                maxLength={OTP_LENGTH}
                                autoFocus
                                className="w-full h-14 px-4 text-center tracking-[0.6em] text-xl rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition"
                            />
                        </div>
                        <div className="mt-5 flex items-center justify-between text-sm">
                            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
                                <CheckCircle2 size={14} />
                                Secure verification powered by TestLab
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={timer}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className="text-slate-600 font-medium"
                                >
                                    {timer > 0 ? formattedTime : 'Ready'}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                        <button
                            onClick={handleOtpSubmit}
                            disabled={loading}
                            className="mt-6 w-full h-12 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition font-semibold flex items-center justify-center disabled:opacity-70 shadow-lg shadow-blue-200"
                        >
                            <motion.div
                                animate={loading ? { rotate: 360 } : { rotate: 0 }}
                                transition={{
                                    repeat: loading ? Infinity : 0,
                                    duration: 1,
                                    ease: 'linear'
                                }}
                                className="mr-2"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </motion.div>
                            {loading ? 'Verifying...' : 'Verify Account'}
                        </button>
                        <button
                            onClick={handleResendOtp}
                            disabled={timer > 0 || resending}
                            className="mt-4 w-full text-sm text-slate-600 hover:text-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition"
                        >
                            <motion.div
                                animate={resending ? { rotate: 360 } : { rotate: 0 }}
                                transition={{
                                    repeat: resending ? Infinity : 0,
                                    duration: 1,
                                    ease: 'linear'
                                }}
                            >
                                <RefreshCw className="w-4 h-4" />
                            </motion.div>
                            {
                                timer > 0
                                    ? `Resend available in ${formattedTime}`
                                    : resending
                                        ? 'Sending...'
                                        : 'Resend Code'
                            }
                        </button>
                        <p className="mt-6 text-center text-xs text-slate-500">
                            Didn’t get it? Check spam or promotions folder.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
