import { toast } from "sonner";

export const downloadFile = ({content, fileName, type = "text/plain;charset=utf-8;", setLoading}) => {
    try {
        if (!content) {
            toast.error("No data to download");
            return;
        }
        if (setLoading) {
            setLoading(true);
        }
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
        toast.info("Downloading...");
    } catch {
        toast.error("Download failed");
    } finally {
        if (setLoading) {
            setLoading(false);
        }
    }
};