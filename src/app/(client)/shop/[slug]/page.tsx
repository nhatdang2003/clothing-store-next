import ReviewSection from "@/components/detail/review-section";
import RelatedProducts from "@/components/detail/related-products";
import { productApi } from "@/services/product.api";
import InfoProduct from "@/components/detail/info-product";

export const dynamic = "force-dynamic";

export default async function DetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  let product: any;
  let relatedProducts: any;
  const { slug } = await params;
  try {
    product = await productApi.getProductBySlug(slug);
    relatedProducts = await productApi.getProductsByCategory(
      product.categoryId
    );
  } catch (error) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <InfoProduct product={product} />
      <ReviewSection />
      <RelatedProducts relatedProducts={relatedProducts.data} />
    </div>
  );
}
