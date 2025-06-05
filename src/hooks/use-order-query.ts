import { orderApi } from "@/services/order.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

export const useOrder = (id: string) => {
    return useQuery({
        queryKey: ["order", id],
        queryFn: () => orderApi.getOrderById(id),
        enabled: !!id,
    });
};

export const useOrders = ({
    page = 1,
    size = 6,
    status = "",
    search = "",
}: {
    page?: number;
    size?: number;
    status?: string;
    search?: string;
}) => {
    return useQuery({
        queryKey: ["orders", page, size, status, search],
        queryFn: () => orderApi.getOrdersByUser(page, size, status, search),
    });
};

export const useUpdateOrderStatus = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { orderId: string; status: string }) =>
            orderApi.updateOrderStatus(data.orderId, data.status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toast({
                title: "Thành công",
                description: "Cập nhật trạng thái thành công",
                variant: "success",
            });
        },
        onError: () => {
            toast({
                title: "Thất bại",
                description: "Cập nhật trạng thái thất bại",
                variant: "destructive",
            });
        },
    });
};

export const useCancelOrder = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { orderId: string; reason: string }) =>
            orderApi.cancelOrder(data.orderId, data.reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toast({
                title: "Thành công",
                description: "Hủy đơn hàng thành công",
                variant: "success",
            });
        },
        onError: () => {
            toast({
                title: "Thất bại",
                description: "Hủy đơn hàng thất bại",
                variant: "destructive",
            });
        },
    });
};

export const useReturnOrder = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { orderId: number; reason: string; bankName: string; accountNumber: string; accountHolderName: string; imageUrls: string[] }) =>
            orderApi.returnOrder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toast({
                title: "Thành công",
                description: "Hoàn trả đơn hàng thành công",
                variant: "success",
            });
        },
        onError: () => {
            toast({
                title: "Thất bại",
                description: "Hoàn trả đơn hàng thất bại",
                variant: "destructive",
            });
        },
    });
};

export const useGetReturnedOrderById = (id: string) => {
    return useQuery({
        queryKey: ["returned-order", id],
        queryFn: () => orderApi.getReturnedOrderById(id),
        enabled: !!id,
    });
};
