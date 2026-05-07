import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Trash2, Search, ChevronDown, ChevronUp, Loader2, Layers3, Clock3, ShieldCheck, CheckCircle2, FileCode2, FolderOpen, ClipboardCopy, ClipboardPlus, Check, HardDriveDownload, Eye, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { featureTestCaseService } from "../Services/testcasesApi";
import { testCaseScriptService } from "../Services/scriptsApi";
import { projectFeatureService } from "../Services/projectFeatureApi";
import { formatDateTime } from "../Utils/dateTimeFormat";
import { formatTestcase } from "../Utils/testCaseFormat";
import { copyToClipboard } from "../Utils/clipboardCopy";
import TestCaseGenerationLoader from "../Components/Loader/TestCaseGenerationLoader";
import { Section } from "../Components/TestCaseSection/TestCaseSection";
import { normalizeVersions } from "../Utils/TestCaseNormalization";
import DeleteVersionModal from "../Components/DeleteTestCaseVersion/DeleteTestCaseVersion";
import { getAvailableFrameworks, getAvailableLanguages, isValidFrameworkLanguagePair } from "../Utils/frameworkLanguageOptions";
import { downloadFile } from "../Utils/downloadFiles";

export default function TestCases() {
    const navigate = useNavigate();
    const location = useLocation();
    const stateData = location.state || {};
    const { projectId, featureId } = useParams();
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [versions, setVersions] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState("");
    const [search, setSearch] = useState("");
    const [aiPrompt, setAiPrompt] = useState("");
    const [framework, setFramework] = useState(stateData.framework || "");
    const [language, setLanguage] = useState(stateData.language || "");
    const [openCards, setOpenCards] = useState({});
    const [copiedId, setCopiedId] = useState(null);
    const [selectedTestcaseId, setSelectedTestcaseId] = useState(stateData.selectedTestcaseId || "");
    const [scripts, setScripts] = useState([]);
    const [checkingScript, setCheckingScript] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const availableFrameworks = getAvailableFrameworks(language);
    const availableLanguages = getAvailableLanguages(framework);

    const fetchCases = useCallback(
        async (showError = true) => {
            try {
                const res =
                    await featureTestCaseService.getTestCases(
                        featureId
                    );

                const normalized = normalizeVersions(
                    res.data || []
                );

                setVersions(normalized);

                if (normalized.length > 0) {
                    setSelectedVersion((prev) =>
                        normalized.some(
                            (v) => v.id === prev
                        )
                            ? prev
                            : normalized[0].id
                    );
                } else {
                    setSelectedVersion("");
                    setSelectedTestcaseId("");
                }

                return normalized;
            } catch {
                setVersions([]);
                setSelectedVersion("");
                setSelectedTestcaseId("");

                if (showError) {
                    toast.error(
                        "Failed to load testcases"
                    );
                }

                return [];
            }
        },
        [featureId]
    );

    useEffect(() => {
        if (!featureId) return;
        const init = async () => {
            setLoading(true);
            await fetchCases(false);
            setLoading(false);
        };
        init();
    }, [featureId, fetchCases]);

    useEffect(() => {
        const checkScript = async () => {
            if (!selectedTestcaseId) {
                setScripts([]);
                return;
            }
            try {
                setCheckingScript(true);
                const res = await testCaseScriptService.getScript(selectedTestcaseId);
                const data = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
                setScripts(data);
            } catch {
                setScripts([]);
            } finally {
                setCheckingScript(false);
            }
        };
        checkScript();
    }, [selectedTestcaseId]);

    useEffect(() => {
        if (framework && language && !isValidFrameworkLanguagePair(framework, language)) {
            setLanguage("");
        }
    }, [framework, language]);

    useEffect(() => {
        if (framework && language && !isValidFrameworkLanguagePair(framework, language)) {
            setFramework("");
        }
    }, [framework, language]);

    useEffect(() => {
        if (stateData.framework) setFramework(stateData.framework);
        if (stateData.language) setLanguage(stateData.language);
        if (stateData.selectedTestcaseId) {
            setSelectedTestcaseId(stateData.selectedTestcaseId);
        }
    }, [location.state]);

    const handleGenerate = async (
        showToast = true
    ) => {
        try {
            setGenerating(true);

            const prompt =
                aiPrompt.trim();

            if (prompt) {
                await projectFeatureService.editProjectFeature(
                    projectId,
                    featureId,
                    {
                        generation_instructions:
                            prompt,
                    }
                );
            }

            await featureTestCaseService.generateTestCases(
                featureId
            );

            const latestData =
                await fetchCases(false);

            if (latestData.length > 0) {
                setSelectedVersion(
                    latestData[0].id
                );
            }

            setAiPrompt("");

            if (showToast) {
                toast.success(
                    versions.length === 0
                        ? "First version generated"
                        : "New version generated"
                );
            }
        } catch {
            toast.error("Generation failed. Check you API key and try again !");
        } finally {
            setGenerating(false);
        }
    };

    const handleDeleteVersion = async () => {
        if (!selectedVersion) return;
        try {
            const version = Number(selectedVersion.replace("v", ""));
            await featureTestCaseService.deleteTestCases(featureId, version);
            toast.success("Deleted successfully");
            setShowDeleteModal(false);
            await fetchCases(false);
        } catch {
            toast.error("Delete failed");
        }
    };

    const matchedScript = useMemo(() => {
        return scripts.find((item) =>
            item.script_tool?.toLowerCase() === framework.toLowerCase() &&
            item.script_language?.toLowerCase() === language.toLowerCase()
        ) || null;
    }, [scripts, framework, language]);

    const hasScript = !!matchedScript;
    const isScriptSelectionValid = selectedTestcaseId && framework && language;
    const currentVersion = versions.find((v) => v.id === selectedVersion) || null;
    const currentCases = currentVersion?.items || [];

    const filteredCases = useMemo(() => {
        const value = search.toLowerCase();
        return currentCases.filter(
            (tc) =>
                tc.title.toLowerCase().includes(value) ||
                tc.testcaseId.toLowerCase().includes(value)
        );
    }, [currentCases, search]);

    const handleGenerateScript = () => {
        if (!selectedTestcaseId) {
            toast.error("Select testcase first");
            return;
        }
        navigate(
            `/projects/${projectId}/features/${featureId}/test-cases/${selectedTestcaseId}/scripts?generate=true`,
            { state: { framework, language, selectedTestcaseId } }
        );
    };

    const handleViewScript = () => {
        if (!selectedTestcaseId) return;
        navigate(
            `/projects/${projectId}/features/${featureId}/test-cases/${selectedTestcaseId}/scripts`,
            { state: { framework, language, selectedTestcaseId } }
        );
    };

    const handleRegenerateScript = () => {
        if (!selectedTestcaseId) return;
        navigate(
            `/projects/${projectId}/features/${featureId}/test-cases/${selectedTestcaseId}/scripts?regenerate=true`,
            { state: { framework, language, selectedTestcaseId } }
        );
    };

    const copyAllCases = () => {
        const text = filteredCases.map((tc) => formatTestcase(tc)).join("\n\n-----------------\n\n");
        copyToClipboard(text, "all", setCopiedId);
    };

    const downloadExcel = () => {
        if (filteredCases.length === 0) {
            toast.error("No data");
            return;
        }
        const headers = [
            "ID",
            "Title",
            "Type",
            "Preconditions",
            "Steps",
            "Expected",
        ];
        const rows = filteredCases.map((tc) => [
            tc.testcaseId,
            tc.title,
            tc.type,
            tc.preconditions.join(" | "),
            tc.steps.join(" | "),
            tc.expected,
        ]);
        const csv = [headers, ...rows].map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");
        downloadFile({ content: csv, fileName: `${currentVersion?.label || "TestCases"}.csv`, type: "text/csv; charset=utf-8;" });
    };

    const toggleCard = (id) => { setOpenCards((prev) => ({ ...prev, [id]: !prev[id], })); };

    if (loading || generating) {
        return (
            <TestCaseGenerationLoader generating={generating} />
        );
    }

    return (
        <div className="h-full flex flex-col bg-slate-50">
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-7xl mx-auto space-y-4">

                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="min-w-0">
                                <motion.button
                                    whileHover={{ x: -3 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() =>
                                        navigate(`/projects/${projectId}/features`)
                                    }
                                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-all mb-2"
                                >
                                    <ArrowLeft size={16} />
                                    Back to Features
                                </motion.button>

                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-2xl font-bold text-slate-800">
                                        Feature Test Cases
                                    </h1>

                                    {currentVersion && (
                                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                                            {currentVersion.label}
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-slate-500 mt-1">
                                    Manage versions, refine AI prompts and generate smarter testcases
                                </p>
                            </div>

                            {versions.length > 0 && (
                                <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-start lg:justify-end w-full lg:w-auto">
                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={copyAllCases}
                                        className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-2"
                                    >
                                        {copiedId === "all" ? (
                                            <Check size={16} />
                                        ) : (
                                            <ClipboardCopy size={16} />
                                        )}
                                        Copy All TestCases
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={() => setShowDeleteModal(true)}
                                        className="h-11 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                        Delete Current Version
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        <DeleteVersionModal
                            open={showDeleteModal}
                            onClose={() => setShowDeleteModal(false)}
                            onConfirm={handleDeleteVersion}
                            currentVersion={currentVersion}
                        />
                    </motion.div>

                    {versions.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center"
                        >
                            <FolderOpen
                                size={42}
                                className="mx-auto text-blue-600 mb-4"
                            />

                            <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                No Test Cases Yet
                            </h2>

                            <p className="text-slate-500 mb-5">
                                Generate your first testcase version for this feature
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => handleGenerate()}
                                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center gap-2"
                            >
                                <Sparkles size={18} />
                                Generate First Version
                            </motion.button>
                        </motion.div>
                    )}

                    {versions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4"
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <Sparkles size={18} />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-800 text-base">
                                        Update Instructions & Generate New Version
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        Add or refine instructions to generate smarter test cases.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-3 items-stretch">
                                <textarea
                                    value={aiPrompt}
                                    onChange={(e) =>
                                        setAiPrompt(e.target.value)
                                    }
                                    rows="2"
                                    placeholder="Example: Add negative scenarios, security checks, mobile edge cases...
Keep prompts concise and limit generation to fewer than 10 test cases for better performance.
                                    "
                                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 resize-none text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />

                                <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() =>
                                        handleGenerate()
                                    }
                                    className="h-[88px] md:h-auto md:min-w-[180px] w-full md:w-auto px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap"
                                >
                                    <Sparkles size={15} />
                                    Generate New Version
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {versions.length > 0 && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">

                                    <div className="lg:col-span-3">
                                        <select
                                            value={selectedVersion}
                                            onChange={(e) =>
                                                setSelectedVersion(
                                                    e.target.value
                                                )
                                            }
                                            className="h-10 sm:h-12 w-full rounded-xl border border-slate-200 px-3 bg-white text-[15px] focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            {versions.map((v) => (
                                                <option
                                                    key={v.id}
                                                    value={v.id}
                                                >
                                                    {v.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="lg:col-span-6 relative">
                                        <Search
                                            size={16}
                                            className="absolute left-3 top-4 text-slate-400"
                                        />

                                        <input
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Search testcase..."
                                            className="h-10 sm:h-12 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-[15px] focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>

                                    <div className="lg:col-span-3 flex flex-col sm:flex-row gap-2">
                                        <div className="h-10 sm:h-12 flex-1 rounded-xl bg-slate-900 text-white flex items-center justify-center font-semibold">
                                            {filteredCases.length} Cases
                                        </div>

                                        <motion.button
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={downloadExcel}
                                            className="h-10 sm:h-12 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                                        >
                                            <HardDriveDownload size={16} />
                                            Download
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>

                            {currentVersion && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-2.5"
                                >
                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">

                                        <div className="flex items-center gap-2 text-slate-700">
                                            <Layers3
                                                size={14}
                                                className="text-blue-600"
                                            />
                                            <span className="font-medium">
                                                {currentVersion.label}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Clock3
                                                size={14}
                                                className="text-blue-600"
                                            />
                                            <span>
                                                {formatDateTime(
                                                    currentVersion.created_at
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-slate-600">
                                            <ShieldCheck
                                                size={14}
                                                className="text-blue-600"
                                            />
                                            <span>
                                                {currentVersion.items.length} Cases
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-slate-600 min-w-0 flex-1">
                                            <Sparkles
                                                size={14}
                                                className="text-blue-600 shrink-0"
                                            />

                                            <span className="font-medium text-slate-700 shrink-0">
                                                Prompt Used:
                                            </span>

                                            <div className="relative group min-w-0">
                                                <span className="truncate block cursor-pointer">
                                                    {currentVersion.prompt_used || "Default feature instructions used for testcase generation"}
                                                </span>

                                                <div className="absolute left-0 top-full mt-2 hidden group-hover:block group-active:block z-50 w-80 max-w-[90vw] bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl transition-all duration-200 opacity-0 group-hover:opacity-100">
                                                    {currentVersion.prompt_used || "Default feature instructions used for testcase generation"}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </motion.div>
                            )}

                            <div className="space-y-3 pb-28">
                                {filteredCases.map((tc) => {
                                    const open =
                                        openCards[
                                        tc.testcaseId
                                        ];

                                    return (
                                        <div
                                            key={tc.testcaseId}
                                            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                                        >
                                            <button
                                                onClick={() =>
                                                    toggleCard(
                                                        tc.testcaseId
                                                    )
                                                }
                                                className="w-full px-4 py-4 flex justify-between gap-4 text-left"
                                            >
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full max-w-[160px] sm:max-w-xs truncate block">
                                                            {
                                                                tc.testcaseId
                                                            }
                                                        </span>

                                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                                            {tc.type}
                                                        </span>
                                                    </div>

                                                    <h3 className="font-semibold text-slate-800 line-clamp-10 break-words">
                                                        {tc.title}
                                                    </h3>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            copyToClipboard(
                                                                formatTestcase(
                                                                    tc
                                                                ),
                                                                tc.testcaseId,
                                                                setCopiedId
                                                            );
                                                        }}
                                                        className="h-9 w-9 rounded-xl hover:bg-slate-100 flex items-center justify-center"
                                                    >
                                                        {copiedId ===
                                                            tc.testcaseId ? (
                                                            <Check
                                                                size={16}
                                                                className="text-green-600"
                                                            />
                                                        ) : (
                                                            <ClipboardPlus
                                                                size={16}
                                                            />
                                                        )}
                                                    </button>

                                                    <motion.div
                                                        animate={{
                                                            rotate: open ? 180 : 0,
                                                        }}
                                                    >
                                                        <ChevronDown
                                                            size={18}
                                                        />
                                                    </motion.div>
                                                </div>
                                            </button>

                                            {open && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        height: "auto",
                                                    }}
                                                    className="border-t px-4 py-4 space-y-4"
                                                >
                                                    <Section
                                                        title="Pre Conditions"
                                                        content={
                                                            tc.preconditions
                                                        }
                                                    />

                                                    <Section
                                                        title="Steps"
                                                        list={
                                                            tc.steps
                                                        }
                                                    />

                                                    <Section
                                                        title="Expected Result"
                                                        content={
                                                            tc.expected
                                                        }
                                                    />

                                                    <div className="text-green-600 text-sm flex gap-2">
                                                        <CheckCircle2
                                                            size={16}
                                                        />
                                                        Ready for automation
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {versions.length > 0 && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="sticky bottom-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 z-20"
                >
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 items-center text-sm">

                            <div className="lg:col-span-2 font-semibold text-slate-700">
                                Script Actions
                            </div>

                            <div className="lg:col-span-4">
                                <select
                                    value={selectedTestcaseId}
                                    onChange={(e) =>
                                        setSelectedTestcaseId(
                                            e.target.value
                                        )
                                    }
                                    className="h-10 sm:h-12 w-full rounded-xl border border-slate-200 px-3 bg-white text-[15px] focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">
                                        Select Testcase
                                    </option>

                                    {currentCases.map((tc) => (
                                        <option
                                            key={tc.id}
                                            value={tc.id}
                                        >
                                            {tc.testcaseId} - {tc.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="lg:col-span-2">
                                <select
                                    value={framework}
                                    onChange={(e) =>
                                        setFramework(
                                            e.target.value
                                        )
                                    }
                                    className="h-10 sm:h-12 w-full rounded-xl border border-slate-200 px-3 bg-white text-[15px] focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">
                                        Framework
                                    </option>

                                    {availableFrameworks.map(
                                        (item) => (
                                            <option
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="lg:col-span-2">
                                <select
                                    value={language}
                                    onChange={(e) =>
                                        setLanguage(
                                            e.target.value
                                        )
                                    }
                                    className="h-10 sm:h-12 w-full rounded-xl border border-slate-200 px-3 bg-white text-[15px] focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">
                                        Language
                                    </option>

                                    {availableLanguages.map(
                                        (item) => (
                                            <option
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="lg:col-span-2">
                                {!hasScript ? (
                                    <button
                                        onClick={
                                            handleGenerateScript
                                        }
                                        disabled={
                                            !isScriptSelectionValid
                                        }
                                        className={`h-10 sm:h-12 w-full rounded-xl font-medium ${isScriptSelectionValid
                                            ? "bg-violet-600 hover:bg-violet-700 text-white"
                                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                            }`}
                                    >
                                        Generate Script
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={
                                                handleViewScript
                                            }
                                            className="h-10 sm:h-12 flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium"
                                        >
                                            View
                                        </button>

                                        <button
                                            onClick={
                                                handleRegenerateScript
                                            }
                                            className="h-10 sm:h-12 flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                        >
                                            Regenerate
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}