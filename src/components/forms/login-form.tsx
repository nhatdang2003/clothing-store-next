"use client";

import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Lock,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema } from "@/schemas/auth.schema";
import type { LoginCredentials } from "@/types/auth";
import { useLogin } from "@/hooks/use-auth-query";

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (values: LoginCredentials) => {
    login(values);
  };

  return (
    <div className="w-full max-w-md space-y-2 rounded-xl bg-white bg-opacity-90 p-8 shadow-lg backdrop-blur-sm">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Đăng nhập</h2>
        <p className="mt-2 text-sm text-gray-600">
          Truy cập tài khoản để tiến hành mua sắm và nhận ưu đãi
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Email"
                        {...field}
                        className="pl-10 py-2 border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                        className="pl-10 py-2 border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none text-gray-700 !mt-[1px]">
                      Ghi nhớ đăng nhập
                    </FormLabel>
                  </FormItem>
                )}
              />
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 ">Hoặc đăng nhập với</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <Button variant="outline" className="w-full">
            <Facebook className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="w-full">
            <Instagram className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="w-full">
            <Twitter className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="w-full">
            <Linkedin className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
