import http from "./http";

export const productApi = {
  getProducts: async (page: number, size: number) => {
    const response = await http.get({
      url: `/api/v1/products?page=${page}&size=${size}`,
    });
    return response.data;
  },
  getProductBySlug: async (slug: string) => {
    const response = await http.get({
      url: `/api/v1/products/${slug}`,
    });
    return response.data;
  },
  getFeaturedProducts: async () => {
    const response = await http.get({
      url: `/api/v1/products?filter=isFeatured`,
    });
    return response;
  },
  getLatestProducts: async () => {
    const response = await http.get({
      url: `/api/v1/products?sort=createdAt&order=desc`,
    });
    return response;
  },
  getBestSellerProducts: async () => {
    const response = await http.get({
      url: `/api/v1/products?isBestSeller&days=30`,
    });
    return response;
  },
  getDiscountProducts: async () => {
    const response = await http.get({
      url: `/api/v1/products?isDiscounted`,
    });
    return response;
  },
  getProductsByCategory: async (category: string) => {
    const response = await http.get({
      url: `/api/v1/products?filter=category.id:${category}`,
    });
    return response;
  },
};
