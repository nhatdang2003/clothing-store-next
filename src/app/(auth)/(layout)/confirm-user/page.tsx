"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useActivateAccount } from "@/hooks/use-auth-query";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ConfirmUserPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmUserContent />
    </Suspense>
  );
}

function ConfirmUserContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAutoActivating, setIsAutoActivating] = useState(true);
  const { mutate: activate, isPending } = useActivateAccount();
  const firstRender = useRef(false);

  useEffect(() => {
    const key = searchParams.get("key");
    if (key && isAutoActivating && !firstRender.current) {
      firstRender.current = true;
      activate(key, {
        onError: () => {
          setIsAutoActivating(false);
        },
      });
    }
  }, [searchParams, activate, isAutoActivating]);

  const handleManualActivate = () => {
    const key = searchParams.get("key");
    if (key) {
      activate(key);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 rounded-xl bg-white bg-opacity-90 p-8 shadow-lg backdrop-blur-sm text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h2 className="text-2xl font-semibold">Đang xác thực tài khoản...</h2>
          <p className="text-gray-500">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  if (!isAutoActivating) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 rounded-xl bg-white bg-opacity-90 p-8 shadow-lg backdrop-blur-sm text-center">
          <h2 className="text-2xl font-semibold text-red-600">
            Xác thực thất bại
          </h2>
          <p className="text-gray-500">
            Có lỗi xảy ra trong quá trình xác thực tài khoản của bạn.
          </p>
          <Button onClick={handleManualActivate} className="w-full">
            Thử lại
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/login")}
            className="w-full"
          >
            Quay lại trang đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
