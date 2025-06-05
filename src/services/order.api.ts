import httpClient from "./axios-config";

export const orderApi = {
    getOrders: async (
        page: number,
        size: number,
        status?: string,
        paymentStatus?: string,
        orderStatus?: string,
        paymentMethod?: string,
        deliveryMethod?: string,
        from?: string,
        to?: string,
        search?: string
    ) => {
        if (from) {
            const [day, month, year] = from.split("/");
            from = `${year}-${month}-${day}`;
        }
        if (to) {
            const [day, month, year] = to.split("/");
            to = `${year}-${month}-${day}`;
        }
        let url = `/api/v1/orders?page=${page - 1}&size=${size}`;
        if (status) {
            url += `&filter=status~'${status}'`;
        }
        if (paymentStatus) {
            url += `&filter=paymentStatus~'${paymentStatus}'`;
        }
        if (orderStatus) {
            url += `&filter=status~'${orderStatus}'`;
        }
        if (paymentMethod) {
            url += `&filter=paymentMethod~'${paymentMethod}'`;
        }
        if (deliveryMethod) {
            url += `&filter=deliveryMethod~'${deliveryMethod}'`;
        }
        if (from) {
            url += `&filter=orderDate>:'${from}'`;
        }
        if (to) {
            url += `&filter=orderDate<:'${to}'`;
        }
        if (search) {
            url += `&filter=code~'${encodeURIComponent(
                search
            )}' or shippingInformation.fullName~'${encodeURIComponent(
                search
            )}' or shippingInformation.phoneNumber~'${encodeURIComponent(search)}'`;
        }
        url += "&sort=createdAt,desc";
        const response = await httpClient.get(url);
        console.log(url);
        return response.data;
    },
    getOrdersByUser: async (
        page: number,
        size: number,
        status?: string,
        search?: string
    ) => {
        let url = `/api/v1/orders/user?page=${page - 1}&size=${size}`;
        if (status) {
            url += `&filter=status~'${status}'`;
        }
        if (search) {
            url += `&filter=code~'${encodeURIComponent(
                search
            )}' or shippingInformation.fullName~'${encodeURIComponent(
                search
            )}' or shippingInformation.phoneNumber~'${encodeURIComponent(search)}'`;
        }
        url += "&sort=createdAt,desc";
        const response = await httpClient.get(url);
        return response.data;
    },
    getOrderById: async (id: string) => {
        const response = await httpClient.get(`/api/v1/orders/${id}`);
        return response.data;
    },
    continuePayment: async (id: string) => {
        const response = await httpClient.get(`/api/v1/orders/continue-payment/${id}`);
        return response.data;
    },
    updateOrderStatus: async (id: string, status: string) => {
        const response = await httpClient.put(`/api/v1/orders/status`, { orderId: id, status });
        return response.data;
    },
    cancelOrder: async (id: string, reason: string) => {
        const response = await httpClient.put(`/api/v1/orders/status`, { orderId: id, status: "CANCELLED", reason });
        return response.data;
    },
    returnOrder: async (data: { orderId: number; reason: string; bankName: string; accountNumber: string; accountHolderName: string; imageUrls: string[] }) => {
        const response = await httpClient.post(`/api/v1/return-requests/user`, data);
        return response.data;
    },
    getReturnedOrderById: async (id: string) => {
        const response = await httpClient.get(`/api/v1/return-requests/orders/${id}`);
        return response.data;
    },
    getPresignedUrl: async (fileName: string) => {
        const [name, extension] = fileName.split(".");
        const response = await httpClient.post("/api/v1/return-requests/upload-images", {
            fileName: `${name}-${new Date().getTime()}.${extension}`,
        });
        return response.data;
    },
    uploadImage: async (presignedUrl: string, file: File) => {
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
