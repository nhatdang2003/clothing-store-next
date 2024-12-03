"use client";

import Link from "next/link";
import { ChevronDown, LogOut, Package, ShoppingBag, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLogout } from "@/hooks/use-auth-query";
import { usePathname } from "next/navigation";

export function NavbarUser({ userInfo }: { userInfo: any }) {
  const pathname = usePathname();
  const { mutate: logout } = useLogout(pathname);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="ml-auto flex items-center space-x-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="text-base flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Hi {userInfo.firstName}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="end">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Link
                href="/account"
                className="flex items-center gap-2 text-sm hover:bg-muted px-2 py-1 rounded-md"
              >
                <User className="h-4 w-4" />
                <span>Account Settings</span>
              </Link>
              <Link
                href="/orders"
                className="flex items-center gap-2 text-sm hover:bg-muted px-2 py-1 rounded-md"
              >
                <Package className="h-4 w-4" />
                <span>Orders</span>
              </Link>
              <Link
                href="/shipping"
                className="flex items-center gap-2 text-sm hover:bg-muted px-2 py-1 rounded-md"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Shipping Profile</span>
              </Link>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
