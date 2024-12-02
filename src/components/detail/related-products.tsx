import Image from "next/image";
import ProductCard from "../shared/Product";

export default function RelatedProducts({ relatedProducts }: any) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.slice(0, 4)?.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
