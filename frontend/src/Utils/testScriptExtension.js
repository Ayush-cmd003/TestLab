export const languageExtensionMap = {
    TypeScript: "ts",
    JavaScript: "js",
    Java: "java",
    Python: "py",
    "C#": "cs",
    Ruby: "rb",
};

export const getFileExtension = (language) => {
    if (!language) return "txt";

    return languageExtensionMap[language] || "txt";
};