import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

export default function ProjectSearchBar({ value, onChange }) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      className="relative flex items-center"
      initial={false}
      animate={{width: focused ? "100%" : "250px",}}
      transition={{ duration: 0.3 }}
    >
      <Search className="absolute left-3 text-gray-400" size={18} />
      <input
        type="text"
        placeholder="Search projects..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pl-10 pr-10 py-2 border rounded-xl 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   transition-all"
      />
      <AnimatePresence>
        {value && (
          <motion.button
            onMouseDown={(e) => {
              e.preventDefault();
              onChange("");
            }}
            className="absolute right-3 text-gray-500 hover:text-red-500"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <X size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}