"use client";

import { useLogout } from "@/hooks/use-auth-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function Logout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const logoutExecuted = useRef(false);
  const { mutateAsync: logout } = useLogout(redirect ?? "/");

  useEffect(() => {
    const handleLogout = async () => {
      if (logoutExecuted.current) return;
      logoutExecuted.current = true;

      try {
        await logout();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        router.push(redirect ?? "/");
        router.refresh();
      }
    };

    handleLogout();
  }, [logout, router]);

  return <div>Đang đăng xuất...</div>;
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Đang đăng xuất...</div>}>
      <Logout />
    </Suspense>
  );
}
