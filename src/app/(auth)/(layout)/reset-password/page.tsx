"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "@/hooks/use-auth-query";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordSchema } from "@/schemas/auth.schema";
import { ResetPasswordCredentials } from "@/types/auth";

export default function ResetPasswordPage() {
  const resetPassword = useResetPassword();
  const router = useRouter();
  const searchParams = useSearchParams();
  const key = searchParams.get("key") || "";

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordCredentials>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordCredentials) => {
    try {
      await resetPassword.mutateAsync({
        data,
        key,
      });
      reset();
      router.push("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-[400px] py-10">
      <Card className="shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Đặt lại mật khẩu
          </CardTitle>
          <CardDescription className="text-center">
            Nhập mật khẩu mới của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      disabled={resetPassword.isPending}
                      className={errors.newPassword ? "border-red-500" : ""}
                    />
                    {errors.newPassword && (
                      <span className="text-sm text-red-500">
                        {errors.newPassword.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Xác nhận mật khẩu mới"
                      disabled={resetPassword.isPending}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    {errors.confirmPassword && (
                      <span className="text-sm text-red-500">
                        {errors.confirmPassword.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={resetPassword.isPending}
            >
              {resetPassword.isPending ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
