"use client";

import { authApi } from "@/services/auth.api";
import http from "@/services/http";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function RefreshToken() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPathname = searchParams.get("redirect");
  const firstRender = useRef(false);

  useEffect(() => {
    const refreshToken = async () => {
      await authApi.refresh();
      router.push(redirectPathname || "/");
    };
    if (!firstRender.current) {
      firstRender.current = true;
      refreshToken();
    }
  }, [router, redirectPathname]);
  return <div>Loading...</div>;
}

export default function RefreshTokenPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshToken />
    </Suspense>
  );
}
