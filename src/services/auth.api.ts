import type { LoginCredentials, RegisterCredentials } from "@/types/auth";
import http from "./http";
import httpClient, { tokenManager } from "./axios-config";

export const authApi = {
    login: async (data: LoginCredentials) => {
        const response = await httpClient.post('/api/v1/auth/login', data);

        console.log(response);
        if (response.data && response.data.access_token) {
            tokenManager.setAccessToken(response.data.access_token);
        }

        return response;
    },

    register: async (data: RegisterCredentials) => {
        const response = await httpClient.post('/api/v1/auth/register', data);
        return response;
    },

    refresh: async () => {
        try {
            // Gọi refresh token endpoint, cookie sẽ được gửi tự động
            const response = await httpClient.get('/api/v1/auth/refresh');

            // Cập nhật access token mới
            if (response.access_token) {
                tokenManager.setAccessToken(response.access_token);
            }

            return response;
        } catch (error) {
            tokenManager.clearTokens();
            throw error;
        }
    },

    sendVerificationEmail: async (email: string) => {
        const response = await http.get({
            url: `/api/v1/auth/send-activation-email?email=${email}`,
        });
        return response;
    },

    activateAccount: async (key: string) => {
        const response = await http.post({
            url: "/api/auth/activate",
            base_url: "",
            body: { key },
        });
        return response;
    },

    logout: async () => {
        const response = await httpClient.post('/api/v1/auth/logout', {
            refresh_token: null,
        });

        tokenManager.clearTokens();

        return response;
    },

    forgotPassword: async (data: { email: string }) => {
        const response = await http.post({
            url: "/api/v1/auth/recover-password",
            body: data,
        });
        return response;
    },

    resetPassword: async (
        data: { newPassword: string; confirmPassword: string },
        key: string
    ) => {
        const response = await http.post({
            url: `/api/v1/auth/reset-password?key=${key}`,
            body: data,
        });
        return response;
    },

    google: async (code: string) => {
        const response = await httpClient.post(`/api/v1/auth/google`, { code });

        if (response.data && response.data.access_token) {
            tokenManager.setAccessToken(response.data.access_token);
        }

        return response;
    },

    verifyOtp: async (data: { email: string, activationCode: string }) => {
        const response = await httpClient.post('/api/v1/auth/activate-code', data);

        console.log(response);
        if (response.data && response.data.access_token) {
            tokenManager.setAccessToken(response.data.access_token);
        }

        return response;
    },
};
