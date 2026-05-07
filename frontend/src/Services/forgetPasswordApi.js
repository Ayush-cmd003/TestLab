import http from "./api";

const BASE = "/auth";

export const forgotPasswordService = {
    forgotPassword: (data) => http.post(`${BASE}/forgot-password`, data),
    resetPassword: (data) => http.post(`${BASE}/reset-password`, data),
};