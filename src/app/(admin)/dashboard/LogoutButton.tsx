"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-auth-query";
import { useEffect } from "react";
import axios from "axios";
import { localApi } from "@/services/axios-config-client";
import http from "@/services/http";

export function LogoutButton() {
  const { mutate: logout, isPending } = useLogout();

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await http.get({ url: "/api/v1/products" });
      console.log(response);
    };
    fetchProduct();
  }, []);

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
