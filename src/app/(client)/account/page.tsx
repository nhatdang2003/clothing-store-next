"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skeleton } from "@/components/ui/skeleton";
import { UserInfo } from "@/types/account";
import { userInfoSchema } from "@/schemas/account.schema";
import { useAccountProfile, useUpdateProfile } from "@/hooks/use-account-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GENDER_OPTIONS } from "@/constants/profile";
import { useEffect } from "react";

export default function AccountPage() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserInfo>({
    resolver: zodResolver(userInfoSchema),
  });

  const { data: userProfile, isLoading } = useAccountProfile();
  const updateProfile = useUpdateProfile();

  // Reset form khi có data từ API
  useEffect(() => {
    if (userProfile) {
      reset({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        birthDate: userProfile.birthDate
          ? new Date(userProfile.birthDate)
          : undefined,
        gender: userProfile.gender,
      });
    }
  }, [userProfile]);

  const onSubmit = async (data: UserInfo) => {
    updateProfile.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[300px] mt-2" />
          </div>

          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50/50">
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Skeleton className="h-10 w-[150px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Thông tin cá nhân
          </h1>
          <p className="text-gray-500 mt-2">
            Quản lý thông tin cá nhân của bạn
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle>Thông tin chi tiết</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Họ <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="lastName"
                    control={control}
                    defaultValue={userProfile?.lastName ?? ""}
                    render={({ field }) => (
                      <div>
                        <Input
                          {...field}
                          placeholder="Nhập họ của bạn"
                          className={cn(errors.firstName && "border-red-500")}
                        />
                        {errors.firstName && (
                          <span className="text-sm text-red-500">
                            {errors.firstName.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    Tên <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="firstName"
                    control={control}
                    defaultValue={userProfile?.firstName ?? ""}
                    render={({ field }) => (
                      <div>
                        <Input
                          {...field}
                          placeholder="Nhập tên của bạn"
                          className={cn(errors.lastName && "border-red-500")}
                        />
                        {errors.lastName && (
                          <span className="text-sm text-red-500">
                            {errors.lastName.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">
                    Ngày sinh <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="birthDate"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                                errors.birthDate && "border-red-500"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
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
                              defaultMonth={field.value}
                              initialFocus
                              captionLayout="dropdown-buttons"
                              fromYear={1960}
                              toYear={2030}
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.birthDate && (
                          <span className="text-sm text-red-500">
                            {errors.birthDate.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">
                    Giới tính <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="gender"
                    control={control}
                    defaultValue={userProfile?.gender ?? ""}
                    render={({ field }) => {
                      return (
                        <div>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              className={cn(errors.gender && "border-red-500")}
                            >
                              <SelectValue placeholder="Chọn giới tính" />
                            </SelectTrigger>
                            <SelectContent>
                              {GENDER_OPTIONS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.gender && (
                            <span className="text-sm text-red-500">
                              {errors.gender.message}
                            </span>
                          )}
                        </div>
                      );
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="min-w-[150px]"
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
