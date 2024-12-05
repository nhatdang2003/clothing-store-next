import { ChangePasswordRequest } from "@/types/account";
import http from "./http";

export const accountApi = {
  getInfo: async () => {
    const response = await http.get({ url: "/api/v1/users/info" });
    return response.data;
  },
  getProfile: async () => {
    const response = await http.get({ url: "/api/v1/users/profiles" });
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await http.put({
      url: "/api/v1/users/edit-profile",
      body: data,
    });
    return response.data;
  },
  getShippingInfo: async () => {
    const response = await http.get({ url: "/api/v1/shipping-profiles" });
    return response.data;
  },
  changePassword: async (data: ChangePasswordRequest) => {
    const response = await http.put({
      url: "/api/v1/users/change-password",
      body: data,
    });
    return response.data;
  },
};
