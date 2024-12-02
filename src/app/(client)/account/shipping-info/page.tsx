"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ShippingProfileCard } from "@/components/shipping/shipping-profile-card";
import { ShippingProfileDialog } from "@/components/modal/shipping-profile-dialog";
import {
  useShippingProfiles,
  useDeleteShippingProfile,
} from "@/hooks/use-shipping-query";
import type { ShippingProfile } from "@/types/shipping";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShippingInfoPage() {
  const [selectedProfile, setSelectedProfile] =
    useState<ShippingProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: profiles, isLoading } = useShippingProfiles();
  const deleteProfile = useDeleteShippingProfile();

  const handleCreateNew = () => {
    setSelectedProfile(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (profile: ShippingProfile) => {
    setSelectedProfile(profile);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteProfile.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[300px] mt-2" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                    <Skeleton className="h-4 w-[250px]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex justify-between items-center flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Địa chỉ giao hàng
            </h1>
            <p className="text-gray-500 mt-2">
              Quản lý địa chỉ giao hàng của bạn
            </p>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm địa chỉ mới
          </Button>
        </div>

        <div className="space-y-4">
          {profiles?.map((profile: ShippingProfile) => (
            <ShippingProfileCard
              key={profile.id}
              profile={profile}
              onEdit={() => handleEdit(profile)}
              onDelete={() => handleDelete(profile.id ?? 0)}
            />
          ))}

          {profiles?.length === 0 && (
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center text-gray-500">
                Bạn chưa có địa chỉ giao hàng nào
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ShippingProfileDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        profile={selectedProfile}
      />
    </div>
  );
}
