import Image from "next/image";
import ProductCard from "../shared/Product";

const relatedProducts = [
  {
    id: 1,
    name: "Áo thun mùa hè",
    description: "Áo cotton nhẹ cho thời tiết ấm",
    price: "249000",
    category: "Tops",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Quần jean classic",
    description: "Quần jean basic đa năng",
    price: "599000",
    category: "Bottoms",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Áo khoác denim",
    description: "Áo khoác jean thời trang",
    price: "799000",
    category: "Outerwear",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Áo polo basic",
    description: "Áo polo đơn giản thanh lịch",
    price: "299000",
    category: "Tops",
    rating: 4.6,
  },
];

export default function RelatedProducts() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
