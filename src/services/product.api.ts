import http from "./http";

export const productApi = {
  getProducts: async (
    page: number,
    size: number,
    categories?: string,
    minPrice?: number,
    maxPrice?: number,
    rating?: number,
    colors?: string,
    sizes?: string
  ) => {
    let url = `/api/v1/products?page=${page - 1}&size=${size}`;
    if (minPrice) {
      url += `&minPrice=${minPrice}`;
    }
    if (maxPrice) {
      url += `&maxPrice=${maxPrice}`;
    }
    if (rating) {
      url += `&averageRating=${rating}`;
    }
    if (categories && categories.length > 0) {
      url += `&filter=category.id in [${categories}]`;
    }
    if (colors && colors.length > 0) {
      const arrColor = colors.split(",");
      url += `&filter=(${arrColor
        .map((color) => `variants.color~'${color}'`)
        .join(" or ")})`;
    }
    if (sizes && sizes.length > 0) {
      const arrSize = sizes.split(",");
      url += `&filter=(${arrSize
        .map((size) => `variants.size~'${size}'`)
        .join(" or ")})`;
    }

    const response = await http.get({
      url,
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
    return response.data;
  },
  getLatestProducts: async () => {
    const response = await http.get({
      url: `/api/v1/products?sort=createdAt&order=desc`,
    });
    return response.data;
  },
  getBestSellerProducts: async () => {
    const response = await http.get({
      url: `/api/v1/products?isBestSeller&days=30`,
    });
    return response.data;
  },
  getDiscountProducts: async () => {
    const response = await http.get({
      url: `/api/v1/products?isDiscounted`,
    });
    return response.data;
  },
  getProductsByCategory: async (category: string) => {
    const response = await http.get({
      url: `/api/v1/products?filter=category.id:${category}`,
    });
    return response.data;
  },
  getProductsBySearch: async (search: string) => {
    const response = await http.get({
      url: `/api/v1/products?filter=name~'${encodeURIComponent(search)}'`,
    });
    return response.data;
  },
};
