import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { featureDocumentService } from "../../Services/documentApi";

export default function ManageDocumentsModal({ isOpen, onClose, feature }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const MAX_SIZE = 50 * 1024 * 1024;

    const fetchDocs = async () => {
        try {
            setLoading(true);
            const res = await featureDocumentService.getDocument(feature.id);
            setDocuments(res.data || []);
        } catch {
            toast.info("No documents are available for this feature !");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && feature?.id) {
            fetchDocs();
        }
    }, [isOpen, feature]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        try {
            setUploading(true);

            if (documents.length > 0) {
                await featureDocumentService.deleteDocument(feature.id, documents[0].id);
                setDocuments([]);
            }

            await featureDocumentService.uploadDocument(
                feature.id,
                file
            );

            await fetchDocs();
            toast.success("PDF uploaded");

        } catch {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (docId) => {
        try {
            await featureDocumentService.deleteDocument(feature.id, docId);
            setDocuments((prev) =>
                prev.filter((doc) => doc.id !== docId)
            );
            toast.success("Document deleted");

        } catch {
            toast.error("Delete failed");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />

                    <motion.div
                        className="fixed inset-0 flex justify-center items-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            <div className="flex justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        Manage PDF
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        {feature.name}
                                    </p>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="hover:bg-gray-100 p-2 rounded-lg transition"
                                >
                                    <X />
                                </button>
                            </div>
                            {loading ? (
                                <div className="border rounded-2xl p-8 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 mb-5 overflow-hidden relative">
                                    {/* Floating animated circles */}
                                    <motion.div
                                        className="absolute w-24 h-24 rounded-full bg-blue-200/30 top-2 left-4"
                                        animate={{
                                            y: [0, -10, 0],
                                            x: [0, 10, 0],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                        }}
                                    />
                                    <motion.div
                                        className="absolute w-20 h-20 rounded-full bg-purple-200/30 bottom-4 right-6"
                                        animate={{
                                            y: [0, 12, 0],
                                            x: [0, -8, 0],
                                        }}
                                        transition={{
                                            duration: 5,
                                            repeat: Infinity,
                                        }}
                                    />
                                    <motion.div
                                        animate={{
                                            rotate: [0, -5, 5, -5, 0],
                                            scale: [1, 1.05, 1],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                        }}
                                        className="relative z-10"
                                    >
                                        <div className="bg-white shadow-lg rounded-2xl p-5">
                                            <FileText
                                                size={42}
                                                className="text-red-500"
                                            />
                                        </div>
                                    </motion.div>
                                    <motion.h3
                                        className="mt-5 text-lg font-semibold text-gray-700 relative z-10"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                        }}
                                    >
                                        Loading PDF...
                                    </motion.h3>

                                    <p className="text-sm text-gray-500 mt-1 relative z-10">
                                        Preparing your document workspace
                                    </p>
                                    <div className="w-full max-w-xs h-2 bg-gray-200 rounded-full mt-6 overflow-hidden relative z-10">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "100%" }}
                                            transition={{
                                                duration: 1.4,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            style={{ width: "40%" }}
                                        />
                                    </div>
                                </div>
                            ) : documents.length === 0 ? (
                                <div className="border rounded-xl p-5 text-center text-gray-500">
                                    No PDF uploaded yet
                                </div>
                            ) : (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={documents[0].id}
                                        className="border rounded-xl p-4 flex justify-between items-center mb-5 bg-white"
                                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{
                                            opacity: 0,
                                            scale: 0.9,
                                            x: -40,
                                            filter: "blur(4px)",
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeOut",
                                        }}
                                        whileHover={{
                                            scale: 1.01,
                                        }}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.08, 1],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                }}
                                            >
                                                <FileText className="text-red-500 flex-shrink-0" />
                                            </motion.div>

                                            <span className="truncate max-w-[240px]">
                                                {documents[0].file_name}
                                            </span>
                                        </div>

                                        <motion.button
                                            whileHover={{
                                                scale: 1.1,
                                                rotate: -8,
                                            }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() =>
                                                handleDelete(documents[0].id)
                                            }
                                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                                        >
                                            <Trash2 size={18} />
                                        </motion.button>
                                    </motion.div>
                                </AnimatePresence>
                            )}
                            <motion.label
                                className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition relative overflow-hidden"
                                whileHover={{
                                    scale: 1.01,
                                    borderColor: "#3B82F6",
                                }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 opacity-0"
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <div className="relative z-10">
                                    <Upload className="text-blue-600 mb-2" />
                                </div>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={
                                            uploading
                                                ? "uploading"
                                                : documents.length > 0
                                                    ? "replace"
                                                    : "upload"
                                        }
                                        initial={{
                                            opacity: 0,
                                            y: 8,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -8,
                                        }}
                                        transition={{
                                            duration: 0.25,
                                        }}
                                        className="font-medium relative z-10"
                                    >
                                        {uploading
                                            ? documents.length > 0
                                                ? "Replacing PDF..."
                                                : "Uploading PDF..."
                                            : documents.length > 0
                                                ? "Replace PDF"
                                                : "Upload PDF"}
                                    </motion.span>
                                </AnimatePresence>
                                <span className="text-xs text-gray-500 mt-1 relative z-10">
                                    PDF only • Max 50MB
                                </span>
                                {uploading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-4 flex items-center gap-2 relative z-10"
                                    >
                                        {[0, 1, 2].map((dot) => (
                                            <motion.div
                                                key={dot}
                                                className="w-2.5 h-2.5 rounded-full bg-blue-500"
                                                animate={{
                                                    y: [0, -8, 0],
                                                    opacity: [0.5, 1, 0.5],
                                                }}
                                                transition={{
                                                    duration: 0.6,
                                                    repeat: Infinity,
                                                    delay: dot * 0.15,
                                                }}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                                <input
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    className="hidden"
                                    onClick={(e) => {
                                        e.target.value = null;
                                    }}
                                    onChange={handleUpload}
                                />
                            </motion.label>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}