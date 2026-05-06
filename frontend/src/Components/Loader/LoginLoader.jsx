import { motion } from "framer-motion";
import { TestTube2, Sparkles } from "lucide-react";

export function LoginLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.35 }}
        className="relative w-[320px] rounded-3xl border border-white/20 bg-white/85 dark:bg-gray-900/85 shadow-2xl backdrop-blur-xl px-8 py-7"
      >
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10"
        />
        <div className="relative flex justify-center">
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
          >
            <TestTube2 className="h-8 w-8 text-white" />
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute inset-0 rounded-2xl border-2 border-blue-400"
            />
          </motion.div>
        </div>
        <div className="relative mt-5 text-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Signing you in
          </h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Preparing your TestLab workspace...
          </p>
        </div>
        <div className="relative mt-6 flex items-center justify-center gap-2">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              animate={{
                y: [0, -8, 0],
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: dot * 0.15,
              }}
              className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
          ))}
        </div>
        <div className="relative mt-6 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <motion.div
            animate={{ x: ["-100%", "220%"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400"
          />
        </div>
        <motion.div
          animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-5 right-5 text-purple-500"
        >
          <Sparkles size={16} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 6, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="absolute bottom-5 left-5 text-blue-500"
        >
          <Sparkles size={14} />
        </motion.div>
      </motion.div>
    </div>
  );
}