import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, XCircle, Pencil, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { projectFeatureService } from "../../Services/projectFeatureApi";

export default function EditProjectFeature({ isOpen, onClose, feature, onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [generation_instructions, setGenerationInstructions] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (feature) {
      setName(feature.name || "");
      setDescription(feature.description || "");
      setGenerationInstructions(feature.generation_instructions || "");
    }
  }, [feature]);

  const validate = () => {
    const err = {};

    if (!name.trim()) {
      err.name = "Feature name cannot be empty";
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

    if (!feature?.id) {
      toast.error("Feature ID missing");
      return;
    }

    if (!validate()) {
      toast.error("Name and description are required");
      return;
    }

    const updatedFeatureData = {};

    if (name.trim()) updatedFeatureData.name = name;
    if (description.trim()) updatedFeatureData.description = description;
    if (generation_instructions.trim())
      updatedFeatureData.generation_instructions = generation_instructions;

    setLoading(true);

    try {
      await projectFeatureService.editProjectFeature(
        projectId,
        feature.id,
        updatedFeatureData
      );

      toast.success("Feature updated!", {
        icon: <CheckCircle2 color="green" />,
      });

      onSuccess();
      onClose();
    } catch {
      toast.error("Update failed", {
        icon: <XCircle color="red" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const isUnchanged = feature && name.trim() === (feature.name || "") &&
    description.trim() === (feature.description || "") &&
    generation_instructions.trim() === (feature.generation_instructions || "");

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
              className={`w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden ${showAdvanced ? "max-h-[90vh] overflow-y-auto" : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-blue-100 sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                    <Pencil size={20} />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Edit Feature
                    </h2>
                    <p className="text-sm text-gray-500">
                      Edit your project feature
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

                <div className="border border-blue-100 rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full px-4 py-3 flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition"
                  >
                    <span className="text-sm font-medium text-blue-700">
                      Generation Instructions
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
                            Add AI instructions (optional)
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
                              setGenerationInstructions(e.target.value)
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