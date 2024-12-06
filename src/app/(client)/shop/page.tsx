import { FilterSidebar } from "@/components/shared/FilterSidebar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { categoryApi } from "@/services/category.api";
import { productApi } from "@/services/product.api";
import React, { Suspense } from "react";

const ShopPage = async ({ searchParams }: { searchParams: any }) => {
  let categories = [];
  let productsData = [];
  try {
    categories = await categoryApi.getCategories();
    productsData = await productApi.getProducts(
      searchParams.page - 1 || 0,
      searchParams.size || 6,
      searchParams.categories,
      searchParams.minPrice,
      searchParams.maxPrice,
      searchParams.rating,
      searchParams.sizes
    );
  } catch (error) {
    return <div>Đã có lỗi xảy ra, vui lòng thử lại sau</div>;
  }

  return (
    <div className=" mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Suspense fallback={<div>Loading...</div>}>
          <FilterSidebar categories={categories} />
        </Suspense>
        <ProductGrid productsData={productsData} />
      </div>
    </div>
  );
};

export default ShopPage;
