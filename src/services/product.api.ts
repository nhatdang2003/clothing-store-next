import http from "./http";

export const productApi = {
  getProducts: async (page: number, size: number) => {
    const response = await http.get({
      url: `/api/v1/products?page=${page}&size=${size}`,
    });
    return response;
  },
};
