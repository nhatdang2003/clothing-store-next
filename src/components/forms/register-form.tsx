"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { registerSchema } from "@/schemas/auth.schema";
import { useRegister } from "@/hooks/use-auth-query";
import type { RegisterCredentials } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GENDER_OPTIONS } from "@/constants/profile";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Lock,
  Mail,
  User,
  PersonStanding,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const { mutate: register, isPending } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      gender: "MALE",
    },
  });

  const handleRegister = handleSubmit((data) => {
    register(data, {
      onSuccess: () => {
        reset();
      },
    });
  });

  return (
    <div className="w-full max-w-md space-y-2 rounded-xl bg-white bg-opacity-90 p-8 shadow-lg backdrop-blur-sm">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Đăng ký</h2>
        <p className="mt-2 text-sm text-gray-600">
          Tạo tài khoản để tiến hành mua sắm và nhận ưu đãi
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleRegister} className="space-y-6">
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <div>
                <div className="relative">
                  <Input
                    placeholder="Email"
                    {...field}
                    className="pl-10 py-2 border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {error?.message && (
                  <p className="text-sm text-red-500 mt-1">{error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <div>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Mật khẩu"
                    {...field}
                    className="pl-10 py-2 border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {error?.message && (
                  <p className="text-sm text-red-500 mt-1">{error.message}</p>
                )}
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <div className="relative">
                    <Input
                      placeholder="Họ"
                      {...field}
                      className="pl-10 py-2 border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {error?.message && (
                    <p className="text-sm text-red-500 mt-1">{error.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="lastName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <div className="relative">
                    <Input
                      placeholder="Tên"
                      {...field}
                      className="pl-10 py-2 border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {error?.message && (
                    <p className="text-sm text-red-500 mt-1">{error.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <Controller
            name="birthDate"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <div>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal py-2 bg-transparent hover:bg-transparent border-gray-300 focus:ring-primary focus:border-primary rounded-md",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(new Date(field.value), "dd-MM-yyyy")
                        ) : (
                          <span>Chọn ngày sinh</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={1960}
                        toYear={2030}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {error?.message && (
                  <p className="text-sm text-red-500 mt-1">{error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="gender"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <div>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <div className="relative">
                    <SelectTrigger className="pl-10 py-2 border-gray-300 focus:ring-primary focus:border-primary rounded-md">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <PersonStanding className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  <SelectContent>
                    {GENDER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {error?.message && (
                  <p className="text-sm text-red-500 mt-1">{error.message}</p>
                )}
              </div>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !isDirty}
          >
            {isPending ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </form>

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
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
