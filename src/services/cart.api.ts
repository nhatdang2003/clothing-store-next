import { CartItem } from "@/types/cart";
import http from "./http";

export const cartApi = {
  getCart: async () => {
    const response = await http.get({ url: "/api/v1/carts/items" });
    console.log(response);
    return response.data;
  },
  addToCart: async (variantId: number, quantity: number) => {
    const response = await http.post({
      url: "/api/v1/carts/items",
      body: {
        productVariantId: variantId,
        quantity,
      },
    });
    return response;
  },
  updateCartItem: async (item: CartItem) => {
    const response = await http.put({
      url: `/api/v1/carts/items`,
      body: item,
    });
    return response;
  },
  deleteCartItem: async (cartItemId: string) => {
    const response = await http.delete({
      url: `/api/v1/carts/items/${cartItemId}`,
    });
    return response;
  },
};
