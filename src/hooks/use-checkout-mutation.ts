import { useMutation } from "@tanstack/react-query";
import { checkoutApi } from "@/services/checkout.api";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";

interface CreateOrderData {
  cartItemIds: number[];
  note: string;
  paymentMethod: string;
  deliveryMethod: string;
  shippingProfileId: number;
}

export function useCreateOrder() {
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: CreateOrderData) => {
      return await checkoutApi.createOrder(data);
    },
    onSuccess: (response) => {
      toast({
        title: "Đặt hàng thành công",
        description: "Đơn hàng của bạn đã được tạo thành công",
        variant: "success",
      });

      // Xóa selected items khỏi localStorage
      localStorage.removeItem("selectedItems");

      // Chuyển hướng đến trang chi tiết đơn hàng
      router.push(`/account/orders/${response.id}`);
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
