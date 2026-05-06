import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, XCircle, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { projectService } from "../../Services/projectApi";

export default function EditProjectModal({ isOpen, onClose, project, onSuccess }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (project) {
            setName(project.name);
            setDescription(project.description);
        }
    }, [project]);

    const validate = () => {
        const err = {};

        if (!name.trim()) {
            err.name = "Project name cannot be empty";
        } else if (name.trim().length < 3) {
            err.name = "Minimum 3 characters required";
        }

        if (!description.trim()) {
            err.description = "Description cannot be empty";
        } else if (description.trim().length < 5) {
            err.description = "Minimum 5 characters required";
        }

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Name and description are required");
            return;
        }

        const updatedProjectData = {}

        if (name.trim()) updatedProjectData.name = name;
        if (description.trim()) updatedProjectData.description = description;

        setLoading(true);
        try {
            await projectService.updateProject(project.id, updatedProjectData);
            toast.success("Project updated!", {icon: <CheckCircle2 color="green" />,});
            setName("");
            setDescription("");
            onSuccess();
            onClose();
        } catch {
            toast.error("Update failed", {icon: <XCircle color="red" />,});
        } finally {
            setLoading(false);
        }
    };

    const isUnchanged = project && name.trim() === (project.name || "") && description.trim() === (project.description || "");

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-blue-950/10 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div
                            className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-6 py-5 border-b border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                                        <FolderPlus size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Edit Project
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Edit your project
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl hover:bg-gray-100 transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Name *
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={50}
                                        placeholder="Ex: Ecommerce UI Testing"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                    <div className="text-xs text-right text-gray-400 mt-1">
                                        {name.length}/50
                                    </div>
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        rows={4}
                                        maxLength={250}
                                        placeholder="What is this project about?
Note: Descriptions are used for AI-based test case generation. For best performance, keep prompts concise and limit generation to fewer than 10 test cases."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                    <div className="text-xs text-right text-gray-400 mt-1">
                                        {description.length}/250
                                    </div>
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading || isUnchanged}
                                        className="w-full py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Updating..." : "Update"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}