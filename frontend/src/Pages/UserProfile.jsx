import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, User, KeyRound, ShieldCheck, Save, Eye, EyeOff, Sparkles, Mail, Lock, XCircle } from "lucide-react";
import { userService } from "../Services/usersApi";
import { validateProfile, validatePassword, validateApiKey } from "../Utils/userProfileValidation";
import { Loader } from "../Components/Loader/Loader";

const OTP_LENGTH = 6;

export default function UserProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: "", username: "", email: "", });
    const [originalUser, setOriginalUser] = useState({ name: "", username: "", email: "", });
    const [errors, setErrors] = useState({});
    const [passwords, setPasswords] = useState({ password: "", otp: "", new_password: "" });
    const [apiKey, setApiKey] = useState({ new_api_key: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [savingApiKey, setSavingApiKey] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const cooldownSteps = [45, 60, 120, 300];
    const [timer, setTimer] = useState(cooldownSteps[0]);
    const [cooldownIndex, setCooldownIndex] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [emailOtp, setEmailOtp] = useState("");
    const [emailOtpTimer, setEmailOtpTimer] = useState(45);
    const [canResendEmailOtp, setCanResendEmailOtp] = useState(false);
    const password = passwords.new_password || "";

    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    let strengthText = "Weak";
    let strengthColor = "bg-red-500";

    if (strength >= 4) {
        strengthText = "Strong";
        strengthColor = "bg-green-500";
    } else if (strength >= 2) {
        strengthText = "Medium";
        strengthColor = "bg-yellow-500";
    }

    const passwordStrength = { strength };

    const isProfileChanged =
        user.name !== originalUser.name ||
        user.username !== originalUser.username ||
        user.email !== originalUser.email;

    const fetchUser = async () => {
        setLoading(true);

        try {
            const response = await userService.loggedInUser();
            setUser(response.data);
            setOriginalUser({
                name: response.data.name || "",
                username: response.data.username || "",
                email: response.data.email || "",
            });

        } catch {
            console.log("Failed to fetch user");
        } finally {
            setLoading(false);
        }
    };

    const handleUserUpdate = async (e) => {
        e.preventDefault();
        const validationErrors = validateProfile(user);
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }
        try {
            setSavingProfile(true);

            const payload = {
                name: user.name,
                username: user.username,
                email: user.email
            };

            if (emailOtp) {
                payload.otp = emailOtp;
            }

            const response = await userService.updateUser(payload);

            if (response?.data?.message?.includes("OTP sent")) {
                setEmailOtpSent(true);
                setCanResendEmailOtp(false);
                setEmailOtpTimer(45);
                toast.success("OTP sent to new email");
                return;
            }

            toast.success("Profile updated successfully");
            setEmailOtp("");
            setEmailOtpSent(false);
            setCanResendEmailOtp(false);
            setEmailOtpTimer(45);

            setOriginalUser({
                name: user.name,
                username: user.username,
                email: user.email,
            });
            await fetchUser();

        } catch (err) {
            toast.error(err?.response?.data?.detail || "Failed to update profile", { icon: <XCircle color="red" />, });
        } finally {
            setSavingProfile(false);
        }
    };

    const handleResendEmailOtp = async () => {
        try {
            setSavingProfile(true);
            await userService.updateUser({ email: user.email });
            setCanResendEmailOtp(false);
            setEmailOtpTimer(45);
            toast.success("OTP resent successfully");

        } catch {
            toast.error("Failed to resend OTP");
        } finally {
            setSavingProfile(false);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!passwords.password) {
            toast.error("Please enter current password");
            return;
        }
        try {
            setSavingPassword(true);
            await userService.passwordChangeOtp({ current_password: passwords.password });
            setOtpSent(true);
            setCanResend(false);
            setCooldownIndex(0);
            setTimer(cooldownSteps[0]);
            toast.success("OTP sent to your email");

        } catch {
            toast.error("Failed to send OTP");
        } finally {
            setSavingPassword(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            setSavingPassword(true);
            await userService.passwordChangeOtp({ current_password: passwords.password });
            const nextIndex = cooldownIndex < cooldownSteps.length - 1 ? cooldownIndex + 1 : cooldownIndex;
            setCooldownIndex(nextIndex);
            setTimer(cooldownSteps[nextIndex]);
            setCanResend(false);
            toast.success("OTP resent successfully");

        } catch {
            toast.error("Failed to resend OTP");
        } finally {
            setSavingPassword(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        const validationErrors = validatePassword(passwords);

        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        const passwordData = {
            otp: passwords.otp,
            new_password: passwords.new_password
        };

        try {
            setSavingPassword(true);
            await userService.updatePassword(passwordData);
            toast.success("Password updated successfully");
            setPasswords({
                password: "",
                otp: "",
                new_password: ""
            });

            setOtpSent(false);
            setTimer(cooldownSteps[0]);
            setCooldownIndex(0);
            setCanResend(false);
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);

        } catch {
            toast.error("Failed to update password");
        } finally {
            setSavingPassword(false);
        }
    };

    const handleApiKeyUpdate = async (e) => {
        e.preventDefault();

        const validationErrors = validateApiKey(
            apiKey.new_api_key
        );

        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            toast.error("Please enter a valid API key");
            return;
        }

        try {
            setSavingApiKey(true);
            await userService.updateApiKey({ new_api_key: apiKey.new_api_key });
            toast.success("Api Key updated successfully");
            setApiKey({ new_api_key: "" });

        } catch (err) {
            toast.error(err?.response?.data?.detail || "Failed to update API key");
        } finally {
            setSavingApiKey(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        let interval;
        if (otpSent && !canResend && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);

    }, [otpSent, timer, canResend]);

    useEffect(() => {
        let interval;

        if (emailOtpSent && !canResendEmailOtp && emailOtpTimer > 0) {
            interval = setInterval(() => {
                setEmailOtpTimer((prev) => prev - 1);
            }, 1000);
        }

        if (emailOtpTimer === 0) {
            setCanResendEmailOtp(true);
        }

        return () => clearInterval(interval);

    }, [emailOtpSent, emailOtpTimer, canResendEmailOtp]);

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            {isLoading && <Loader />}

            <div className="max-w-5xl mx-auto space-y-8">

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start justify-between mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            User Profile
                        </h1>

                        <p className="text-slate-500 mt-1">
                            Manage your account settings
                        </p>
                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:shadow-sm transition-all duration-200"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{
                        boxShadow:
                            "0 12px 28px rgba(15,23,42,0.08)",
                    }}
                    transition={{ duration: 0.2 }}
                    className="rounded-3xl bg-white border border-slate-200 p-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <User className="text-blue-600" />

                        <h2 className="text-xl font-semibold text-slate-900">
                            Update Profile
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">

                        <div>
                            <label className="block text-sm mb-2 font-medium">
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={user.name}
                                onChange={(e) =>
                                    setUser({
                                        ...user,
                                        name: e.target.value
                                    })
                                }
                                placeholder="Enter your full name"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 
               dark:border-gray-600 bg-white dark:bg-gray-700 
               focus:ring-2 focus:ring-blue-500 
               outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2 font-medium">
                                Username
                            </label>

                            <input
                                type="text"
                                value={user.username}
                                onChange={(e) =>
                                    setUser({
                                        ...user,
                                        username: e.target.value
                                    })
                                }
                                placeholder="Enter your username"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 
               dark:border-gray-600 bg-white dark:bg-gray-700 
               focus:ring-2 focus:ring-blue-500 
               outline-none transition"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm mb-2 font-medium">
                                Email
                            </label>

                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />

                                <input
                                    type="email"
                                    value={user.email}
                                    onChange={(e) =>
                                        setUser({
                                            ...user,
                                            email: e.target.value
                                        })
                                    }
                                    placeholder="Enter your email"
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 
                 dark:border-gray-600 bg-white dark:bg-gray-700 
                 focus:ring-2 focus:ring-blue-500 
                 outline-none transition"
                                />
                            </div>
                        </div>

                        {emailOtpSent && (
                            <div className="md:col-span-2">
                                <label className="block text-sm mb-2 font-medium">
                                    Enter 6-digit OTP
                                </label>

                                <input
                                    value={emailOtp}
                                    onChange={(e) => setEmailOtp(e.target.value)}
                                    placeholder="Enter OTP sent to new email"
                                    maxLength={OTP_LENGTH}
                                    className="w-full h-14 px-4 text-center tracking-[0.6em] text-xl rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition"
                                />

                                <div className="mt-3 flex justify-end">
                                    {canResendEmailOtp ? (
                                        <button
                                            type="button"
                                            onClick={handleResendEmailOtp}
                                            className="text-sm font-medium text-violet-600 hover:text-violet-700"
                                        >
                                            Resend OTP
                                        </button>
                                    ) : (
                                        <span className="text-sm text-slate-500">
                                            Resend OTP in {emailOtpTimer}s
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <motion.button
                        onClick={handleUserUpdate}
                        disabled={savingProfile || !isProfileChanged}
                        whileHover={{
                            opacity:
                                savingProfile || !isProfileChanged
                                    ? 1
                                    : 0.94,
                        }}
                        transition={{ duration: 0.18 }}
                        className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold flex items-center justify-center gap-2 shadow-md disabled:cursor-not-allowed"
                    >
                        {savingProfile ? (
                            <>
                                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Save size={17} />
                                {emailOtpSent
                                    ? "Verify Email & Update Profile"
                                    : "Save Profile"}
                            </>
                        )}
                    </motion.button>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{
                            boxShadow:
                                "0 12px 28px rgba(15,23,42,0.08)",
                        }}
                        transition={{ duration: 0.2 }}
                        className="rounded-3xl bg-white border border-slate-200 p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Lock className="text-emerald-600" />

                            <h2 className="text-xl font-semibold text-slate-900">
                                Update Password
                            </h2>
                        </div>

                        <div className="mt-5 relative">
                            <div className="mt-5">
                                <label className="block text-sm mb-2 font-medium">
                                    Current Password
                                </label>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={passwords.password}
                                        onChange={(e) =>
                                            setPasswords({
                                                ...passwords,
                                                password: e.target.value
                                            })
                                        }
                                        placeholder="Enter current password"
                                        className="w-full px-4 pr-10 py-2 rounded-lg border border-gray-300 
                 dark:border-gray-600 bg-white dark:bg-gray-700 
                 focus:ring-2 focus:ring-blue-500 
                 outline-none transition"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {otpSent && (
                            <>
                                <div className="mt-5">
                                    <label className="block text-sm mb-2 font-medium">
                                        Enter 6-digit OTP
                                    </label>

                                    <input
                                        value={passwords.otp}
                                        onChange={(e) =>
                                            setPasswords({
                                                ...passwords,
                                                otp: e.target.value
                                            })
                                        }
                                        placeholder="Enter OTP"
                                        maxLength={OTP_LENGTH}
                                        className="w-full h-14 px-4 text-center tracking-[0.6em] text-xl rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition"
                                    />
                                </div>

                                <div className="mt-5 relative">
                                    <label className="block text-sm mb-2 font-medium">
                                        New Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={passwords.new_password}
                                            onChange={(e) =>
                                                setPasswords({
                                                    ...passwords,
                                                    new_password: e.target.value
                                                })
                                            }
                                            placeholder="Enter new password"
                                            className="w-full px-4 pr-10 py-2 rounded-lg border border-gray-300 
                   dark:border-gray-600 bg-white dark:bg-gray-700 
                   focus:ring-2 focus:ring-blue-500 
                   outline-none transition"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    {passwords.new_password && (
                                        <div className="mt-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                                    <div
                                                        style={{
                                                            width: `${(passwordStrength.strength / 5) * 100}%`
                                                        }}
                                                        className={`h-full ${strengthColor} transition-all duration-300`}
                                                    />
                                                </div>

                                                <span className="text-xs font-medium">
                                                    {strengthText}
                                                </span>
                                            </div>

                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Use 8+ characters with uppercase, lowercase, and numbers
                                            </p>
                                            <p className="mt-6 text-center text-xs text-slate-500">
                                                Didn’t get it? Check spam or promotions folder.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex justify-end">
                                    {canResend ? (
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            className="text-sm font-medium text-violet-600 hover:text-violet-700 transition"
                                        >
                                            Resend OTP
                                        </button>
                                    ) : (
                                        <span className="text-sm text-slate-500">
                                            Resend OTP in {timer}s
                                        </span>
                                    )}
                                </div>
                            </>
                        )}

                        <motion.button
                            onClick={
                                otpSent
                                    ? handlePasswordUpdate
                                    : handleSendOtp
                            }
                            disabled={savingPassword}
                            whileHover={{
                                opacity: savingPassword ? 1 : 0.94,
                            }}
                            transition={{ duration: 0.18 }}
                            className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold flex items-center justify-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {savingPassword ? (
                                <>
                                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Sending OTP...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={17} />
                                    {otpSent
                                        ? "Update Password"
                                        : "Send OTP"}
                                </>
                            )}
                        </motion.button>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{
                            boxShadow:
                                "0 12px 28px rgba(15,23,42,0.08)",
                        }}
                        transition={{ duration: 0.2 }}
                        className="rounded-3xl bg-white border border-slate-200 p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <KeyRound className="text-violet-600" />

                            <h2 className="text-xl font-semibold text-slate-900">
                                API Key
                            </h2>
                        </div>

                        <div className="relative">
                            <label className="block text-sm mb-2 font-medium">
                                Secret Key
                            </label>

                            <div className="relative">
                                <input
                                    type={showApiKey ? "text" : "password"}
                                    value={apiKey.new_api_key}
                                    onChange={(e) =>
                                        setApiKey({
                                            ...apiKey,
                                            new_api_key: e.target.value
                                        })
                                    }
                                    placeholder="Enter new api key"
                                    className="w-full px-4 pr-10 py-2 rounded-lg border border-gray-300 
                 dark:border-gray-600 bg-white dark:bg-gray-700 
                 focus:ring-2 focus:ring-blue-500 
                 outline-none transition"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowApiKey(!showApiKey)}
                                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                >
                                    {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            onClick={handleApiKeyUpdate}
                            disabled={savingApiKey}
                            whileHover={{
                                opacity: savingApiKey ? 1 : 0.94,
                            }}
                            transition={{ duration: 0.18 }}
                            className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold flex items-center justify-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {savingApiKey ? (
                                <>
                                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={17} />
                                    Update API Key
                                </>
                            )}
                        </motion.button>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}