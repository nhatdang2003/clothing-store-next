import { FilterSidebar } from "@/components/shared/FilterSidebar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { categoryApi } from "@/services/category.api";
import React from "react";

const ShopPage = async () => {
  let categories = [];
  try {
    categories = await categoryApi.getCategories();
    console.log(categories);
  } catch (error) {
    return <div>Đã có lỗi xảy ra, vui lòng thử lại sau</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar categories={categories} />
        <ProductGrid />
      </div>
    </div>
  );
};

export default ShopPage;
