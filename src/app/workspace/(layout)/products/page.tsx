import { Metadata } from "next";
import ProductList from "./product-list";
import { productApi } from "@/services/product.api";
import { Suspense } from "react";
import { PAGE_SIZE } from "@/constants/page-size";
import page from "../../page";

export const metadata: Metadata = {
  title: "Quản lý sản phẩm",
  description: "Quản lý danh sách sản phẩm",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page: number;
    size: number;
    search: string;
  }>;
}) {
  // Fetch initial data
  let products = [];
  const { page, search } = await searchParams;
  try {
    products = await productApi.getProducts(
      page,
      PAGE_SIZE.LIST_PRODUCT,
      search
    );
  } catch (error) {
    console.log(error);
    return <div>Đã có lỗi xảy ra, vui lòng thử lại sau</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductList />
    </Suspense>
  );
}
