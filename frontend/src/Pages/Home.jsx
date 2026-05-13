import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Bot, Zap, FileText, CheckCircle2, ArrowRight, GitBranch, Mail, LayoutDashboard, TestTube2, Workflow, } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";;

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.12,
            duration: 0.7,
            ease: "easeOut",
        },
    }),
};

const features = [
    {
        icon: Bot,
        title: "AI Test Case Generation",
        desc: "Generate functional, negative, edge-case, API, UI, and validation test cases using AI.",
    },
    {
        icon: Workflow,
        title: "Automation Script Templates",
        desc: "Generate automation-ready script templates using Playwright, Selenium, Cypress, Pytest, and more.",
    },
    {
        icon: ShieldCheck,
        title: "Secure Backend Architecture",
        desc: "Groq API communication happens securely through the backend using protected server-side requests.",
    },
    {
        icon: LayoutDashboard,
        title: "Project & Feature Management",
        desc: "Organize projects, features, QA workflows, test assets, and generated automation scripts.",
    },
    {
        icon: Zap,
        title: "Fast AI Workflows",
        desc: "Generate test cases and automation templates instantly with optimized AI workflows.",
    },
    {
        icon: TestTube2,
        title: "Modern QA Experience",
        desc: "Built with React, Framer Motion, Sonner, and FastAPI for a fast and beautiful testing experience.",
    },
];

