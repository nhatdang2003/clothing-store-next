import SizeSelector from "@/components/detail/size-selector";
import ColorSelector from "@/components/detail/color-selector";
import { Star, Truck } from "lucide-react";
import ReviewSection from "@/components/detail/review-section";
import RelatedProducts from "@/components/detail/related-products";
import ImageGallery from "@/components/detail/image-gallery";

export default function DetailPage() {
  // This would typically come from a database or API
  const product = {
    name: "Classic Cotton T-Shirt",
    price: 29.99,
    description: "A comfortable and versatile t-shirt made from 100% cotton.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Navy", "Red"],
    rating: 4.5,
    images: ["/test.jpg", "/test.jpg", "/test.jpg", "/test.jpg"],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <ImageGallery images={product.images} alt={product.name} />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
            <span className="ml-2 text-gray-600 leading-none">
              {product.rating} stars
            </span>
          </div>
          <p className="text-2xl font-semibold mb-4">
            ${product.price.toFixed(2)}
          </p>
          <p className="mb-6">{product.description}</p>
          <SizeSelector sizes={product.sizes} />
          <ColorSelector colors={product.colors} />
          <button className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-300 mt-6">
            Add to Cart
          </button>
          <div className="flex items-center mt-6 text-gray-600">
            <Truck className="w-5 h-5 mr-2" />
            <span>Free shipping on orders over $50</span>
          </div>
        </div>
      </div>
      <ReviewSection />
      <RelatedProducts />
    </div>
  );
}
