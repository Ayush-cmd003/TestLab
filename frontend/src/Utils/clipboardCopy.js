import { toast } from "sonner";

export const copyToClipboard = async ( text, id, setCopiedId ) => {
    try {
        await navigator.clipboard.writeText(text);

        if (setCopiedId) {
            setCopiedId(id);

            setTimeout(() => {
                setCopiedId(null);
            }, 2000);
        }

        toast.success("Copied successfully");
    } catch {
        toast.error("Copy failed");
    }
};