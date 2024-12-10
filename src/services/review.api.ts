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
};
