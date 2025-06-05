import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkoutApi } from "@/services/checkout.api";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";

interface CreateOrderData {
    cartItemIds: number[];
    note: string;
    paymentMethod: string;
    deliveryMethod: string;
    shippingProfileId: number;
    isUsePoint: boolean
}

export function useCreateOrder() {
    const { toast } = useToast();
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateOrderData) => {
            return await checkoutApi.createOrder(data);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toast({
                title: "Đặt hàng thành công",
                description: "Đơn hàng của bạn đã được tạo thành công",
                variant: "success",
            });

            // Xóa selected items khỏi localStorage
            localStorage.removeItem("selectedItems");

            if (response.paymentMethod === "COD") {
                router.push(`/account/orders`);
            } else {
                router.push(response.paymentUrl);
            }

            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: () => {
            toast({
                title: "Đặt hàng thất bại",
                description: "Đã có lỗi xảy ra, vui lòng thử lại",
                variant: "destructive",
            });
        },
    });
}
