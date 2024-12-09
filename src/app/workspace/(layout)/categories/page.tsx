import React, { Suspense } from "react";
import CategoryList from "./category-list";
import { categoryApi } from "@/services/category.api";
import { PAGE_SIZE } from "@/constants/category";

export const dynamic = "force-dynamic";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page: number;
    size: number;
    search: string;
  }>;
}) {
  let categories = [];
  const { page } = await searchParams;
  try {
    categories = await categoryApi.getCategories(page, PAGE_SIZE);
  } catch (error) {
    console.log(error);
    return <div>Đã có lỗi xảy ra, vui lòng thử lại sau</div>;
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryList initialData={categories} />
    </Suspense>
  );
}
