import http from "./api";

const BASE = "/projects";

export const projectService = {
    getProjects: () => http.get(`${BASE}/`),
    createProject: (data) => http.post(`${BASE}/create_project`, data),
    updateProject: (id, data) => http.patch(`${BASE}/update_project/${id}`, data),
    deleteProject: (id) => http.delete(`${BASE}/delete_project/${id}`),
    searchProjects: (query, signal) =>
        http.get(`${BASE}/search_project?project_name=${query}`, { signal }),
};