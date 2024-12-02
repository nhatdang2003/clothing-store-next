import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountApi } from "@/services/account.api";
import { useToast } from "./use-toast";
import { UserInfo } from "@/types/account";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export function useAccountProfile() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["account-profile"],
    queryFn: async () => {
      try {
        return await accountApi.getProfile();
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin người dùng",
          variant: "destructive",
        });
        throw error;
      }
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: UserInfo) => {
      return await accountApi.updateProfile({
        ...data,
        birthDate: data.birthDate ? format(data.birthDate, "yyyy-MM-dd") : null,
      });
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Cập nhật thông tin thành công",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["account-profile"] });
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Đã có lỗi xảy ra, vui lòng thử lại",
        variant: "destructive",
      });
    },
  });
}
