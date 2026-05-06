import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { TestTube2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../Context/AuthContext';
import { loginUser } from '../Services/auth';
import { LoginLoader } from '../Components/Loader/LoginLoader';

export function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isAuth } = useAuth();

  useEffect(() => {
    if (isAuth) {
      navigate("/projects", { replace: true });
    }
  }, [isAuth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};

    if (!form.username.trim()) {
      errors.username = "Username is required";
    }

    if (!form.password.trim()) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      if (errors.username) {
        toast.error("Validation Error", {
          description: errors.username,
        });
      }

      if (errors.password) {
        toast.error("Validation Error", {
          description: errors.password,
        });
      }

      return;
    }

    setLoading(true);

    try {
      await loginUser(form.username, form.password);
      login()
      toast.success("Login Successful");
      navigate("/projects", { replace: true });
    } catch (error) {
      const message = error?.response?.data?.detail || "Login failed. Please check your credentials.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 relative overflow-hidden">
      {isLoading && <LoginLoader />}
      <div className="absolute top-10 left-10 w-60 h-60 bg-blue-500/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-purple-500/10 blur-3xl rounded-full"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg"
            >
              <TestTube2 className="h-8 w-8 text-white" />
            </motion.div>
          </div>

          <h1 className="text-3xl font-bold mb-2">TestLab</h1>

          <p className="text-gray-600 dark:text-gray-400">
            AI-Powered QA Assistant
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
        >

          <h2 className="text-2xl font-semibold mb-6">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <label
                htmlFor="username"
                className="block text-sm mb-2 font-medium"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={form.username}
                disabled={isLoading}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Enter username"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <label
                htmlFor="password"
                className="block text-sm mb-2 font-medium"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  disabled={isLoading}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />

                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  whileTap={{ scale: 0.85 }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </motion.button>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear"
                    }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </motion.button>

          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              Sign up
            </Link>
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400"
          >
            Forgot your password?{" "}
            <Link
              to="/forget-password"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              Forget Password
            </Link>
          </motion.p>

        </motion.div>
      </motion.div>
    </div>
  );
}