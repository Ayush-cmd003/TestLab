import http from "./api";

const BASE = "/features";

export const featureTestCaseService = {
    getTestCases: (feature_id) => http.get(`${BASE}/${feature_id}/test-cases/`),
    searchTestCases: (feature_id, query, signal) => http.get(`${BASE}/${feature_id}/test-cases/search_testcases?testcase_id=${query}`, { signal }),
    generateTestCases: (feature_id) => http.post(`${BASE}/${feature_id}/test-cases/generate_testcase`),
    deleteTestCases: (feature_id, id_of_testcase) => http.delete(`${BASE}/${feature_id}/test-cases/delete_testcase/${id_of_testcase}`),
};