import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Trash2, Pencil, UploadCloud, Eye, MoreVertical, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ProjectSearchBar from "../Components/SearchBar/ProjectSearchBar";
import { Loader } from "../Components/Loader/Loader";
import { projectFeatureService } from "../Services/projectFeatureApi";
import EmptyState from "../Components/EmptyStateComponent/EmptyStateComponent";
import CreateFeature from "../Components/CreateFeature/CreateFeature";
import EditProjectFeature from "../Components/EditProjectFeature/EditProjectFeature";
import DeleteProjectFeature from "../Components/DeleteProjectFeature/DeleteProjectFeature";
import useDebounce from "../Hooks/useDebounce";
import ManageDocumentsModal from "../Components/ManageDocumentsModal/ManageDocumentsModal";

export default function Features() {
    const { projectId } = useParams();
    const [openModal, setOpenModal] = useState(false);
    const [features, setFeatures] = useState([]);
    const [editFeature, setEditFeature] = useState(null);
    const [deleteProject, setDeleteProject] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [activeMenu, setActiveMenu] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [noResults, setNoResults] = useState("");
    const [docOpen, setDocOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const navigate = useNavigate();
    const controllerRef = useRef(null)
    const debounceSearch = useDebounce(search, 500)

    const fetchProjectFeatures = async () => {
        setIsLoading(true);
        try {
            const response = await projectFeatureService.getProjectFeatures(projectId);
            setFeatures(response.data || []);
            setNoResults("");

        } catch (err) {
            console.error(err);
            if (err.response?.status !== 404) {
                toast.error("Failed to load features");
            }
            setFeatures([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (query) => {
        try {
            if (controllerRef.current) {
                controllerRef.current.abort();
            }

            const controller = new AbortController();
            controllerRef.current = controller;
            const res = await projectFeatureService.searchProjectFeature(projectId, query, controller.signal);

            setFeatures(res.data);
            setNoResults("");

        } catch (err) {
            if (err.name === "AbortError") return;
            const message = "Search failed";
            toast.error(message);
            setFeatures([]);
            setNoResults(message);
        }
    };

    useEffect(() => {
        if (!debounceSearch) {
            fetchProjectFeatures();
            setNoResults("");
            return;
        }
        handleSearch(debounceSearch);
    }, [debounceSearch]);


    return (
        <div className="h-full flex flex-col">
            <div className="p-4 sm:p-6 flex flex-col gap-4">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-blue-800">
                            Features
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            Create and manage features to generate test cases
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <motion.button
                            onClick={() => navigate(`/projects/`)}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border shadow-sm hover:shadow-md transition-all"
                        >
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                Go Back
                            </span>
                        </motion.button>
                        <button
                            onClick={() => setOpenModal(true)}
                            className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition text-sm"
                        >
                            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                            New Feature
                        </button>
                    </div>
                </div>
                <div className="w-full">
                    <ProjectSearchBar value={search} onChange={setSearch} />
                </div>
            </div>
            <div className="flex-1 flex">

                {isLoading && (
                    <div className="w-full flex items-center justify-center">
                        <Loader />
                    </div>
                )}

                {!isLoading && features.length === 0 && (
                    <div className="w-full flex items-center justify-center">
                        <EmptyState type="features" />
                    </div>
                )}

                {!isLoading && features.length > 0 && (
                    <div className="w-full p-4 sm:p-6 space-y-4">

                        {features.map((feature) => (
                            <div
                                key={feature.id}
                                className="relative bg-white dark:bg-gray-800 border rounded-xl shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-sm sm:text-lg font-semibold text-blue-800 truncate">
                                            {feature.name}
                                        </h2>

                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                                            {feature.description}
                                        </p>

                                        <p className="text-xs text-gray-400 mt-1 truncate">
                                            {feature.generation_instructions || "No AI instructions added yet"}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">

                                        <motion.button
                                            onClick={() => setExpandedId(expandedId === feature.id ? null : feature.id)}
                                            className="px-2 sm:px-3 py-1 text-xs rounded-lg bg-gray-100 hover:bg-gray-200"
                                        >
                                            {expandedId === feature.id ? "Hide" : "Details"}
                                        </motion.button>

                                        <motion.button
                                            onClick={() => navigate(`/projects/${projectId}/features/${feature.id}/test-cases`)}
                                            className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg bg-green-600 text-white text-xs"
                                        >
                                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                            Test Cases
                                        </motion.button>

                                        <motion.button
                                            onClick={() => {
                                                setSelectedFeature(feature);
                                                setDocOpen(true);
                                            }}
                                            className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg bg-blue-500 text-white text-xs"
                                        >
                                            <UploadCloud className="w-3 h-3 sm:w-4 sm:h-4" />
                                            Documents
                                        </motion.button>

                                        <button
                                            onClick={() => setActiveMenu(activeMenu === feature.id ? null : feature.id)}
                                            className="p-2 rounded hover:bg-gray-100"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {activeMenu === feature.id && (
                                        <motion.div
                                            className="absolute right-0 top-full mt-1 sm:mt-2 md:mt-3 bg-white shadow-lg rounded-lg w-36 z-50 border"
                                        >
                                            <button
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-sm"
                                                onClick={() => {
                                                    setEditFeature(feature);
                                                    setActiveMenu(null);
                                                }}
                                            >
                                                <Pencil size={16} />
                                                Edit
                                            </button>

                                            <button
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-red-100 text-red-600 w-full text-sm"
                                                onClick={() => {
                                                    setDeleteProject(feature);
                                                    setActiveMenu(null);
                                                }}
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <AnimatePresence>
                                    {expandedId === feature.id && (
                                        <motion.div
                                            className="border-t px-4 pb-4"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                            style={{ overflow: "hidden" }}
                                        >
                                            <div className="pt-3 space-y-3">
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500">
                                                        Description
                                                    </p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                                        {feature.description}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500">
                                                        AI Instructions
                                                    </p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                                        {feature.generation_instructions || "No AI instructions added yet"}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <ManageDocumentsModal
                    isOpen={docOpen}
                    onClose={() => setDocOpen(false)}
                    feature={selectedFeature}
                />
                <CreateFeature
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    onSuccess={fetchProjectFeatures}
                />
                <EditProjectFeature
                    isOpen={!!editFeature}
                    feature={editFeature}
                    onClose={() => setEditFeature(null)}
                    onSuccess={fetchProjectFeatures}
                />
                <DeleteProjectFeature
                    isOpen={!!deleteProject}
                    feature={deleteProject}
                    onClose={() => setDeleteProject(null)}
                    onSuccess={fetchProjectFeatures}
                />
            </div>
        </div>
    );
}