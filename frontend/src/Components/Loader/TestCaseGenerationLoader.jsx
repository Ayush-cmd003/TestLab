import { Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function TestCaseGenerationLoader({ generating = false, title, subtitle,}) {
    const mainTitle = title || (generating ? "Generating Test Cases" : "Loading Test Cases");
    const subText = subtitle || (generating ? "AI is creating structured test cases for your feature." : "Fetching saved test cases and versions.");

    return (
        <div className="h-full flex items-center justify-center bg-slate-50 p-6">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-xl p-8 text-center relative overflow-hidden"
            >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />
                <div className="flex justify-center mb-5">
                    <motion.div
                        animate={{
                            scale: [1, 1.08, 1],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.8,
                        }}
                        className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"
                    >
                        {generating ? (
                            <Sparkles size={28} />
                        ) : (
                            <Loader2
                                size={28}
                                className="animate-spin"
                            />
                        )}
                    </motion.div>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    {mainTitle}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    {subText}
                </p>
                <div className="flex justify-center gap-2 mb-5">
                    {[0, 1, 2].map((dot) => (
                        <motion.div
                            key={dot}
                            animate={{
                                y: [0, -6, 0],
                                opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 0.8,
                                delay: dot * 0.15,
                            }}
                            className="w-2.5 h-2.5 rounded-full bg-blue-500"
                        />
                    ))}
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "220%" }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.4,
                            ease: "linear",
                        }}
                        className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    />
                </div>
            </motion.div>
        </div>
    );
}