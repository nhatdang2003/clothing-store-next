"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FilterPriceRangeProps {
  className?: string;
}

export function FilterPriceRange({ className = "" }: FilterPriceRangeProps) {
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("10000000");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Lấy giá trị price range từ URL khi component mount
    const minPriceFromUrl = searchParams.get("minPrice") || "0";
    const maxPriceFromUrl = searchParams.get("maxPrice") || "10000000";
    setMinPrice(minPriceFromUrl);
    setMaxPrice(maxPriceFromUrl);
  }, [searchParams]);

  const handleApplyFilter = () => {
    // Validate giá trị
    const min = Number(minPrice);
    const max = Number(maxPrice);

    if (isNaN(min) || isNaN(max) || min < 0 || max < 0 || min > max) {
      return;
    }

    // Cập nhật URL
    const params = new URLSearchParams(searchParams);
    params.set("minPrice", min.toString());
    params.set("maxPrice", max.toString());

    // Reset về trang 1 khi filter thay đổi
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("minPrice");
    params.delete("maxPrice");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={className}>
      <h3 className="font-semibold mb-2">Khoảng giá</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Giá thấp nhất"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full"
          />
          <span>-</span>
          <Input
            type="number"
            placeholder="Giá cao nhất"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          onClick={handleApplyFilter}
          className="w-full"
          variant="outline"
        >
          Áp dụng
        </Button>
        <Button
          onClick={handleClearFilter}
          className="w-full"
          variant="outline"
        >
          Xóa
        </Button>
        <div className="text-sm text-gray-500">
          Giá hiện tại: {formatPrice(Number(minPrice))} -{" "}
          {formatPrice(Number(maxPrice))}
        </div>
      </div>
    </div>
  );
}
