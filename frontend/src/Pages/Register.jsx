import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { TestTube2, Eye, EyeOff, CheckCircle2, XCircle, Key } from 'lucide-react';
import { motion } from "framer-motion";
import { registerUser } from '../Services/auth';
import { validateKey } from '../Services/auth';

export default function Register() {

    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValidatingKey, setIsValidatingKey] = useState(false);
    const [isKeyVerified, setIsKeyVerified] = useState(false);
    const [keyValidationMessage, setKeyValidationMessage] = useState("");
    const [keyStatus, setKeyStatus] = useState("idle");
    const navigate = useNavigate();

    const validateUsername = (value) => {
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return '';
    };

    const validateName = (value) => {
        if (!value) return 'Full name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        return '';
    };

    const validateEmail = (value) => {
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
    };

    const validatePassword = (value) => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
        return '';
    };

    const validateConfirmPassword = (value) => {
        if (!value) return 'Please confirm your password';
        if (value !== password) return 'Passwords do not match';
        return '';
    };

    const validateApiKey = (value) => {
        if (!value) return 'API key is required';
        if (value.length < 10) return 'API key must be at least 10 characters';
        return '';
    };

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
        validateField(field);
    };

    const validateField = (field) => {
        let error = '';
        switch (field) {
            case 'username':
                error = validateUsername(username);
                break;
            case 'name':
                error = validateName(name);
                break;
            case 'email':
                error = validateEmail(email);
                break;
            case 'password':
                error = validatePassword(password);
                break;
            case 'confirmPassword':
                error = validateConfirmPassword(confirmPassword);
                break;
            case 'apiKey':
                error = validateApiKey(apiKey);
                break;
            default:
                break;
        }
        setErrors({ ...errors, [field]: error });
        return error;
    };

    const validateAll = () => {
        const newErrors = {
            username: validateUsername(username),
            name: validateName(name),
            email: validateEmail(email),
            password: validatePassword(password),
            confirmPassword: validateConfirmPassword(confirmPassword),
            apiKey: validateApiKey(apiKey),
        };
        setErrors(newErrors);
        setTouched({
            username: true,
            name: true,
            email: true,
            password: true,
            confirmPassword: true,
            apiKey: true,
        });
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateAll()) {
            toast.error('Please fix all errors before submitting');
            return;
        }

        if (!isKeyVerified) {
            toast.error("Please validate your Groq API key first");
            return;
        }
        setIsSubmitting(true);
        try {
            const userData = {username, password, name, email, api_key: apiKey, role: 'user',};
            await registerUser(userData);
            toast.success('Account created successfully!');
            navigate("/verify-email", { state: { email: userData.email } });

        } catch (err) {
            const message = err.response?.data?.detail || "Registration failed. Please try again.";
            toast.error(message);

        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyValidation = async (e) => {
        e.preventDefault()
        const error = validateApiKey(apiKey);

        if (error) {
            setErrors({ ...errors, apiKey: error });
            setTouched({ ...touched, apiKey: true });
            return;
        }

        try {
            setIsValidatingKey(true);
            setKeyValidationMessage("");
            setKeyStatus("idle");

            const response = await validateKey({ api_key: apiKey });

            if (response.data.success) {
                setIsKeyVerified(true);
                setKeyStatus("success");
                setKeyValidationMessage("Groq API key verified successfully");
                toast.success("API key verified");
            } else {
                setIsKeyVerified(false);
                setKeyStatus("error");
                setKeyValidationMessage(response.data.message);
                toast.error(response.data.message);
            }

        } catch {
            setIsKeyVerified(false);
            setKeyStatus("error");
            setKeyValidationMessage("Unable to validate API key");
            toast.error("Unable to validate API key");

        } finally {
            setIsValidatingKey(false);
        }
    }

    const getPasswordStrength = () => {
        const checks = [
            password.length >= 8,
            /(?=.*[a-z])/.test(password),
            /(?=.*[A-Z])/.test(password),
            /(?=.*\d)/.test(password),
            /(?=.*[!@#$%^&*])/.test(password),
        ];
        const strength = checks.filter(Boolean).length;
        return { strength, checks };
    };

    const passwordStrength = getPasswordStrength();
    const strengthColor = passwordStrength.strength <= 2 ? 'bg-red-500' : passwordStrength.strength <= 3 ? 'bg-yellow-500' : 'bg-green-500';
    const strengthText = passwordStrength.strength <= 2 ? 'Weak' : passwordStrength.strength <= 3 ? 'Medium' : 'Strong';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="text-center mb-8"
                >
                    <div className="flex justify-center mb-4">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl"
                        >
                            <TestTube2 className="h-8 w-8 text-white" />
                        </motion.div>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">TestLab</h1>
                    <p className="text-gray-600 dark:text-gray-400">AI-Powered QA Assistant</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
                >
                    <h2 className="text-2xl font-semibold mb-6">Create your account</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                        >
                            <label htmlFor="username" className="block text-sm mb-2 font-medium">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onBlur={() => handleBlur('username')}
                                    className={`w-full px-4 py-2 rounded-lg border ${touched.username && errors.username
                                        ? 'border-red-500 focus:ring-red-500'
                                        : touched.username && !errors.username
                                            ? 'border-green-500 focus:ring-green-500'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                        } bg-white dark:bg-gray-700 focus:ring-2 focus:border-transparent outline-none transition`}
                                    placeholder="hariPodo"
                                />
                                {touched.username && (
                                    <div className="absolute right-3 top-2.5">
                                        {errors.username ? (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        ) : (
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {touched.username && errors.username && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-red-500 text-xs mt-1"
                                >
                                    {errors.username}
                                </motion.p>
                            )}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35, duration: 0.3 }}
                        >
                            <label htmlFor="name" className="block text-sm mb-2 font-medium">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onBlur={() => handleBlur('name')}
                                    className={`w-full px-4 py-2 rounded-lg border ${touched.name && errors.name
                                        ? 'border-red-500 focus:ring-red-500'
                                        : touched.name && !errors.name
                                            ? 'border-green-500 focus:ring-green-500'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                        } bg-white dark:bg-gray-700 focus:ring-2 focus:border-transparent outline-none transition`}
                                    placeholder="Haripodo Makhonlal Sorkar"
                                />
                                {touched.name && (
                                    <div className="absolute right-3 top-2.5">
                                        {errors.name ? (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        ) : (
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {touched.name && errors.name && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-red-500 text-xs mt-1"
                                >
                                    {errors.name}
                                </motion.p>
                            )}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                        >
                            <label htmlFor="email" className="block text-sm mb-2 font-medium">
                                Email address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => handleBlur('email')}
                                    className={`w-full px-4 py-2 rounded-lg border ${touched.email && errors.email
                                        ? 'border-red-500 focus:ring-red-500'
                                        : touched.email && !errors.email
                                            ? 'border-green-500 focus:ring-green-500'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                        } bg-white dark:bg-gray-700 focus:ring-2 focus:border-transparent outline-none transition`}
                                    placeholder="haripodo@gmail.com"
                                />
                                {touched.email && (
                                    <div className="absolute right-3 top-2.5">
                                        {errors.email ? (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        ) : (
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {touched.email && errors.email && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-red-500 text-xs mt-1"
                                >
                                    {errors.email}
                                </motion.p>
                            )}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.45, duration: 0.3 }}
                        >
                            <label htmlFor="password" className="block text-sm mb-2 font-medium">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => handleBlur('password')}
                                    className={`w-full px-4 py-2 pr-10 rounded-lg border ${touched.password && errors.password
                                        ? 'border-red-500 focus:ring-red-500'
                                        : touched.password && !errors.password
                                            ? 'border-green-500 focus:ring-green-500'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                        } bg-white dark:bg-gray-700 focus:ring-2 focus:border-transparent outline-none transition`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {touched.password && errors.password && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-red-500 text-xs mt-1"
                                >
                                    {errors.password}
                                </motion.p>
                            )}
                            {password && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-2"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                                className={`h-full ${strengthColor} transition-all duration-300`}
                                            />
                                        </div>
                                        <span className="text-xs font-medium">{strengthText}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Use 8+ characters with uppercase, lowercase, and numbers
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.48, duration: 0.3 }}
                        >
                            <label htmlFor="confirmPassword" className="block text-sm mb-2 font-medium">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onBlur={() => handleBlur('confirmPassword')}
                                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 outline-none transition"
                                    placeholder="••••••••"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {touched.confirmPassword && errors.confirmPassword && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-red-500 text-xs mt-1"
                                >
                                    {errors.confirmPassword}
                                </motion.p>
                            )}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.3 }}
                        >
                            <label htmlFor="apiKey" className="block text-sm mb-2 font-medium">
                                Groq API Key <span className="text-red-500">*</span>
                            </label>

                            <div className="mb-3 rounded-xl border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-3">
                                <div className="flex items-start gap-2">
                                    <Key className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400" />

                                    <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                                        <p className="font-semibold text-sm mb-1">
                                            Connect Your Groq API Key
                                        </p>

                                        <p className="mb-2">
                                            A Groq API key is required to power AI test case and script generation.
                                        </p>

                                        <ol className="list-decimal ml-4 space-y-1 mb-2">
                                            <li>Open Groq Console</li>
                                            <li>Create account</li>
                                            <li>Create API Key</li>
                                            <li>Paste below</li>
                                        </ol>

                                        <a
                                            href="https://console.groq.com/keys"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                        >
                                            Get Free API Key ↗
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <div className="absolute left-3 top-2.5">
                                        <Key className="h-5 w-5 text-gray-400" />
                                    </div>

                                    <input
                                        id="apiKey"
                                        type={showApiKey ? "text" : "password"}
                                        value={apiKey}
                                        onChange={(e) => {
                                            setApiKey(e.target.value);
                                            setIsKeyVerified(false);
                                            setKeyValidationMessage("");
                                            setKeyStatus("idle");
                                        }}
                                        onBlur={() => handleBlur("apiKey")}
                                        className={`w-full pl-10 pr-10 py-2 rounded-lg border ${touched.apiKey && errors.apiKey
                                                ? "border-red-500 focus:ring-red-500"
                                                : isKeyVerified
                                                    ? "border-green-500 focus:ring-green-500"
                                                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                                            } bg-white dark:bg-gray-700 focus:ring-2 focus:border-transparent outline-none transition`}
                                        placeholder="gsk_••••••••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                    >
                                        {showApiKey ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleKeyValidation}
                                    disabled={
                                        isValidatingKey ||
                                        !apiKey.trim() ||
                                        keyStatus === "success"
                                    }
                                    className={`min-w-[120px] px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition ${keyStatus === "success"
                                            ? "bg-green-600 text-white cursor-not-allowed"
                                            : keyStatus === "error"
                                                ? "bg-red-600 text-white"
                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                        } disabled:opacity-90`}
                                >
                                    {isValidatingKey ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 1,
                                                ease: "linear"
                                            }}
                                            className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                                        />
                                    ) : keyStatus === "success" ? (
                                        <>
                                            <CheckCircle2 className="h-4 w-4" />
                                            Verified
                                        </>
                                    ) : keyStatus === "error" ? (
                                        <>
                                            <XCircle className="h-4 w-4" />
                                            Retry
                                        </>
                                    ) : (
                                        "Validate"
                                    )}
                                </button>

                            </div>
                            {touched.apiKey && errors.apiKey && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-red-500 text-xs mt-1"
                                >
                                    {errors.apiKey}
                                </motion.p>
                            )}
                            {keyValidationMessage && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={`text-xs mt-1 ${isKeyVerified
                                        ? "text-green-500"
                                        : "text-red-500"
                                        }`}
                                >
                                    {keyValidationMessage}
                                </motion.p>
                            )}

                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Your key is encrypted and stored securely.
                            </p>
                        </motion.div>
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.3 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting || !isKeyVerified}
                            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                    Creating account...
                                </span>
                            ) : (
                                'Create account'
                            )}
                        </motion.button>
                    </form>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.3 }}
                        className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
                    >
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                            Sign in
                        </Link>
                    </motion.p>
                </motion.div>
            </motion.div>
        </div>
    );
}