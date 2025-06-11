import httpClient from "./axios-config";

export const reviewApi = {
    getShippingInfo: async () => {
        const response = await httpClient.get("/api/v1/shipping-profiles");
        return response.data;
    },
    getReviewByProduct: async (slug: string, page: number, size: number) => {
        const response = await httpClient.get(`/api/v1/products/${slug}/reviews?page=${page - 1}&size=${size}`);
        return response.data;
    },
    getReviewByOrder: async (orderId: string) => {
        const response = await httpClient.get(`/api/v1/orders/user/${orderId}/reviews`);
        return response.data;
    },
    createReview: async (data: any) => {
        const response = await httpClient.post("/api/v1/orders/user/reviews", data);
        return response.data;
    },
    updateReview: async (data: any) => {
        const response = await httpClient.put("/api/v1/orders/user/reviews", data);
        return response.data;
    },
    getSignedUrls: async (data: { fileNames: string[] }) => {
        const response = await httpClient.post("/api/v1/orders/user/reviews/upload", data);
        return response.data;
    },
    uploadMedia: async (presignedUrl: string, file: File) => {
        const response = await fetch(presignedUrl, {
            method: "PUT",
            body: file,
            headers: {
                "Content-Type": file.type,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to upload image");
        }
        return response;
    },
};
