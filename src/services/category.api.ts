import type { Category, CategoryListResponse } from "@/types/category";
import http from "./http";

export const categoryApi = {
  getCategories: async (
    page: number = 1,
    pageSize: number = 10,
    search?: string
  ) => {
    let url = `/api/v1/categories?page=${page - 1}&size=${pageSize}`;
    if (search) {
      url += `&filter=name~'${encodeURIComponent(search)}'`;
    }
    url += "&sort=createdAt,desc";
    const response = await http.get({
      url,
    });
    return response.data;
  },

  addCategory: async (category: Omit<Category, "id">) => {
    console.log(category);
    const response = await http.post({
      url: "/api/v1/categories",
      body: category,
    });
    return response.data;
  },

  updateCategory: async ({ id, ...category }: Category) => {
    console.log(id, category);
    const response = await http.put({
      url: `/api/v1/categories`,
      body: {
        id,
        ...category,
      },
    });
    return response.data;
  },

  deleteCategory: async (id: number) => {
    const response = await http.delete({
      url: `/api/v1/categories/${id}`,
    });
  },
};
