import http from "./http";

export const orderApi = {
  getOrdersByUser: async (page: number, size: number, status?: string) => {
    let url = `/api/v1/orders/user?page=${page}&size=${size}`;
    if (status) {
      url += `&filter=status~'${status}'`;
    }
    const response = await http.get({
      url,
    });
    return response.data;
  },
};
