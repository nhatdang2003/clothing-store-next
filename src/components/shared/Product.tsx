"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

let isSale = false;
export default function ProductCard({ product }: { product: any }) {
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    setInCart(true);
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
  };

  return (
    <Card className="w-full bg-card text-card-foreground shadow-sm">
      <div className="relative">
        <Image
          src="/test.jpg"
          alt={product.name}
          width={300}
          height={400}
          className="w-full rounded-t-lg object-cover aspect-[4/5]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg">
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-lg font-semibold text-white line-clamp-2">
              {product.name}
            </h3>
            <span className="text-gray-200">{product.category}</span>
          </div>
        </div>
        {/* <div className="absolute top-4 right-4">
          <HeartIcon className="h-6 w-6 text-primary" />
        </div> */}
      </div>
      <CardContent className="py-4 px-3">
        <div className="flex items-start sm:items-end flex-col sm:flex-row gap-2">
          <div
            className={`text-lg font-bold leading-none ${
              isSale ? "text-red-500" : ""
            }`}
          >
            {formatPrice(product.price)}
          </div>
          {isSale && (
            <div className="text-sm font-bold leading-none line-through text-gray-500">
              {formatPrice(product.price)}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star
              className="h-4 sm:h-6 w-4 sm:w-6 fill-yellow-400"
              color="yellow-400"
            />
            <span className="text-sm sm:text-base">{product.rating}</span>
          </div>
          {inCart ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="hidden sm:block"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity === 1}
              >
                -
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="block sm:hidden"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity === 1}
              >
                -
              </Button>
              <span className="text-sm font-medium">{quantity}</span>
              <Button
                variant="outline"
                className="hidden sm:block"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="block sm:hidden"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </Button>
            </div>
          ) : (
            <>
              <Button className="hidden sm:block" onClick={handleAddToCart}>
                Thêm vào giỏ
              </Button>
              <Button size="sm" className="sm:hidden" onClick={handleAddToCart}>
                <ShoppingCart /> Thêm
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
