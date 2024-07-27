import axios from "../axios";

export const apiSignUp = (data) => axios({
   url: "/api/v1/auth/signup",
    method: "POST",
    data,
    withCredentials: true
});

export const apiLogin = (data) => axios({
    url: "/api/v1/auth/login",
    method: "POST",
    data
});

export const apiResendVerifyEmail = (data) => axios({
    url: "/api/v1/auth/resend-verify-email",
    method: "POST",
    data
});

export const apiForgotPassword = (data) => axios({
    url: "/api/v1/auth/forgot-password",
    method: "POST",
    data
});

export const apiResetPassword = (data) => axios({
    url: "/api/v1/auth/reset-password",
    method: "POST",
    data
});
