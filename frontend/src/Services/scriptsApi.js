import http from "./api";

const BASE = "/test-cases";

export const testCaseScriptService = {
    getScript: (testcase_id) => http.get(`${BASE}/${testcase_id}/scripts/`),
    generateScript: (testcase_id, data) => http.post(`${BASE}/${testcase_id}/scripts/generate_script`, data),
    deleteScript: (testcase_id, script_id) => http.delete(`${BASE}/${testcase_id}/scripts/delete_script/${script_id}`),
};