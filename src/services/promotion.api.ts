import http from "./http";

export const promotionApi = {
  getPromotions: async (
    page: number = 1,
    pageSize: number = 10,
    search?: string
  ) => {
    let url = `/api/v1/promotions?page=${page - 1}&size=${pageSize}`;
    if (search) {
      url += `&filter=name~'${encodeURIComponent(search)}'`;
    }
    const response = await http.get({
      url,
    });
    return response.data;
  },
  createPromotion: (data: any) => {
    return http.post({
      url: "/api/v1/promotions",
      body: data,
    });
  },
  updatePromotion: ({ id, ...data }: any) => {
    return http.put({
      url: `/api/v1/promotions/${id}`,
      body: data,
    });
  },
  deletePromotion: (id: number) => {
    return http.delete({
      url: `/api/v1/promotions/${id}`,
    });
  },
};
