import http from "./http";

export const orderApi = {
  getOrders: async (
    page: number,
    size: number,
    status?: string,
    paymentStatus?: string,
    orderStatus?: string,
    paymentMethod?: string,
    deliveryMethod?: string,
    search?: string
  ) => {
    let url = `/api/v1/orders?page=${page}&size=${size}`;
    if (status) {
      url += `&filter=status~'${status}'`;
    }
    if (paymentStatus) {
      url += `&filter=paymentStatus~'${paymentStatus}'`;
    }
    if (orderStatus) {
      url += `&filter=status~'${orderStatus}'`;
    }
    if (paymentMethod) {
      url += `&filter=paymentMethod~'${paymentMethod}'`;
    }
    if (deliveryMethod) {
      url += `&filter=deliveryMethod~'${deliveryMethod}'`;
    }
    if (search) {
      url += `&filter=code~'${search}'`;
    }
    url += "&sort=createdAt,desc";
    const response = await http.get({
      url,
    });
    console.log(url);
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
