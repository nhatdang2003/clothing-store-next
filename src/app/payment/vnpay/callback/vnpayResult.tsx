"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { checkoutApi } from "@/services/checkout.api";

export default function VNPayResult() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const validatePayment = async () => {
      try {
        // Lấy tất cả query params từ URL
        const queryString = Array.from(searchParams.entries())
          .map(([key, value]) => `${key}=${value}`)
          .join("&");

        const response = await checkoutApi.vnpayReturn(queryString);

        if (response.statusCode === 200) {
          setStatus("success");
          setMessage("Thanh toán thành công!");
        } else {
          setStatus("error");
          setMessage(response.message || "Thanh toán thất bại!");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Có lỗi xảy ra trong quá trình xử lý thanh toán!");
      }
    };

    validatePayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            {status === "loading" && (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
                <p className="text-lg font-medium">Đang xử lý thanh toán...</p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <div className="text-center">
                  <p className="text-lg font-medium text-green-500">
                    Thanh toán thành công!
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{message}</p>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="h-12 w-12 text-red-500" />
                <div className="text-center">
                  <p className="text-lg font-medium text-red-500">
                    Thanh toán thất bại!
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{message}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center gap-4">
          {status !== "loading" && (
            <>
              <Button
                variant="outline"
                onClick={() => router.push("/account/orders")}
              >
                Xem đơn hàng
              </Button>
              <Button onClick={() => router.push("/")}>Về trang chủ</Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
