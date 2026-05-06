import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ShieldCheck, KeyRound, RefreshCw, Lock, Eye, EyeOff, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { forgotPasswordService } from "../Services/forgetPasswordApi";

export default function ForgotPasswordPage() {
    const cooldownSteps = [45, 60, 120, 300];
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [timer, setTimer] = useState(cooldownSteps[0]);
    const [cooldownIndex, setCooldownIndex] = useState(0);
    const [loadingSend, setLoadingSend] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);
    const [loadingResend, setLoadingResend] = useState(false);
    const [shake, setShake] = useState(false);

    useEffect(() => {
        if (step !== 2) return;
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer, step]);

    const emailError = useMemo(() => {
        if (!email) return "";
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        return valid ? "" : "Enter valid email";
    }, [email]);

    const otpError = useMemo(() => {
        if (!otp) return "";
        return /^\d{6}$/.test(otp) ? "" : "OTP must be exactly 6 digits";
    }, [otp]);

    const passwordError = useMemo(() => {
        if (!password) return "";
        if (password.length < 8) return "Minimum 8 characters";
        if (!/[A-Z]/.test(password)) return "Need 1 uppercase letter";
        if (!/[a-z]/.test(password)) return "Need 1 lowercase letter";
        if (!/\d/.test(password)) return "Need 1 number";
        return "";
    }, [password]);

    const confirmPasswordError = useMemo(() => {
        if (!confirmPassword) return "";
        return password === confirmPassword ? "" : "Passwords do not match";
    }, [password, confirmPassword]);

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    const canSendOtp = email && !emailError && !loadingSend;
    const canReset = email && otp && password && confirmPassword && !emailError && !otpError && !passwordError && !confirmPasswordError && !loadingReset;

    const handleSendOtp = async (e) => {
        e.preventDefault();

        if (!canSendOtp) {
            triggerShake();
            toast.error("Please enter a valid email");
            return;
        }

        try {
            setLoadingSend(true);
            await forgotPasswordService.forgotPassword({ email })
            toast.success("If account exists, OTP has been sent.");
            setStep(2);
            setTimer(cooldownSteps[0]);
            setCooldownIndex(0);
        } catch (err) {
            toast.error(err?.response?.data?.detail || "Unable to send OTP right now");
        } finally {
            setLoadingSend(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!canReset) {
            triggerShake();
            toast.error("Please fix all fields");
            return;
        }

        try {
            setLoadingReset(true);
            await forgotPasswordService.resetPassword({ email, otp, new_password: password });
            toast.success("Password updated successfully");
            setTimeout(() => { window.location.href = "/login"; }, 1000);
        } catch (err) {
            toast.error(err?.response?.data?.detail || "Failed to reset password");
        } finally {
            setLoadingReset(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;

        try {
            setLoadingResend(true);
            await forgotPasswordService.forgotPassword({ email });
            toast.success("OTP resent successfully");
            const nextIndex = cooldownIndex < cooldownSteps.length - 1 ? cooldownIndex + 1 : cooldownIndex;
            setCooldownIndex(nextIndex);
            setTimer(cooldownSteps[nextIndex]);
        } catch (err) {
            toast.error(err?.response?.data?.detail || "Unable to resend OTP");
        } finally {
            setLoadingResend(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-10">
            <motion.div
                initial={{ opacity: 0, y: 25, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="w-full max-w-md"
            >
                <motion.div
                    animate={
                        shake
                            ? { x: [0, -8, 8, -6, 6, 0] }
                            : { x: 0 }
                    }
                    className="bg-white/90 backdrop-blur-xl border border-blue-100 shadow-2xl rounded-3xl p-7"
                >
                    <div className="flex items-center justify-center mb-6">
                        <div className="h-16 w-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
                            <KeyRound size={28} />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center text-slate-800">
                        Forgot Password
                    </h1>
                    <p className="text-center text-sm text-slate-500 mt-2 mb-6">
                        Securely reset your account password
                    </p>
                    <form
                        onSubmit={step === 1 ? handleSendOtp : handleResetPassword} className="space-y-4"
                    >
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3 top-3.5 text-blue-500"
                                />
                                <input
                                    type="email"
                                    value={email}
                                    disabled={step === 2}
                                    onChange={(e) =>
                                        setEmail(e.target.value.trim())
                                    }
                                    placeholder="Enter your email"
                                    className="w-full rounded-xl border border-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none pl-10 pr-3 py-3 transition"
                                />
                            </div>
                            {emailError && (
                                <p className="text-xs text-red-500 mt-1">
                                    {emailError}
                                </p>
                            )}
                        </div>
                        <AnimatePresence mode="wait">
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{opacity: 0,y: 18,}}
                                    animate={{opacity: 1,y: 0,}}
                                    exit={{opacity: 0,y: -12,}}
                                    transition={{duration: 0.28,}}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-1 block">
                                            Verification OTP
                                        </label>
                                        <div className="relative">
                                            <ShieldCheck
                                                size={18}
                                                className="absolute left-3 top-3.5 text-blue-500"
                                            />
                                            <input
                                                type="text"
                                                value={otp}
                                                maxLength={6}
                                                onChange={(e) =>
                                                    setOtp(
                                                        e.target.value.replace(
                                                            /\D/g,
                                                            ""
                                                        )
                                                    )
                                                }
                                                placeholder="Enter 6-digit OTP"
                                                className="tracking-[0.35em] text-center font-semibold w-full rounded-xl border border-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none pl-10 pr-3 py-3 transition"
                                            />
                                        </div>
                                        {otpError && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {otpError}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-1 block">
                                            New Password
                                        </label>

                                        <div className="relative">
                                            <Lock
                                                size={18}
                                                className="absolute left-3 top-3.5 text-blue-500"
                                            />
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter new password"
                                                className="w-full rounded-xl border border-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none pl-10 pr-11 py-3 transition"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="absolute right-3 top-3 text-slate-500"
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>
                                        {passwordError && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {passwordError}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-1 block">
                                            Confirm Password
                                        </label>

                                        <div className="relative">
                                            <Lock
                                                size={18}
                                                className="absolute left-3 top-3.5 text-blue-500"
                                            />
                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={confirmPassword}
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Confirm password"
                                                className="w-full rounded-xl border border-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none pl-10 pr-11 py-3 transition"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                                className="absolute right-3 top-3 text-slate-500"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>
                                        {confirmPasswordError && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {confirmPasswordError}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between text-sm pt-1">
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            disabled={
                                                timer > 0 ||
                                                loadingResend
                                            }
                                            className={`flex items-center gap-2 font-medium transition ${timer > 0
                                                ? "text-slate-400 cursor-not-allowed"
                                                : "text-blue-600 hover:text-blue-700"
                                                }`}
                                        >
                                            <RefreshCw
                                                size={16}
                                                className={
                                                    loadingResend
                                                        ? "animate-spin"
                                                        : ""
                                                }
                                            />
                                            {timer > 0
                                                ? `Resend in ${timer}s`
                                                : "Resend OTP"}
                                        </button>
                                        <span className="text-slate-400">
                                            OTP valid for 3 min
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {step === 1 ? (
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                whileHover={{ scale: 1.01 }}
                                type="submit"
                                disabled={!canSendOtp}
                                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loadingSend
                                    ? "Sending OTP..."
                                    : "Send OTP"}
                            </motion.button>
                        ) : (
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                whileHover={{ scale: 1.01 }}
                                type="submit"
                                disabled={!canReset}
                                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loadingReset
                                    ? "Updating..."
                                    : "Reset Password"}
                            </motion.button>
                        )}
                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    await http.post("/auth/logout");
                                } catch (err) {
                                    toast.error("Logout failed", err);
                                    window.location.href = "/login";
                                }
                            }}
                            className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition pt-1"
                        >
                            <ArrowLeft size={16} />
                            Back to Login
                        </button>
                    </form>
                    <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 size={14} />
                        Secure verification powered by TestLab
                    </div>
                </motion.div>
            </motion.div>
        </div >
    );
}