import http from "./api";

const BASE = "/users";

export const userService = {
    loggedInUser: () => http.get(`${BASE}/current_user`),
    updatePassword: (data) => http.post(`${BASE}/update_password`, data),
    passwordChangeOtp: (data) => http.post(`${BASE}/send-change-password-otp`, data),
    updateApiKey: (data) => http.post(`${BASE}/update_api_key`, data),
    updateUser: (data) => http.patch(`${BASE}/update_profile`, data),
};