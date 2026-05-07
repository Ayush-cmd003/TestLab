import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TestTube2, BookOpen, ChevronDown, ChevronUp, LogOut, UserPen, } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../Context/AuthContext";
import { userService } from "../../Services/usersApi";

export default function AppHeader() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const { logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchUser = async () => {
        try {
            const response = await userService.loggedInUser();
            setUser(response.data);
        } catch {
            console.log("Failed to fetch user");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/projects")}
                    className="group flex items-center gap-3"
                >
                    <motion.div
                        whileHover="hover"
                        initial="rest"
                        animate="rest"
                        className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg"
                    >
                        <motion.div
                            variants={{
                                rest: { rotate: 0 },
                                hover: { rotate: -20 },
                            }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <TestTube2 className="h-5 w-5 text-white" />
                        </motion.div>
                        <motion.div
                            variants={{
                                rest: { y: 0, opacity: 0 },
                                hover: { y: 12, opacity: [1, 0] },
                            }}
                            transition={{ duration: 0.6 }}
                            className="absolute left-1/2 -translate-x-1/2 top-6 w-1.5 h-1.5 bg-blue-300 rounded-full"
                        />
                    </motion.div>
                    <div className="hidden sm:block text-left">
                        <h1 className="text-lg font-bold text-slate-900 leading-none group-hover:text-violet-600 transition">
                            TestLab
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            AI-Powered QA Assistant
                        </p>
                    </div>
                </motion.button>
                <div ref={dropdownRef} className="relative">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="px-3 py-2 rounded-xl hover:bg-slate-100 transition flex items-center gap-2"
                    >
                        <p className="text-sm font-semibold text-slate-800">
                            {user.name}
                        </p>
                        {menuOpen ? (
                            <ChevronUp size={16} className="text-slate-500"/>
                        ) : (
                            <ChevronDown size={16} className="text-slate-500"/>
                        )}
                    </motion.button>
                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                transition={{ duration: 0.18}}
                                className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-30"
                            >
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        navigate("/user-profile");
                                    }}
                                    className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-blue-50 transition flex items-center gap-3"
                                >
                                    <UserPen size={16} />
                                    Profile
                                </button>
                                <button
                                    onClick={() => {
                                        logout();
                                        navigate("/");
                                    }}
                                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-3"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}