"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  ShoppingBag,
  Package,
  Home,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { NavbarUser } from "./navbarUser";

export default function NavigationMobile({ userInfo }: { userInfo: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Mở menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-4 mt-4">
          {/* Logo in drawer */}
          <Link
            href="/"
            className="text-2xl font-bold text-primary mb-4"
            onClick={() => setIsOpen(false)}
          >
            Logo
          </Link>

          {/* Search Bar in drawer */}
          <div className="relative mb-4">
            <Input
              type="search"
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 rounded-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>

          {/* Navigation Links */}
          <Link
            href="/"
            className="text-foreground hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            <Home className="h-5 w-5 inline-block mr-2" />
            Trang chủ
          </Link>
          <Link
            href="/shop"
            className="text-foreground hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            <ShoppingBag className="h-5 w-5 inline-block mr-2" />
            Cửa hàng
          </Link>
          <Link
            href="/theo-doi-don-hang"
            className="text-foreground hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            <Package className="h-5 w-5 inline-block mr-2" />
            Theo dõi đơn hàng
          </Link>

          {userInfo !== null ? (
            <>
              <Link
                href="/account"
                className="text-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-5 w-5 inline-block mr-2" />
                Account Settings
              </Link>
              <Link
                href="/orders"
                className="text-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                <Package className="h-5 w-5 inline-block mr-2" />
                Orders
              </Link>
              <Link
                href="/shipping"
                className="text-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingBag className="h-5 w-5 inline-block mr-2" />
                Shipping Profile
              </Link>
              <Link
                href="/logout"
                className="text-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                <LogOut className="h-5 w-5 inline-block mr-2" />
                Đăng xuất
              </Link>
            </>
          ) : (
            <>
              {/* Login and Sign Up Buttons in drawer */}
              <Button
                variant="outline"
                className="bg-black text-white hover:bg-gray-700 hover:text-white w-full"
                onClick={() => {
                  setIsOpen(false);
                  router.push("/login");
                }}
              >
                Đăng nhập
              </Button>
              <Button
                variant="outline"
                className="bg-white text-black border-black hover:bg-black hover:text-white w-full"
                onClick={() => {
                  setIsOpen(false);
                  router.push("/register");
                }}
              >
                Đăng ký
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
