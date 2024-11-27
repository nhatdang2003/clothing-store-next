import http from "./http";

export const categoryApi = {
  getCategories: async () => {
    const response = await http.get({ url: "/api/v1/categories" });
    return response.data;
  },
};
