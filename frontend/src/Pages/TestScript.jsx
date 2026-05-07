import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Check, Loader2, Download, RotateCcw, Code2, FileCode2 } from "lucide-react";
import { toast } from "sonner";
import { testCaseScriptService } from "../Services/scriptsApi";
import TestScriptGenerationLoader from "../Components/Loader/TestScriptGenerationLoader";
import { getFileExtension } from "../Utils/testScriptExtension";
import { copyToClipboard } from "../Utils/clipboardCopy";
import { downloadFile } from "../Utils/downloadFiles";
import { getAvailableFrameworks, getAvailableLanguages, isValidFrameworkLanguagePair } from "../Utils/frameworkLanguageOptions";

export default function TestScripts() {
    const navigate = useNavigate();
    const location = useLocation();
    const hasRun = useRef(false);
    const { projectId, featureId, testcaseId } = useParams();
    const [searchParams] = useSearchParams();
    const shouldGenerate = searchParams.get("generate") === "true";
    const shouldRegenerate = searchParams.get("regenerate") === "true";
    const stateData = location.state || {};
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [copied, setCopied] = useState(null);
    const [scriptData, setScriptData] = useState(null);
    const [scripts, setScripts] = useState([]);
    const [downloading, setDownloading] = useState(false);
    const [framework, setFramework] = useState(stateData.framework || "");
    const [language, setLanguage] = useState(stateData.language || "");

    const availableFrameworks = useMemo(() => {
        return getAvailableFrameworks(
            language
        );
    }, [language]);

    const availableLanguages = useMemo(() => {
        return getAvailableLanguages(
            framework
        );
    }, [framework]);

    useEffect(() => {
        if (framework && language && !isValidFrameworkLanguagePair(framework, language)) {
            setFramework("");
        }
    }, [language]);

    useEffect(() => {
        if (framework && language && !isValidFrameworkLanguagePair(framework, language)) {
            setLanguage("");
        }
    }, [framework]);

    const extension = getFileExtension(language);

    const matchedScript = useMemo(() => {
        return (scripts.find((item) => item.script_tool?.toLowerCase() === framework.toLowerCase() &&
            item.script_language?.toLowerCase() === language.toLowerCase()) || null
        );
    }, [scripts, framework, language]);

    const fetchScript = async () => {
        try {
            const res = await testCaseScriptService.getScript(testcaseId);
            setScripts(res.data || []);
            if (res.data.length > 0) {
                setScriptData(res.data[0]);
                if (!framework) {
                    setFramework(res.data[0].script_tool);
                }
                if (!language) {
                    setLanguage(res.data[0].script_language);
                }
            } else {
                setScriptData(null);
            }
        } catch {
            toast.error("Failed to load script");
        }
    };

    const generateScript = async (showToast = true) => {
        try {
            setGenerating(true);
            await testCaseScriptService.generateScript(testcaseId,
                {
                    script_tool:
                        framework.toLowerCase(),

                    script_language:
                        language.toLowerCase(),
                }
            );
            await fetchScript();
            if (showToast) {
                toast.success("Script generated");
            }
        } catch {
            toast.error("Generation failed. Check you API key and try again !Generation failed");
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        const init = async () => {
            setLoading(true);
            if (shouldGenerate || shouldRegenerate) {
                await generateScript(false);
            } else {
                await fetchScript();
            }
            setLoading(false);
        };

        init();
    }, []);

    useEffect(() => {
        setScriptData(matchedScript);
    }, [matchedScript]);

    const handleCopy = () => {
        if (!scriptData) return;
        copyToClipboard(scriptData.script || scriptData.script_code, "script", setCopied);
    };

    const handleDownload = () => {
        if (!scriptData) return;
        const code = scriptData.script || scriptData.script_code;
        const fileName = `${(scriptData?.testcase_name || "Test Script").replace(/[^a-zA-Z0-9 ]/g, "").trim().replace(/\s+/g, "_")}_${framework}.${extension}`;
        downloadFile({ content: code, fileName, setLoading: setDownloading });
    };

    if (loading || generating) {
        return (
            <TestScriptGenerationLoader generating={generating} />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-y-auto p-3 sm:p-5 lg:p-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="relative z-10 bg-white/90 backdrop-blur rounded-3xl shadow-lg border border-slate-200 px-4 sm:px-6 py-5 mb-4"
                >
                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                        <div className="min-w-0">
                            <motion.button
                                whileHover={{ x: -3 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() =>
                                    navigate(`/projects/${projectId}/features/${featureId}/test-cases`,
                                        {
                                            state: {
                                                framework,
                                                language,
                                                selectedTestcaseId: testcaseId,
                                            },
                                        }
                                    )
                                }
                                className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-3 transition"
                            >
                                <ArrowLeft size={16} />
                                Back to Test Cases
                            </motion.button>

                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 break-words">
                                Script Template
                            </h1>

                            <p className="text-slate-500 mt-1 text-sm sm:text-base break-words">
                                {scriptData?.testcase_name || "Test Script for Test Case"}
                            </p>

                            <p className="text-slate-500 text-sm mt-1 break-words">
                                {framework} • {language}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full xl:w-auto">
                            <motion.button
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCopy}
                                disabled={!scriptData}
                                className={`px-5 py-3 rounded-2xl flex items-center justify-center gap-2 transition font-medium ${scriptData
                                    ? "bg-slate-100 hover:bg-slate-200 text-slate-800"
                                    : "bg-slate-100 opacity-50 cursor-not-allowed"
                                    }`}
                            >
                                {copied ? (<Check size={18} />) : (<Copy size={18} />)}
                                Copy
                            </motion.button>

                            <motion.button
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleDownload}
                                disabled={!scriptData || downloading}
                                className={`px-5 py-3 rounded-2xl flex items-center justify-center gap-2 text-white font-medium transition-all duration-300 ${!scriptData || downloading
                                    ? "bg-green-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                                    }`}
                            >
                                {downloading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin shrink-0" />
                                        Downloading...
                                    </>
                                ) : (
                                    <>
                                        <Download size={18} />
                                        Download
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.05 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4"
                >
                    <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-200">
                        <label className="text-sm text-slate-500 block mb-2">
                            Framework
                        </label>

                        <select
                            value={framework}
                            onChange={(e) =>
                                setFramework(e.target.value)
                            }
                            className="w-full border border-slate-200 rounded-xl px-3 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">
                                Select Framework
                            </option>
                            {availableFrameworks.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-200">
                        <label className="text-sm text-slate-500 block mb-2">
                            Language
                        </label>

                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">
                                Select Language
                            </option>
                            {availableLanguages.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-200 flex items-end justify-center">
                        {matchedScript ? (
                            <motion.button
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => generateScript()}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl flex justify-center gap-2 font-medium transition"
                            >
                                <RotateCcw size={18} />
                                Regenerate
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => generateScript()}
                                disabled={!framework || !language}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-5 py-3 rounded-2xl flex justify-center gap-2 font-medium transition"
                            >
                                <FileCode2 size={18} />
                                Generate
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.08 }}
                    className="bg-slate-950 rounded-3xl overflow-hidden shadow-xl border border-slate-800"
                >
                    <div className="px-4 sm:px-5 py-4 border-b border-slate-800 flex items-center gap-3 text-slate-300 text-sm sm:text-base break-all">
                        <Code2 size={18} className="shrink-0" />
                        {(scriptData?.testcase_name || "Test Script for Test Case").replace(/[^a-zA-Z0-9 ]/g, "").trim().replace(/\s+/g, "_")}_{framework}.{extension}
                    </div>

                    <pre className="p-4 sm:p-6 overflow-x-auto text-xs sm:text-sm leading-6 sm:leading-7 text-slate-100 min-h-[420px] sm:min-h-[600px] whitespace-pre-wrap">
                        <code>
                            {scriptData ? (scriptData.script || scriptData.script_code)
                                .replace(/\\n/g, "\n")
                                .replace(/\\t/g, "\t")
                                : "// No script available"}
                        </code>
                    </pre>
                </motion.div>
            </div>
        </div>
    );
}