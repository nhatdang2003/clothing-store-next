import { FilterSidebar } from "@/components/shared/FilterSidebar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { categoryApi } from "@/services/category.api";
import { productApi } from "@/services/product.api";
import React, { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    page: number;
    size: number;
    categories: string;
    minPrice: number;
    maxPrice: number;
    rating: number;
    colors: string;
    sizes: string;
  }>;
}) {
  let categoriesData = [];
  let productsData = [];
  const { page, size, categories, minPrice, maxPrice, rating, colors, sizes } =
    await searchParams;
  try {
    categoriesData = await categoryApi.getCategories(1, 10000);
    productsData = await productApi.getProducts(
      page || 1,
      size || 12,
      categories,
      minPrice,
      maxPrice,
      rating,
      colors,
      sizes
    );
  } catch (error) {
    return <div>Đã có lỗi xảy ra, vui lòng thử lại sau</div>;
  }

  return (
    <div className=" mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Suspense fallback={<div>Loading...</div>}>
          <FilterSidebar categories={categoriesData} />
        </Suspense>
        <ProductGrid productsData={productsData} />
      </div>
    </div>
  );
}