export default function LandingPage() {

    const navigate = useNavigate();

    return (
        <div className="min-h-dvh bg-white text-slate-900 overflow-x-hidden">
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 20, 0],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute top-[-120px] left-[-120px] h-[420px] w-[420px] rounded-full bg-blue-200 blur-3xl opacity-40"
                />
                <motion.div
                    animate={{
                        scale: [1.1, 1, 1.1],
                        rotate: [0, -15, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute bottom-[-150px] right-[-100px] h-[420px] w-[420px] rounded-full bg-cyan-200 blur-3xl opacity-40"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#2563eb0d_1px,transparent_1px),linear-gradient(to_bottom,#2563eb0d_1px,transparent_1px)] bg-[size:70px_70px]" />
            </div>
            <nav className="w-full px-4 sm:px-6 md:px-12 py-5 md:py-6 flex items-center justify-between backdrop-blur-xl">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
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
                            <TestTube2 className="h-10 w-10 text-white" />
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

                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900">
                            Test
                            <span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                                Lab
                            </span>
                        </h1>

                        <p className="text-l text-slate-500">
                            AI-Powered QA Assistant
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden md:flex items-center gap-8 text-lg font-medium"
                >
                    <a
                        href="/docs"
                        className="text-slate-600 hover:text-blue-600 transition"
                    >
                        Docs
                    </a>

                    <a
                        href="#features"
                        className="text-slate-600 hover:text-blue-600 transition"
                    >
                        Features
                    </a>

                    <a
                        href="#workflow"
                        className="text-slate-600 hover:text-blue-600 transition"
                    >
                        Workflow
                    </a>
                    <a
                        href="#tech"
                        className="text-slate-600 hover:text-blue-600 transition"
                    >
                        Technology
                    </a>

                    <button
                        onClick={() => {
                            navigate("/login");
                            toast.success("Welcome to TestLab...")
                        }}
                        className="group w-full sm:w-auto justify-center px-6 sm:px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-xl shadow-blue-300 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                        Launch TestLab
                        <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition"
                        />
                    </button>
                </motion.div>
            </nav>
            <section className="relative px-4 sm:px-6 md:px-12 pt-2 sm:pt-4 md:pt-8 pb-20 md:pb-28">
                <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 xl:gap-20 items-center min-h-[calc(80dvh-120px)]">
                    <div>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-8"
                        >
                            <Sparkles className="text-blue-600" size={16} />

                            <span className="text-sm font-medium text-blue-700">
                                Welcome to TestLab - Your AI-Powered QA Assistant!
                            </span>
                        </motion.div>
                        <motion.h1
                            custom={1}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl font-black leading-[1.05] tracking-tight"
                        >
                            Test Smarter <br />
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                Ship Faster
                            </span>
                        </motion.h1>

                        <motion.p
                            custom={2}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            className="mt-6 md:mt-8 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl"
                        >
                            TestLab is an AI-powered QA automation platform that helps teams generate intelligent test cases, organize testing workflows, and create automation-ready test script templates instantly.
                        </motion.p>
                        <motion.div
                            custom={3}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            className="mt-10 flex flex-wrap gap-4"
                        >
                            <button
                                onClick={() => {
                                    navigate("/login");
                                    toast.success("Welcome to TestLab...")
                                }}
                                className="group w-full sm:w-auto justify-center px-6 sm:px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-xl shadow-blue-300 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                            >
                                Get Started
                                <ArrowRight
                                    size={18}
                                    className="group-hover:translate-x-1 transition"
                                />
                            </button>
                            <button
                                onClick={() => {
                                    navigate("/docs");
                                    toast.info("Redirecting to documentation...");
                                }}
                                className="w-full sm:w-auto justify-center px-6 sm:px-7 py-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold flex items-center gap-2 shadow-sm hover:scale-105 transition-all duration-300"
                            >
                                <FileText size={20} />
                                Documentation
                            </button>
                        </motion.div>
                        <motion.div
                            custom={4}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle2
                                    size={18}
                                    className="text-blue-600"
                                />
                                AI Test Case Generation
                            </div>

                            <div className="flex items-center gap-2">
                                <CheckCircle2
                                    size={18}
                                    className="text-blue-600"
                                />
                                Script Template Generation
                            </div>

                            <div className="flex items-center gap-2">
                                <CheckCircle2
                                    size={18}
                                    className="text-blue-600"
                                />
                                Secure Groq Integration
                            </div>

                            <div className="flex items-center gap-2">
                                <CheckCircle2
                                    size={18}
                                    className="text-blue-600"
                                />
                                JWT Authentication
                            </div>
                        </motion.div>
                    </div>
                    <motion.div
                        whileHover={{
                            y: -8,
                            rotateX: 2,
                            rotateY: 2,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 180,
                            damping: 18,
                        }}
                        className="relative w-full max-w-[720px] mx-auto will-change-transform"
                    >
                        <div className="relative rounded-[28px] sm:rounded-[36px] transition-all duration-500 hover:shadow-[0_30px_80px_rgba(59,130,246,0.25)] border border-blue-100 bg-white/80 backdrop-blur-2xl shadow-2xl shadow-blue-100 p-6">
                            <div className="space-y-5">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white shadow-xl"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-3xl font-black mt-2">
                                                AI Powered Testing
                                            </h2>
                                        </div>

                                        <Bot size={52} />
                                    </div>
                                </motion.div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        "Functional Testing",
                                        "Negative Scenarios",
                                        "API Testing",
                                        "Automation Scripts",
                                    ].map((item, index) => (
                                        <motion.div
                                            key={item}
                                            whileHover={{
                                                y: -6,
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 200,
                                            }}
                                            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-md"
                                        >
                                            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                                                <Zap
                                                    size={18}
                                                    className="text-blue-600"
                                                />
                                            </div>

                                            <p className="font-semibold text-slate-700">
                                                {item}
                                            </p>

                                            <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: `${70 + index * 5}%`,
                                                    }}
                                                    transition={{
                                                        delay: index * 0.3,
                                                        duration: 1.2,
                                                    }}
                                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
            <section
                id="features"
                className="px-4 sm:px-6 md:px-12 pb-28"
            >
                <div className="max-w-[1400px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black">
                            Built for Modern QA Teams
                        </h2>

                        <p className="mt-5 text-slate-600 max-w-2xl mx-auto text-lg">
                            Everything needed to generate intelligent test cases,
                            manage workflows, and automate testing faster.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: index * 0.08,
                                        duration: 0.6,
                                    }}
                                    whileHover={{
                                        y: -10,
                                    }}
                                    className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-100 bg-white p-8 shadow-lg hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition duration-500" />

                                    <div className="relative">
                                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-200">
                                            <Icon
                                                className="text-white"
                                                size={26}
                                            />
                                        </div>

                                        <h3 className="mt-6 text-2xl font-bold">
                                            {feature.title}
                                        </h3>

                                        <p className="mt-4 text-slate-600 leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
            <section
                id="workflow"
                className="px-4 sm:px-6 md:px-12 pb-28"
            >
                <div className="max-w-[1400px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black">
                            How Testopia Works
                        </h2>

                        <p className="mt-5 text-slate-600 max-w-3xl mx-auto text-lg">
                            Generate intelligent test cases and automation-ready
                            script templates in a few simple steps.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {[
                            {
                                step: "01",
                                title: "Create Project",
                                desc: "Organize testing workflows by creating projects and features.",
                            },
                            {
                                step: "02",
                                title: "Add AI Context",
                                desc: "Provide feature descriptions, AI instructions, and supporting PDFs.",
                            },
                            {
                                step: "03",
                                title: "Generate Test Cases",
                                desc: "AI generates functional, edge-case, negative, and validation scenarios.",
                            },
                            {
                                step: "04",
                                title: "Generate Scripts",
                                desc: "Create automation-ready templates using Playwright, Selenium, Cypress, and more.",
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: index * 0.1,
                                    duration: 0.6,
                                }}
                                whileHover={{ y: -8 }}
                                className="rounded-3xl border border-slate-100 bg-white p-8 shadow-lg hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500"
                            >
                                <div className="text-5xl font-black text-blue-100">
                                    {item.step}
                                </div>

                                <h3 className="mt-6 text-2xl font-bold">
                                    {item.title}
                                </h3>

                                <p className="mt-4 text-slate-600 leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <section
                id="tech"
                className="px-4 sm:px-6 md:px-12 pb-28"
            >
                <div className="max-w-[1400px] mx-auto">
                    <div className="rounded-[32px] border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 md:p-14">
                        <div className="text-center">
                            <h2 className="text-4xl md:text-5xl font-black">
                                Built With Modern Technologies
                            </h2>

                            <p className="mt-5 text-slate-600 text-lg max-w-3xl mx-auto">
                                Testopia combines AI, automation, and modern frontend/backend technologies into one unified QA platform.
                            </p>
                        </div>

                        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
                            {[
                                "React",
                                "FastAPI",
                                "Supabase",
                                "Groq AI",
                                "Framer Motion",
                                "Tailwind CSS",
                                "SQLAlchemy",
                                "Playwright",
                                "Selenium",
                                "Cypress",
                            ].map((tech) => (
                                <motion.div
                                    key={tech}
                                    whileHover={{ scale: 1.05 }}
                                    className="rounded-2xl bg-white border border-white/60 shadow-md px-6 py-5 text-center font-semibold text-slate-700"
                                >
                                    {tech}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <section className="px-4 sm:px-6 md:px-12 pb-24">
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="max-w-6xl mx-auto rounded-[28px] sm:rounded-[40px] overflow-hidden relative border border-blue-100 bg-gradient-to-r from-blue-600 to-cyan-500 p-12 md:p-16 shadow-2xl shadow-blue-200"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_35%)]" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                                Build Smarter QA Workflows With AI
                            </h2>

                            <p className="mt-5 text-blue-100 text-lg max-w-2xl">
                                Generate intelligent test cases,
                                automation-ready scripts, and modern QA workflows —
                                all from one centralized AI-powered platform.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>
            <footer
                id="contact"
                className="border-t border-slate-100 px-4 sm:px-6 md:px-12 py-10"
            >
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-black">
                            TestLab
                        </h2>

                        <p className="text-slate-500 mt-1">
                            Your AI-Powered QA Assistant
                        </p>
                    </div>

                    <div className="flex items-center gap-5">
                        <motion.a
                            whileHover={{ y: -3 }}
                            href="https://github.com/Ayush-cmd003/TestLab.git"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                                toast.info("Redirecting to TestLab GitHub Repository...");
                            }}
                            className="h-12 w-12 rounded-2xl border border-slate-200 flex items-center justify-center hover:bg-blue-50 transition"
                        >
                            <GitBranch size={20} />
                        </motion.a>

                        <motion.a
                            whileHover={{ y: -3 }}
                            onClick={() => {
                                toast.info("Coming soon...");
                            }}
                            className="h-12 w-12 rounded-2xl border border-slate-200 flex items-center justify-center hover:bg-blue-50 transition cursor-pointer"
                        >
                            <Mail size={20} />
                        </motion.a>
                    </div>
                </div>
            </footer>
        </div>
    );
}