import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, XCircle, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { projectFeatureService } from "../../Services/projectFeatureApi";

export default function CreateFeature({ isOpen, onClose, onSuccess }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [generation_instructions, set_generation_instructions] = useState("");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const { projectId } = useParams();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleClose = () => {
        setErrors({});
        setName("");
        setDescription("");
        set_generation_instructions("");
        setShowAdvanced(false);
        onClose();
    };

    const validate = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "Feature name is required";
        } else if (name.length < 3) {
            newErrors.name = "Minimum 3 characters required";
        }

        if (!description.trim()) {
            newErrors.description = "Description is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Please fix all errors before submitting');
            return;
        }

        setLoading(true);

        try {
            const featureData = {name,description,generation_instructions};
            await projectFeatureService.createProjectFeature(projectId, featureData);
            toast.success("Feature created successfully", {icon: <CheckCircle2 color="green" />,});
            onSuccess();
            handleClose();
        } catch (err) {
            toast.error("Failed to create feature", {icon: <XCircle color="red" />,});
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-blue-950/10 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div
                            className={`w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden ${showAdvanced ? "max-h-[90vh] overflow-y-auto" : ""}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-6 py-5 border-b border-blue-100 sticky top-0 bg-white z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                                        <Sparkles size={20} />
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Create Feature
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Define your feature and launch testing seamlessly
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-xl hover:bg-gray-100 transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Feature Name *
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
                                        placeholder="What is this feature about?
Note: Descriptions are used for AI-based test case generation. For best performance, keep prompts concise and limit generation to fewer than 10 test cases.
                                        "
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
                                <div className="border border-blue-100 rounded-2xl overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setShowAdvanced(!showAdvanced)}
                                        className="w-full px-4 py-3 flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition"
                                    >
                                        <span className="text-sm font-medium text-blue-700">
                                            Advanced Settings
                                        </span>

                                        {showAdvanced ? (
                                            <ChevronUp size={18} />
                                        ) : (
                                            <ChevronDown size={18} />
                                        )}
                                    </button>
                                    <AnimatePresence>
                                        {showAdvanced && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-4 border-t border-blue-100">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Default AI Instructions (Optional)
                                                    </label>

                                                    <textarea
                                                        rows={5}
                                                        maxLength={500}
                                                        placeholder="Example:
Generate login page test cases
Validate error states
Note: Keep prompts concise and generate fewer than 10 test cases for better performance."
                                                        value={generation_instructions}
                                                        onChange={(e) =>
                                                            set_generation_instructions(e.target.value)
                                                        }
                                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                                    />

                                                    <div className="text-xs text-right text-gray-400 mt-1">
                                                        {generation_instructions.length}/500
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="w-full py-3 rounded-2xl border border-gray-200 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
                                    >
                                        {loading ? "Creating..." : "Create Feature"}
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