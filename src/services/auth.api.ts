import type { LoginCredentials, RegisterCredentials } from "@/types/auth";
import http from "./http";

export const authApi = {
  login: async (data: LoginCredentials) => {
    const response = await http.post({
      url: "/api/auth/login",
      base_url: "",
      body: data,
    });
    return response;
  },

  register: async (data: RegisterCredentials) => {
    const response = await http.post({
      url: "/api/v1/auth/register",
      body: data,
    });
    return response;
  },

  refresh: async () => {
    const response = await http.get({
      url: "/api/auth/refresh-token",
      base_url: "",
    });
    return response;
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
    const response = await http.get({
      url: "/api/auth/logout",
      base_url: "",
    });
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
};
