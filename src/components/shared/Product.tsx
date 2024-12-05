"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Star } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }: { product: any }) {
  const calculateDiscountPercentage = (price: number, discountRate: number) => {
    return Math.round(discountRate * 100);
  };

  return (
    <Card className="w-full bg-card text-card-foreground shadow-sm">
      <Link href={`/shop/${product.slug}`}>
        <div className="relative">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={400}
            className="w-full rounded-t-lg object-cover aspect-[2/3]"
          />
          {product.discountRate > 0 && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              -
              {calculateDiscountPercentage(product.price, product.discountRate)}
              %
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg">
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-lg font-semibold text-white line-clamp-2">
                {product.name}
              </h3>
              <span className="text-gray-200">{product.categoryName}</span>
            </div>
          </div>
        </div>
        <CardContent className="py-4 px-3">
          <div className="flex items-start sm:items-start flex-col  gap-2">
            <div
              className={`text-md xl:text-lg font-bold leading-none ${
                product.discountRate > 0 ? "text-red-500" : ""
              }`}
            >
              {product.minPriceWithDiscount === product.maxPriceWithDiscount ? (
                formatPrice(product.minPriceWithDiscount)
              ) : (
                <>
                  {formatPrice(product.minPriceWithDiscount)} -{" "}
                  {formatPrice(product.maxPriceWithDiscount)}
                </>
              )}
            </div>
            {product.discountRate > 0 && (
              <div className="text-sm font-bold leading-none line-through text-gray-500">
                {product.minPrice === product.maxPrice ? (
                  formatPrice(product.minPrice)
                ) : (
                  <>
                    {formatPrice(product.minPrice)} -{" "}
                    {formatPrice(product.maxPrice)}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center gap-1">
            {product.averageRating ? (
              <>
                <Star
                  className="h-4 sm:h-6 w-4 sm:w-6 fill-yellow-400"
                  color="yellow-400"
                />
                <span className="text-sm"> {product.averageRating}</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">
                Chưa có đánh giá
              </span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
