import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/auth.api";
import { useRouter } from "next/navigation";
import { toast, useToast } from "./use-toast";
import type { LoginCredentials, RegisterCredentials } from "@/types/auth";
import { PROTECTED_PATHS } from "@/constants/routes";

export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
  login: () => [...authKeys.all, "login"] as const,
  register: () => [...authKeys.all, "register"] as const,
};

export function useLogin(redirect: string) {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationKey: authKeys.login(),
    mutationFn: (data: LoginCredentials) => authApi.login(data),
    onSuccess: () => {
      router.push(redirect ?? "/");
      router.refresh();
    },
    onError: (error: any) => {
      console.log(error.message);
      toast({
        variant: "destructive",
        title: error?.message || "Đăng nhập thất bại",
      });
    },
  });
}

export function useRegister() {
  const { toast } = useToast();

  const sendVerification = useMutation({
    mutationFn: (email: string) => authApi.sendVerificationEmail(email),
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterCredentials) => authApi.register(data),
    onSuccess: (_, variables) => {
      // After successful registration, send verification email
      sendVerification.mutate(variables.email, {
        onSuccess: () => {
          toast({
            title: "Đăng ký thành công",
            description:
              "Vui lòng kiểm tra email để xác thực tài khoản của bạn",
            variant: "success",
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Không thể gửi email xác thực. Vui lòng thử lại sau.",
          });
        },
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error?.message || "Đã có lỗi xảy ra khi đăng ký",
      });
    },
  });

  return {
    ...registerMutation,
    isPending: registerMutation.isPending || sendVerification.isPending,
  };
}

export function useActivateAccount() {
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: (key: string) => authApi.activateAccount(key),
    onSuccess: () => {
      toast({
        title: "Xác thực thành công",
        description:
          "Tài khoản của bạn đã được kích hoạt. Chúc bạn mua hàng vui vẻ!",
        variant: "success",
      });
      router.push("/");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          error?.message || "Không thể kích hoạt tài khoản. Vui lòng thử lại.",
      });
    },
  });
}

export function useLogout(redirect: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const data = await authApi.logout();
      return data;
    },
    onSuccess: () => {
      // Clear all queries and cache
      queryClient.clear();
      if (PROTECTED_PATHS.some((path) => redirect.startsWith(path))) {
        router.push("/login");
      } else {
        router.push(redirect ?? "/");
      }
      router.refresh();
    },
  });
}

export const useForgotPassword = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: { email: string }) => authApi.forgotPassword(data),
    onSuccess: () => {
      toast({
        title: "Yêu cầu đặt lại mật khẩu đã được gửi",
        description: "Vui lòng kiểm tra email của bạn.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Đã có lỗi xảy ra",
      });
    },
  });
};

export const useResetPassword = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({
      data,
      key,
    }: {
      data: { newPassword: string; confirmPassword: string };
      key: string;
    }) => authApi.resetPassword(data, key),
    onSuccess: () => {
      toast({
        title: "Mật khẩu đã được đặt lại thành công",
        description: "Vui lòng đăng nhập.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Đã có lỗi xảy ra",
      });
    },
  });
};
