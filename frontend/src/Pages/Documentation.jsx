import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Menu, X, ShieldCheck, Database, Server, Lock, CheckCircle2, ChevronRight, Info, OctagonX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const sections = [
    "Introduction",
    "Quick Start",
    "Authentication Flow",
    "Project Workflow",
    "Feature Workflow",
    "Document Upload Workflow",
    "Test Case Workflow",
    "Script Generation Workflow",
    "Existing Script Detection",
];

const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: {
        duration: 0.25,
    },
};

function SectionTitle({ title, desc }) {
    return (
        <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
                {title}
            </h1>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600 max-w-4xl">
                {desc}
            </p>
        </div>
    );
}

function InfoBox({ title, children }) {
    return (
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
            <div className="flex items-center gap-3">
                <Info className="text-blue-600" size={22} />

                <h3 className="font-bold text-blue-900">
                    {title}
                </h3>
            </div>

            <div className="mt-4 text-slate-700 leading-relaxed space-y-4">
                {children}
            </div>
        </div>
    );
}

function StepCard({ step, title, children }) {
    return (
        <div className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 md:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                    {step}
                </div>

                <div>
                    <h3 className="text-2xl font-bold">
                        {title}
                    </h3>

                    <div className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed space-y-4 break-words">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Documentation() {
    const [activeSection, setActiveSection] =
        useState("Introduction");

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navigate = useNavigate();

    const renderContent = () => {
        switch (activeSection) {
            case "Introduction":
                return (
                    <motion.section
                        key="Introduction"
                        {...pageTransition}
                        className="space-y-10"
                    >
                        <SectionTitle
                            title="Introduction"
                            desc="TestLab is an AI-powered QA platform designed to simplify software testing workflows. The platform helps users generate intelligent test cases and automation-ready script templates using AI."
                        />

                        <div className="rounded-[32px] bg-gradient-to-r from-blue-600 to-cyan-500 p-5 sm:p-6 md:p-8 md:p-10 text-white">
                            <h2 className="text-3xl font-black">
                                What TestLab Does ?
                            </h2>

                            <div className="mt-8 grid md:grid-cols-2 gap-5">
                                {[
                                    "Generate AI-powered test cases",
                                    "Generate automation-ready script templates",
                                    "Manage projects and features",
                                    "Upload PDFs for AI context",
                                    "Version test cases",
                                    "Switch frameworks and languages",
                                    "Download Excel reports",
                                    "Regenerate scripts instantly",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-3 text-blue-100"
                                    >
                                        <CheckCircle2 size={18} />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <InfoBox title="How The Platform Works ?">
                            <p>
                                TestLab combines multiple types of information before sending requests to the AI model.
                            </p>

                            <p>
                                The AI uses:
                            </p>

                            <ul className="space-y-2">
                                <li>• Project name and description</li>
                                <li>• Feature name and description</li>
                                <li>• AI instructions</li>
                                <li>• Uploaded PDF documents</li>
                            </ul>

                            <p>
                                to generate intelligent software testing scenarios and automation-ready script templates.
                            </p>
                        </InfoBox>
                    </motion.section>
                );

            case "Authentication Flow":
                return (
                    <motion.section
                        key="Authentication Flow"
                        {...pageTransition}
                        className="space-y-8"
                    >
                        <SectionTitle
                            title="Authentication Flow"
                            desc="Before using the platform, users must create an account and complete the verification process."
                        />

                        <StepCard
                            step="1"
                            title="API Key Registration"
                        >
                            <p>
                                During registration, the user is required to enter an API key.
                            </p>

                            <p>
                                The API key is securely sent to the backend where validation occurs before profile creation can continue.
                            </p>

                            <p>
                                Invalid API keys are rejected immediately.
                            </p>
                        </StepCard>

                        <StepCard
                            step="2"
                            title="OTP Verification"
                        >
                            <p>
                                After successful API key validation, the platform initiates OTP verification.
                            </p>

                            <p>
                                The user must enter the correct OTP sent to the registered email address to complete profile creation.
                            </p>

                            <p>
                                Without OTP verification, the account cannot be activated.
                            </p>
                        </StepCard>

                        <StepCard
                            step="3"
                            title="Login"
                        >
                            <p>
                                Once profile creation is completed, the user can log in using the registered:
                            </p>

                            <ul className="space-y-2">
                                <li>• Username</li>
                                <li>• Password</li>
                            </ul>

                            <p>
                                After successful login, the user gains access to all AI-powered features.
                            </p>
                        </StepCard>

                        <InfoBox title="Why This Flow Exists">
                            <p>
                                This authentication flow ensures that:
                            </p>

                            <ul className="space-y-2">
                                <li>• Only verified users can access AI features</li>
                                <li>• AI usage is controlled securely</li>
                                <li>• Unauthorized access is prevented</li>
                            </ul>
                        </InfoBox>
                    </motion.section>
                );

            case "Project Workflow":
                return (
                    <motion.section
                        {...pageTransition}
                        className="space-y-8"
                    >
                        <SectionTitle
                            title="Project Workflow"
                            desc="A project represents the application or system that the user wants to test. A project can contain multiple features which need testing."
                        />

                        <StepCard
                            step="1"
                            title="Create Project"
                        >
                            <p>
                                To create a project, the user must provide:
                            </p>

                            <ul className="space-y-2">
                                <li>• Project name</li>
                                <li>• Project description</li>
                            </ul>

                            <p>
                                The AI uses this information during testcase generation.
                            </p>
                        </StepCard>

                        <StepCard
                            step="2"
                            title="Manage Projects"
                        >
                            <p>
                                After a project is created, the user can:
                            </p>

                            <ul className="space-y-2">
                                <li>• Search projects</li>
                                <li>• Edit project details</li>
                                <li>• Delete projects</li>
                                <li>• Navigate to the Features page</li>
                            </ul>
                        </StepCard>

                        <StepCard
                            step="3"
                            title="Navigate To Features"
                        >
                            <p>
                                Every project can contain multiple features which need testing.
                            </p>

                            <p>
                                Users can open the Features page of a project to start creating feature-level testing workflows.
                            </p>
                        </StepCard>

                        <div className="rounded-xl border border-red-500 bg-red-50 p-4">
                            <div className="flex items-start gap-3">
                                <OctagonX className="h-5 w-5 text-red-500 mt-1 shrink-0" />

                                <div>
                                    <h3 className="font-semibold text-red-700">
                                        Project Deletion
                                    </h3>

                                    <p className="mt-2 text-sm text-red-600">
                                        Deleting a project permanently removes:
                                    </p>

                                    <ul className="mt-2 space-y-2 text-sm text-red-600">
                                        <li>• Related features</li>
                                        <li>• Test case versions</li>
                                        <li>• Generated script templates</li>
                                    </ul>

                                    <p className="mt-3 text-sm font-medium text-red-700">
                                        This deletion cannot be reversed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                );

            case "Feature Workflow":
                return (
                    <motion.section
                        {...pageTransition}
                        className="space-y-8"
                    >
                        <SectionTitle
                            title="Feature Workflow"
                            desc="Features represent specific functionality of a project that the user wants to test. Each feature can include supporting document uploads to enhance AI-driven understanding, with the ability to generate and manage multiple versions of test cases effortlessly."
                        />

                        <InfoBox title="Examples Of Features">
                            <ul className="space-y-2">
                                <li>• Login Page</li>
                                <li>• Checkout Flow</li>
                                <li>• Payment Gateway</li>
                                <li>• User Registration</li>
                                <li>• Dashboard Analytics</li>
                            </ul>
                        </InfoBox>

                        <StepCard
                            step="1"
                            title="Create Feature"
                        >
                            <p>
                                When creating a feature, the user has to provide:
                            </p>

                            <ul className="space-y-2">
                                <li>• Feature name</li>
                                <li>• Feature description</li>
                            </ul>

                            <p>
                                This information helps the AI to understand the functionality that needs be tested.
                            </p>
                        </StepCard>

                        <StepCard
                            step="2"
                            title="Add AI Instructions (Optional)"
                        >
                            <p>
                                Users can optionally provide instructions to the AI to guide testcase generation.
                            </p>

                            <p>
                                AI instructions help generate more focused or customized test scenarios.
                            </p>

                            <p>
                                Example:
                            </p>

                            <div className="rounded-2xl bg-slate-950 text-green-400 p-5 font-mono text-sm overflow-auto">
                                Focus heavily on negative scenarios and validation cases.
                            </div>
                        </StepCard>

                        <StepCard
                            step="3"
                            title="Manage Features"
                        >
                            <p>
                                After creating a feature, users can:
                            </p>

                            <ul className="space-y-2">
                                <li>• Search features</li>
                                <li>• Edit features</li>
                                <li>• Delete features</li>
                                <li>• Upload documents</li>
                                <li>• Open testcase page</li>
                            </ul>
                        </StepCard>

                        <div className="rounded-xl border border-red-500 bg-red-50 p-4">
                            <div className="flex items-start gap-3">
                                <OctagonX className="h-5 w-5 text-red-500 mt-1 shrink-0" />

                                <div>
                                    <h3 className="font-semibold text-red-700">
                                        Feature Deletion
                                    </h3>

                                    <p className="mt-2 text-sm text-red-600">
                                        Deleting a feature permanently removes:
                                    </p>

                                    <ul className="mt-2 space-y-2 text-sm text-red-600">
                                        <li>• Testcase versions</li>
                                        <li>• Generated script templates</li>
                                    </ul>

                                    <p className="mt-3 text-sm font-medium text-red-700">
                                        This deletion cannot be reversed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                );

            case "Document Upload Workflow":
                return (
                    <motion.section
                        {...pageTransition}
                        className="space-y-8"
                    >
                        <SectionTitle
                            title="Document Upload Workflow"
                            desc="Users can upload PDF documents to improve AI understanding during testcase generation."
                        />

                        <StepCard
                            step="1"
                            title="Open Document Modal"
                        >
                            <p>
                                After creating a feature, the user gets access to the document upload modal.
                            </p>
                        </StepCard>

                        <StepCard
                            step="2"
                            title="Upload PDF Documents"
                        >
                            <p>
                                Users can upload any PDF document that may help the AI understand the feature better.
                            </p>

                            <p>
                                Example documents:
                            </p>

                            <ul className="space-y-2">
                                <li>• BRD documents</li>
                                <li>• Requirement documents</li>
                                <li>• Product documentation</li>
                                <li>• Validation rules</li>
                            </ul>
                        </StepCard>

                        <StepCard
                            step="3"
                            title="AI Uses Documents During Generation"
                        >
                            <p>
                                Uploaded PDF documents are sent to the AI model during testcase generation.
                            </p>

                            <p>
                                This helps the AI generate:
                            </p>

                            <ul className="space-y-2">
                                <li>• More accurate testcases</li>
                                <li>• Better validation scenarios</li>
                                <li>• Context-aware test flows</li>
                            </ul>
                        </StepCard>

                        <InfoBox title="Optional Feature">
                            <p>
                                PDF upload is completely optional.
                            </p>

                            <p>
                                Users can still generate testcases without uploading documents.
                            </p>
                        </InfoBox>
                    </motion.section>
                );

            case "Test Case Workflow":
                return (
                    <motion.section
                        {...pageTransition}
                        className="space-y-8"
                    >
                        <SectionTitle
                            title="Test Case Workflow"
                            desc="The Test Case page is the main AI generation area where users create and manage testcases in versions."
                        />

                        <StepCard
                            step="1"
                            title="Generate First Testcase Version"
                        >
                            <p>
                                After opening the testcase page, the user can generate the first version of testcases.
                            </p>

                            <p>
                                The AI uses:
                            </p>

                            <ul className="space-y-2">
                                <li>• Project details</li>
                                <li>• Feature details</li>
                                <li>• AI instructions</li>
                                <li>• Uploaded PDF documents</li>
                            </ul>

                            <p>
                                to generate intelligent testing scenarios.
                            </p>
                        </StepCard>

                        <StepCard
                            step="2"
                            title="Generate Multiple Versions"
                        >
                            <p>
                                Users can update AI instructions and generate new testcase versions.
                            </p>

                            <p>
                                Every generation creates a separate version.
                            </p>

                            <p>
                                Older versions are preserved and users can switch between versions anytime.
                            </p>
                            <p>
                                If a generated version does not meet the user’s expectations, they can regenerate it at any time to create a refined new version while preserving previous iterations.
                            </p>
                        </StepCard>

                        <StepCard
                            step="3"
                            title="Manage Testcases"
                        >
                            <p>
                                After generating testcases, users can manage them by:
                            </p>

                            <ul className="space-y-2">
                                <li>• Search testcases</li>
                                <li>• Delete specific versions</li>
                                <li>• Switch between versions</li>
                                <li>• Copy testcases</li>
                                <li>• Download Excel reports</li>
                            </ul>
                        </StepCard>

                        <StepCard
                            step="4"
                            title="Prepare Script Generation"
                        >
                            <p>
                                After testcases are generated, the user can use them for script generation by selecting the:
                            </p>

                            <ul className="space-y-2">
                                <li>• Specific testcase</li>
                                <li>• Framework</li>
                                <li>• Programming language</li>
                            </ul>
                            <p>
                                at the bottom of the testcase page
                            </p>
                            <p>
                                After selection, the Generate Scripts button becomes enabled.
                            </p>
                        </StepCard>

                        <InfoBox title="Versioning System">
                            <p>
                                TestLab uses testcase versioning to allow users to generate multiple AI outputs without losing previous generations.
                            </p>
                        </InfoBox>
                    </motion.section>
                );

            case "Script Generation Workflow":
                return (
                    <motion.section
                        {...pageTransition}
                        className="space-y-8"
                    >
                        <SectionTitle
                            title="Script Template Generation Workflow"
                            desc="Script generation converts selected testcases into automation-ready script templates."
                        />

                        <StepCard
                            step="1"
                            title="Select Testcase"
                        >
                            <p>
                                The user selects a testcase from the currently active testcase version.
                            </p>
                        </StepCard>

                        <StepCard
                            step="2"
                            title="Select Framework And Language"
                        >
                            <p>
                                The user selects:
                            </p>

                            <ul className="space-y-2">
                                <li>• Automation framework</li>
                                <li>• Programming language</li>
                            </ul>

                            <p>
                                Supported examples include:
                            </p>

                            <ul className="space-y-2">
                                <li>• Playwright</li>
                                <li>• Selenium</li>
                                <li>• Cypress</li>
                                <li>• Pytest</li>
                            </ul>
                        </StepCard>

                        <StepCard
                            step="3"
                            title="Generate Script Template"
                        >
                            <p>
                                After clicking Generate Scripts:
                            </p>

                            <ul className="space-y-2">
                                <li>• User is redirected to Scripts page</li>
                                <li>• AI generates automation-ready template</li>
                                <li>• Generated template becomes available instantly</li>
                            </ul>
                        </StepCard>

                        <StepCard
                            step="4"
                            title="Manage Scripts"
                        >
                            <p>
                                Users can:
                            </p>

                            <ul className="space-y-2">
                                <li>• Copy scripts</li>
                                <li>• Download scripts</li>
                                <li>• Change framework/language</li>
                                <li>• Regenerate templates</li>
                            </ul>
                        </StepCard>
                    </motion.section>
                );

            case "Existing Script Detection":
                return (
                    <motion.section
                        {...pageTransition}
                        className="space-y-8"
                    >
                        <SectionTitle
                            title="Existing Script Detection"
                            desc="TestLab prevents unnecessary script template generation by detecting previously generated script combinations."
                        />

                        <InfoBox title="How Detection Works">
                            <p>
                                When a user selects:
                            </p>

                            <ul className="space-y-2">
                                <li>• Same testcase</li>
                                <li>• Same framework</li>
                                <li>• Same language</li>
                            </ul>

                            <p>
                                TestLab checks whether a script template already exists.
                            </p>
                        </InfoBox>

                        <StepCard
                            step="1"
                            title="Existing Script Found"
                        >
                            <p>
                                If a script template already exists, the user gets additional options:
                            </p>

                            <ul className="space-y-2">
                                <li>• View existing script</li>
                                <li>• Regenerate script</li>
                            </ul>
                        </StepCard>

                        <StepCard
                            step="2"
                            title="Viewing Existing Script"
                        >
                            <p>
                                View redirects the user to the scripts page and displays the existing script template along with the selected testcase, framework, and language.
                            </p>
                        </StepCard>

                        <StepCard
                            step="3"
                            title="Regeneration"
                        >
                            <p>
                                Regeneration redirects the user to the scripts page and creates a new AI-generated template for the same framework/language combination.
                            </p>
                        </StepCard>
                    </motion.section>
                );

            case "Quick Start":
                return (
                    <motion.section
                        {...pageTransition}
                        className="space-y-8"
                    >
                        <SectionTitle
                            title="Quick Start"
                            desc="Follow these steps to start using TestLab."
                        />

                        <div className="space-y-5">
                            {[
                                "Sign up securely using your API key",
                                "Complete API validation and OTP verification to securely activate your account",
                                "Log in using your registered credentials and start managing your testing projects",
                                "Create a dedicated project for the application which needs to be tested",
                                "Add features under the project that require testing",
                                "Upload requirement PDFs or add AI instructions to improve test case accuracy",
                                "Instantly create AI-powered test case versions for your features. If a version does not meet expectations, regenerate it to produce improved variations while keeping previous versions available for comparison",
                                "Convert generated test cases into automation-ready script templated",
                            ].map((step, index) => (
                                <div
                                    key={step}
                                    className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex gap-5"
                                >
                                    <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                                        {index + 1}
                                    </div>

                                    <p className="text-slate-700 leading-relaxed">
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                );

            default:
                return (
                    <motion.section
                        key={activeSection}
                        {...pageTransition}
                        className="space-y-8"
                    >
                        <SectionTitle
                            title={activeSection}
                            desc="Documentation content."
                        />
                    </motion.section>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fbff] text-slate-900">
            {/* Top Navbar */}
            <div className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-slate-200 bg-[#f8fbff]/95 backdrop-blur-xl">
                <div className="h-full flex items-center justify-between px-4 lg:px-6">

                    {/* Left Side */}
                    <div>
                        {!sidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="h-11 w-11 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center"
                            >
                                <Menu size={20} />
                            </button>
                        )}
                    </div>

                    {/* Right Side Buttons */}
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                navigate("/");
                                toast.success("Redirecting to Home...");
                            }}
                            className="px-5 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-medium shadow-sm hover:bg-blue-50 transition-all duration-300"
                        >
                            Home
                        </motion.button>

                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                navigate("/login");
                                toast.success("Redirecting to TestLab...");
                            }}
                            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        >
                            Launch TestLab
                        </motion.button>
                    </div>
                </div>
            </div>
            <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#2563eb08_1px,transparent_1px),linear-gradient(to_bottom,#2563eb08_1px,transparent_1px)] bg-[size:60px_60px]" />
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{
                            x: -320,
                            opacity: 0,
                        }}
                        animate={{
                            x: 0,
                            opacity: 1,
                        }}
                        exit={{
                            x: -320,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.25,
                        }}
                        className="fixed inset-y-0 left-0 z-[60] h-dvh overflow-hidden w-[280px] sm:w-[300px] border-r border-slate-200 bg-white/95 backdrop-blur-xl px-6 py-8 flex flex-col overscroll-none"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center">
                                    <Sparkles
                                        className="text-white"
                                        size={22}
                                    />
                                </div>

                                <div>
                                    <h1 className="text-2xl font-black">
                                        TestLab
                                    </h1>

                                    <p className="text-sm text-slate-500">
                                        Documentation
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    setSidebarOpen(false)
                                }
                                className="h-10 w-10 rounded-xl hover:bg-slate-100 flex items-center justify-center"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-2 flex-1 pr-1 pt-2 pb-24">
                            {sections.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => {
                                        setActiveSection(item);

                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth",
                                        });

                                        if (window.innerWidth < 1024) {
                                            setSidebarOpen(false);
                                        }
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${activeSection === item
                                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                                        : "hover:bg-blue-50 text-slate-600"
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
            {
                !sidebarOpen && (
                    <div className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-slate-200 bg-[#f8fbff]/95 backdrop-blur-xl">
                        <div className="h-full flex items-center px-4 lg:px-6">
                            <button
                                onClick={() =>
                                    setSidebarOpen(true)
                                }
                                className="h-11 w-11 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center"
                            >
                                <Menu size={20} />
                            </button>
                        </div>
                    </div>
                )
            }
            <main
                className={`min-w-0 pt-20 sm:pt-24 px-4 sm:px-6 md:px-8 lg:px-12 pb-6 sm:pb-8 md:pb-10 transition-all duration-300 ${sidebarOpen
                    ? "lg:ml-[300px] lg:w-[calc(100%-300px)]"
                    : "w-full"
                    }`}
            >
                <div className="w-full max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        {renderContent()}
                    </AnimatePresence>
                </div>
            </main>
        </div >
    );
}