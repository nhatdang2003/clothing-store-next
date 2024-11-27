"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../shared/Product";

const products = [
  {
    id: 1,
    name: "Áo thun nam",
    price: 199000,
    category: "Quần áo",
    rating: 4.5,
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Quần jean nữ",
    price: 399000,
    category: "Quần áo",
    rating: 4.2,
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Giày thể thao",
    price: 799000,
    category: "Giày dép",
    rating: 4.7,
    image: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Túi xách da",
    price: 1299000,
    category: "Phụ kiện",
    rating: 4.8,
    image: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Đồng hồ thông minh",
    price: 2999000,
    category: "Điện tử",
    rating: 4.6,
    image: "/placeholder.svg",
  },
  {
    id: 6,
    name: "Ốp lưng điện thoại",
    price: 99000,
    category: "Phụ kiện",
    rating: 4.0,
    image: "/placeholder.svg",
  },
  // Add more products here...
];

const ITEMS_PER_PAGE = 6;

export function ProductGrid() {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  return (
    <div className="flex-1">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {currentItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-8 flex justify-center items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
