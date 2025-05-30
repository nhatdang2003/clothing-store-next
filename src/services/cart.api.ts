import { CartItem } from "@/types/cart";
import http from "./http";
import httpClient from "./axios-config";

export const cartApi = {
    getCart: async () => {
        const response = await httpClient.get('/api/v1/carts/items');
        return response.data;
    },
    addToCart: async (variantId: number, quantity: number) => {
        const response = await httpClient.post('/api/v1/carts/items', {
            productVariantId: variantId,
            quantity,
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
