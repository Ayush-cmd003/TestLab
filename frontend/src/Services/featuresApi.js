import http from "./api";

const BASE = `/features`;

export const featureService = {
    getAllFeatures: () => http.get(`${BASE}/all_features`),
    createProjectFeature: (data) => http.post(`${BASE}/add_feature`, data),
    editProjectFeature: (feature_id, data) => http.patch(`${BASE}/update_feature/${feature_id}`, data),
    deleteProjectFeature: (feature_id) => http.delete(`${BASE}/delete_feature/${feature_id}`),
    searchProjectFeature: (feature_name,signal) => http.get(`${BASE}/search_features?feature_name=${feature_name}`, { signal }),
};