import http from "./api";

const BASE = "/auth";

export const userVerificationService = {
    verifyOtp: (data) => http.post(`${BASE}/verify-otp`, data),
    resendOtp: (data) => http.post(`${BASE}/resend-otp`, data),
};