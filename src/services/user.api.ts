import { url } from "inspector";
import http from "./http";

export const userApi = {
  getUsers: async (page: number = 1, size: number = 10, search?: string) => {
    let url = `/api/v1/users?page=${page - 1}&size=${size}`;
    if (search) {
      url += `&filter=profile.fullName~'${encodeURIComponent(
        search
      )}' or email~'${encodeURIComponent(search)}'`;
    }
    const response = await http.get({
      url,
    });

    return response.data;
  },
  createUser: async (data: any) => {
    const response = await http.post({
      url: "/api/v1/users",
      body: data,
    });
    return response.data;
  },
  updateUser: async (data: any) => {
    const response = await http.put({
      url: `/api/v1/users`,
      body: data,
    });
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await http.delete({
      url: `/api/v1/users/${id}`,
    });
    return response.data;
  },
};
