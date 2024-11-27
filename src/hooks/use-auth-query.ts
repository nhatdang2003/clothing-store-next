import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "@/services/auth.api";
import { LoginFormData } from "@/schemas/auth.schema";
import { useRouter } from "next/navigation";
import { useToast } from "./use-toast";
import { useAuthStore } from "@/store/auth-store";
import useStore from "./use-store";
import type { User } from "@/types/store";

export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
  login: () => [...authKeys.all, "login"] as const,
};

export function useLogin() {
  const router = useRouter();
  const { toast } = useToast();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: () => {
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn quay trở lại!",
      });

      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Đăng nhập thất bại",
        description:
          error.message || "Vui lòng kiểm tra lại thông tin đăng nhập",
      });
    },
  });
}

export function useProfile() {
  const access_token = useStore(useAuthStore, (state) => state.access_token);

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authApi.getProfile(),
    enabled: !!token,
  });
}

export function useLogout() {
  const router = useRouter();
  const { toast } = useToast();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      toast({
        title: "Đăng xuất thành công",
      });

      router.push("/login");
    },
    onError: () => {
      if (logout) {
        // Kiểm tra null/undefined
        logout();
      }

      toast({
        title: "Đăng xuất thành công",
      });

      router.push("/login");
    },
  });
}
