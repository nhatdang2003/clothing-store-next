import http from "./http";

export const revalidateApi = {
  Cart: async () => {
    const response = await http.post({
      url: "/api/revalidate/cart",
      base_url: "",
    });
    return response.data;
  },
};
