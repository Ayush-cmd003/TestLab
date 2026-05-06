import http from "./api";

export const loginUser = (username, password) => {
    const loginData = new URLSearchParams();
    loginData.append("username", username)
    loginData.append("password", password)
    return http.post("/auth/token", loginData,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    )
}

export const registerUser = (data) => {
    return http.post("/auth/", data)
};

export const validateKey = (data) => {
    return http.post("/auth/validate-key", data)
}