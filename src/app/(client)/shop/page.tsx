import { FilterSidebar } from "@/components/shared/FilterSidebar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { categoryApi } from "@/services/category.api";
import { productApi } from "@/services/product.api";
import React from "react";

const ShopPage = async ({ searchParams }: { searchParams: any }) => {
  let categories = [];
  let productsData = [];
  try {
    categories = await categoryApi.getCategories();
    productsData = await productApi.getProducts(
      searchParams.page - 1 || 0,
      searchParams.size || 6
    );

    console.log(searchParams);
  } catch (error) {
    return <div>Đã có lỗi xảy ra, vui lòng thử lại sau</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar categories={categories} />
        <ProductGrid productsData={productsData} />
      </div>
    </div>
  );
};

export default ShopPage;
