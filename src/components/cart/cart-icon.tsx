"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetCart } from "@/hooks/use-cart-query";

export function CartIcon() {
  const { data: cartItems = [] } = useGetCart();

  const itemCount = cartItems.length;

  return (
    <Link href="/cart" passHref>
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        <span className="sr-only">Giỏ hàng</span>
        {itemCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Button>
    </Link>
  );
}
