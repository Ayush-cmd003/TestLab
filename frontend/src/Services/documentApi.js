import http from "./api";

const BASE = "/features";

export const featureDocumentService = {
    getDocument: (feature_id) => http.get(`${BASE}/${feature_id}/documents/`),
    uploadDocument: (feature_id, file) => {
        const formData = new FormData();
        formData.append("document", file);
        return http.post(`${BASE}/${feature_id}/documents/upload_documents`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    deleteDocument: (feature_id, document_id) => http.delete(`${BASE}/${feature_id}/documents/delete_document/${document_id}`),
};