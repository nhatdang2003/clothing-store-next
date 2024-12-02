import SizeSelector from "@/components/detail/size-selector";
import ColorSelector from "@/components/detail/color-selector";
import { Star, Truck } from "lucide-react";
import ReviewSection from "@/components/detail/review-section";
import RelatedProducts from "@/components/detail/related-products";
import ImageGallery from "@/components/detail/image-gallery";
import { productApi } from "@/services/product.api";
import { formatPrice } from "@/lib/utils";
import InfoProduct from "@/components/detail/info-product";

export default async function DetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let product: any;
  let relatedProducts: any;
  try {
    product = await productApi.getProductBySlug(params.slug);
    relatedProducts = await productApi.getProductsByCategory(
      product.categoryId
    );
    console.log(relatedProducts);
  } catch (error) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <InfoProduct product={product} />
      <ReviewSection />
      <RelatedProducts relatedProducts={relatedProducts.data.data} />
    </div>
  );
}
