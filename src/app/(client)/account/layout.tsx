"use client";

import { Button } from "@/components/ui/button";
import { User, Package, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LayoutAccount({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/account",
      label: "Tài khoản",
      icon: User,
    },
    {
      href: "/account/shipping-info",
      label: "Thông tin giao hàng",
      icon: Package,
    },
    {
      href: "/account/orders",
      label: "Đơn hàng",
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:flex">
        {/* Sidebar */}
        <div className="md:w-64 md:min-h-screen border-r bg-white shadow-sm">
          <nav className="space-y-1 px-3 py-4 md:py-8 ">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href} passHref>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 ${
                      isActive
                        ? "bg-gray-100 text-primary hover:bg-gray-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${isActive ? "text-primary" : ""}`}
                    />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        {children}
      </div>
    </div>
  );
}
