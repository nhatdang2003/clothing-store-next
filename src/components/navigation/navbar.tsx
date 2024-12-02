"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavigationMobile from "./navbarMobile";
import { NavbarUser } from "./navbarUser";
import { CartIcon } from "@/components/cart/cart-icon";

export default function Navigation({ userInfo }: { userInfo: any }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > 50) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`bg-background border-b fixed w-full top-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Logo
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 rounded-full w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/" className="text-foreground hover:underline">
              Trang chủ
            </Link>
            <Link href="/shop" className="text-foreground hover:underline">
              Cửa hàng
            </Link>
            <Link
              href="/theo-doi-don-hang"
              className="text-foreground hover:underline"
            >
              Theo dõi đơn hàng
            </Link>
          </div>

          {/* Cart, Login and Sign Up Buttons */}
          <div className="hidden lg:flex items-center space-x-2">
            <CartIcon />
            {userInfo !== null ? (
              <NavbarUser userInfo={userInfo} />
            ) : (
              <>
                <Link href="/login" passHref>
                  <Button variant="outline">Đăng nhập</Button>
                </Link>
                <Link href="/register" passHref>
                  <Button>Đăng ký</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <CartIcon />
            <NavigationMobile userInfo={userInfo} />
          </div>
        </div>
      </div>
    </nav>
  );
}
