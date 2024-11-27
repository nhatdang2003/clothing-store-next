import { LoginFormData } from "@/schemas/auth.schema";
import http from "./http";
import Cookies from "js-cookie";
import { url } from "inspector";

export const authApi = {
  // Sử dụng local API routes
  login: async (data: LoginFormData) => {
    const response = await http.post({
      url: "/api/auth/login",
      base_url: "",
      body: data,
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
  refresh: async () => {
    const response = await http.get({
      url: "/api/auth/refresh-token",
      base_url: "",
    });
    return response;
  },
};
