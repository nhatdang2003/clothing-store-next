import { useMutation } from "@tanstack/react-query";
import { authKeys } from "./use-auth-query";
import { workspaceApi } from "@/services/workspace.api";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";
import { AFTER_LOGIN } from "@/constants/workspace";

type WorkspaceRole = keyof typeof AFTER_LOGIN;

export function useLoginWorkspace(redirect: string) {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["auth", "login-workspace"],
    mutationFn: (data: any) => workspaceApi.login(data),
    onSuccess: (data: any) => {
      console.log(data);
      const role = `ROLE_${data.role?.name}` as WorkspaceRole;

      router.push(AFTER_LOGIN[role]);
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
