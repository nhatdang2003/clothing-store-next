"use client";

import { useLogout } from "@/hooks/use-auth-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function Logout() {
  const { mutateAsync: logout } = useLogout();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const logoutExecuted = useRef(false);

  useEffect(() => {
    const handleLogout = async () => {
      if (logoutExecuted.current) return;
      logoutExecuted.current = true;

      try {
        await logout();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        if (refreshTokenFromUrl) {
          router.push(`/refresh-token?redirect=${encodeURIComponent("/")}`);
        } else {
          router.push("/");
        }
      }
    };

    handleLogout();
  }, [logout, router, refreshTokenFromUrl]);

  return <div>Đang đăng xuất...</div>;
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Đang đăng xuất...</div>}>
      <Logout />
    </Suspense>
  );
}
