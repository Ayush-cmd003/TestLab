import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { projectFeatureService } from "../../Services/projectFeatureApi";
import { useParams } from "react-router-dom";

export default function DeleteProjectFeature({ isOpen, onClose, feature, onSuccess }) {
  const { projectId } = useParams();

  const handleDelete = async () => {
    try {
      await projectFeatureService.deleteProjectFeature(projectId, feature.id);
      toast.success("Feature deleted");
      onSuccess();
      onClose();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="fixed inset-0 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl w-[350px]"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Delete This Feature?
              </h2>

              <p className="text-gray-600 text-justify mb-3 leading-relaxed">
                Once you delete this feature, all associated test cases, and scripts will be permanently removed.
              </p>

              <p className="text-gray-600 text-justify mb-5 leading-relaxed">
                This action cannot be undone.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 border py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}