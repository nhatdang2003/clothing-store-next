"use client";

import { useLogout } from "@/hooks/use-auth-query";
import useStore from "@/hooks/use-store";
import { getRefreshToken } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function Logout() {
  const { mutateAsync: logout } = useLogout();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const ref = useRef<any>(null);

  useEffect(() => {
    if (
      !ref.current &&
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshToken()
    ) {
      console.log("đã vào để logout");
      ref.current = logout;
      logout().then((res) => {
        setTimeout(() => {
          ref.current = null;
        }, 1000);
        router.push("/login");
      });
    } else {
      router.push("/");
    }
  }, [logout, router, refreshTokenFromUrl]);
  return <div>Log out....</div>;
}
export default function LogoutPage() {
  return (
    <Suspense>
      <Logout />
    </Suspense>
  );
}
