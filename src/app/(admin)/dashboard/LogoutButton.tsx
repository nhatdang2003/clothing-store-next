"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-auth-query";

export function LogoutButton() {
  const { mutate: logout, isPending } = useLogout();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => logout()}
      disabled={isPending}
    >
      {isPending ? (
        <span>Đang đăng xuất...</span>
      ) : (
        <>
          <LogOut className="w-4 h-4 mr-2" />
          <span>Đăng xuất</span>
        </>
      )}
    </Button>
  );
}
