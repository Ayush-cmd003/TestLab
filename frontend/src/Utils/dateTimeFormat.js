export const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";

    return new Date(dateString)
        .toLocaleString("en-IN", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).replace(",", " •");
};