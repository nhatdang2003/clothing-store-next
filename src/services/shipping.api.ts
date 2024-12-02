import { ShippingInfoSchema } from "@/schemas/shipping-info.schema";
import http from "./http";

export const shippingApi = {
  getShippingInfo: async () => {
    const response = await http.get({ url: "/api/v1/shipping-profiles" });
    return response.data;
  },
  createShippingInfo: async (data: ShippingInfoSchema) => {
    const response = await http.post({
      url: "/api/v1/shipping-profiles",
      body: data,
    });
    return response.data;
  },
  updateShippingInfo: async (data: ShippingInfoSchema) => {
    const response = await http.put({
      url: "/api/v1/shipping-profiles",
      body: data,
    });
    return response.data;
  },
  deleteShippingInfo: async (id: string) => {
    const response = await http.delete({
      url: `/api/v1/shipping-profiles/${id}`,
    });
    return response.data;
  },
  setDefaultShippingProfile: async (id: string) => {
    const response = await http.post({
      url: `/api/v1/shipping-profiles/default`,
      body: { shippingProfileId: id },
    });
    return response.data;
  },
};
