import http from "./http";

export const orderApi = {
  getOrders: async (page: number, size: number, status?: string) => {
    let url = `/api/v1/orders?page=${page}&size=${size}`;
    if (status) {
      url += `&filter=status~'${status}'`;
    }
    url += "&sort=createdAt,desc";
    const response = await http.get({
      url,
    });
    return response.data;
  },
  getOrdersByUser: async (page: number, size: number, status?: string) => {
    let url = `/api/v1/orders/user?page=${page}&size=${size}`;
    if (status) {
      url += `&filter=status~'${status}'`;
    }
    url += "&sort=createdAt,desc";
    const response = await http.get({
      url,
    });
    return response.data;
  },
};
