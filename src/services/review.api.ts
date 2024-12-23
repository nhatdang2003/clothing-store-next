import http from "./http";

export const reviewApi = {
  getShippingInfo: async () => {
    const response = await http.get({ url: "/api/v1/shipping-profiles" });
    return response.data;
  },
  getReviewByProduct: async (slug: string) => {
    const response = await http.get({
      url: `/api/v1/products/${slug}/reviews`,
    });
    return response.data;
  },
  getReviewByOrder: async (orderId: string) => {
    const response = await http.get({
      url: `/api/v1/orders/user/${orderId}/reviews`,
    });
    return response.data;
  },
  createReview: async (data: any) => {
    const response = await http.post({
      url: "/api/v1/orders/user/reviews",
      body: data,
    });
    return response.data;
  },
  updateReview: async (data: any) => {
    const response = await http.put({
      url: `/api/v1/orders/user/reviews`,
      body: data,
    });
    return response.data;
  },
};
