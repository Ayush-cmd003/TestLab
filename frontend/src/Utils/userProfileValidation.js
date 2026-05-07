export const validateProfile = (user) => {
    const errors = {};

    if (!user.name?.trim()) errors.name = 'Full name is required';
    if (!user.username?.trim()) errors.username = 'Username is required';
    if (!user.email?.trim()) {
        errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(user.email)) {
        errors.email = 'Invalid email address';
    }

    return errors;
};

export const validatePassword = (passwords) => {
    const errors = {};

    if (!passwords.password) errors.password = 'Current password required';
    if (!passwords.new_password) {
        errors.new_password = 'New password required';
    } else if (passwords.new_password.length < 8) {
        errors.new_password = 'Minimum 8 characters';
    } else if (passwords.new_password === passwords.password) {
        errors.new_password = 'New password must be different';
    }

    return errors;
};

export const validateApiKey = (apiKey) => {
    const errors = {};
    if (!apiKey?.trim()) {
        errors.new_api_key = "API key required";
    }
    return errors;
};