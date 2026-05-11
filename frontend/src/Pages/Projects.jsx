import { useEffect, useState, useRef } from "react";
import { MoreVertical, Pencil, Trash2, Plus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { projectService } from "../Services/projectApi";
import { Loader } from "../Components/Loader/Loader";
import CreateProjectModal from "../Components/CreateProjectModal/CreateProjectModal";
import EditProjectModal from "../Components/EditProjectModal/EditProjectModel";
import DeleteProjectModal from "../Components/DeleteProjectModal/DeleteProjectModal";
import ProjectSearchBar from "../Components/SearchBar/ProjectSearchBar";
import useDebounce from "../Hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import EmptyState from "../Components/EmptyStateComponent/EmptyStateComponent";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [editProject, setEditProject] = useState(null);
    const [deleteProject, setDeleteProject] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [search, setSearch] = useState("");
    const debounceSearch = useDebounce(search, 500)
    const controllerRef = useRef(null)
    const [noResults, setNoResults] = useState("");
    const navigate = useNavigate();

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const response = await projectService.getProjects();
            setProjects(response.data)
        } catch {
            setError("Failed to fetch projects")
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (query) => {
        try {
            if (controllerRef.current) {
                controllerRef.current.abort();
            }

            const controller = new AbortController();
            controllerRef.current = controller;
            const res = await projectService.searchProjects(query, controller.signal);

            setProjects(res.data);
            setNoResults("");

        } catch (err) {
            if (err.name === "AbortError") return;
            const message = "Search failed";
            setProjects([]);
            setNoResults(message);
        }
    };

    useEffect(() => {
        if (!debounceSearch) {
            fetchProjects();
            setNoResults("");
            return;
        }
        handleSearch(debounceSearch);
    }, [debounceSearch]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");

        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // convert 0 → 12

        return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-blue-800">Your Projects</h2>
                        <p className="text-gray-600 dark:text-gray-400">Your testing starts here — create and manage your projects</p>
                    </div>
                    <button onClick={() => setOpenModal(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg">
                        <Plus className="h-5 w-5" />
                        New Project
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <ProjectSearchBar value={search} onChange={setSearch} />
                </div>
                {!isLoading && projects.length === 0 && (
                    <div className="w-full flex items-center justify-center">
                        <EmptyState type="projects" />
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-visible" >
                    {isLoading && <Loader />}
                    {projects?.map((project) => (
                        <div
                            key={project.id}
                            className="relative overflow-visible bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                        >
                            <div className="flex justify-between items-start space-y-1.5 bg-white transition">
                                <h2 className="text-lg font-semibold text-blue-800">{project.name}</h2>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenu(activeMenu === project.id ? null : project.id);
                                    }}
                                    className="p-1 rounded hover:bg-gray-100"
                                >
                                    <MoreVertical size={20} />
                                </button>
                                <AnimatePresence>
                                    {activeMenu === project.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 top-13 bg-white shadow-lg rounded-lg w-36 z-50 border"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={() => {
                                                    setEditProject(project);
                                                    setActiveMenu(null);
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-sm"
                                            >
                                                <Pencil size={16} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeleteProject(project);
                                                    setActiveMenu(null);
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-red-100 text-red-600 w-full text-sm"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Created at: {formatDate(project.created_at)}</span>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(`/projects/${project.id}/features`)}
                                className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-medium shadow hover:shadow-lg transition-all">
                                Go To Features
                                <motion.span
                                    initial={{ x: 0 }}
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <ArrowRight size={18} />
                                </motion.span>
                            </motion.button>
                            <div>
                            </div>
                        </div>
                    ))}
                    <CreateProjectModal
                        isOpen={openModal}
                        onClose={() => setOpenModal(false)}
                        onSuccess={fetchProjects}
                    />
                    <EditProjectModal
                        isOpen={!!editProject}
                        project={editProject}
                        onClose={() => setEditProject(null)}
                        onSuccess={fetchProjects}
                    />
                    <DeleteProjectModal
                        isOpen={!!deleteProject}
                        project={deleteProject}
                        onClose={() => setDeleteProject(null)}
                        onSuccess={fetchProjects}
                    />
                </div>
            </div>
        </div>
    );
}
export default Projects;
