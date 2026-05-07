import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteVersionModal({open,onClose,onConfirm,currentVersion}) {
    const [deleting, setDeleting] = useState(false);
    
    if (!open) return null;

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await onConfirm();
            onClose();
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
                initial={{opacity: 0,scale: 0.94,y: 10,}}
                animate={{opacity: 1,scale: 1,y: 0,}}
                exit={{opacity: 0,scale: 0.94,}}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl"
            >
                <div className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center">
                            <Trash2
                                size={28}
                                className="text-red-600"
                            />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                Delete Version
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-5">
                    <div className="bg-slate-50 border rounded-2xl p-4 mb-4">
                        <p className="text-sm text-slate-500">
                            You are deleting:
                        </p>

                        <p className="font-semibold mt-1">
                            {currentVersion?.label}
                        </p>

                        <p className="text-sm text-slate-500 mt-2">
                            {currentVersion?.items?.length || 0} test
                            cases will be removed.
                        </p>
                    </div>
                    <p className="text-sm text-slate-600">
                        Are you sure you want to continue?
                    </p>
                </div>
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={deleting}
                        className="flex-1 px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 px-5 py-3 rounded-2xl bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {deleting ? (
                            <>
                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 size={18} />
                                Delete
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}