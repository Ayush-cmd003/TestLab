import http from "./api";

const BASE = `/projects`;

export const projectFeatureService = {
    getProjectFeatures: (id_of_project) => http.get(`${BASE}/${id_of_project}/features/all_features`),
    createProjectFeature: (id_of_project, data) => http.post(`${BASE}/${id_of_project}/features/add_feature`, data),
    editProjectFeature: (id_of_project, feature_id, data) => http.patch(`${BASE}/${id_of_project}/features/update_feature/${feature_id}`, data),
    deleteProjectFeature: (id_of_project, feature_id) => http.delete(`${BASE}/${id_of_project}/features/delete_feature/${feature_id}`),
    searchProjectFeature: (id_of_project, feature_name,signal) => http.get(`${BASE}/${id_of_project}/features/search_features?feature_name=${feature_name}`, { signal }),
};