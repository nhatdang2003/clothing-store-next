import CategoryCarousel from "@/components/home/category-carousel";
import HomeCarousel from "@/components/home/home-carousel";
import TabsProduct from "@/components/home/tabsProduct";
import { productApi } from "@/services/product.api";

export default async function HomeContent() {
  let products: any;
  try {
    const response = await Promise.all([
      productApi.getFeaturedProducts(),
      productApi.getLatestProducts(),
      productApi.getDiscountProducts(),
    ]);
    console.log(response);
    products = {
      featured: response[0].data,
      new: response[1].data,
      sale: response[2].data,
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
