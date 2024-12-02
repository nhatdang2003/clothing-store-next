"use client";

import { useState } from "react";
import ProductCard from "../shared/Product";
import { Pagination } from "../shared/pagination";

export function ProductGrid({ productsData }: { productsData: any }) {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex-1">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {productsData.data.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Pagination
        currentPage={productsData.meta.page + 1}
        totalPages={productsData.meta.pages}
        className="mt-8"
      />
    </div>
  );
}
