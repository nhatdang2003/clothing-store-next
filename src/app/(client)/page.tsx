import { Suspense } from "react";
import CategoryCarousel from "@/components/home/category-carousel";
import HomeCarousel from "@/components/home/home-carousel";
import TabsProduct from "@/components/home/tabsProduct";
import { productApi } from "@/services/product.api";

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  let products: any;
  try {
    const response = await Promise.all([
      productApi.getFeaturedProducts(),
      productApi.getLatestProducts(),
      productApi.getDiscountProducts(),
    ]);
    products = {
      featured: response[0].data.data,
      new: response[1].data.data,
      sale: response[2].data.data,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <HomeCarousel />
      <TabsProduct products={products} />
      <CategoryCarousel />
    </div>
  );
}
