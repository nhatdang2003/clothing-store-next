export interface ProductVariant {
  id: number;
  color: string;
  size: string;
  quantity: number;
  currentUserCartQuantity: number;
  differencePrice: number;
  images: string[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  priceWithDiscount: number;
  minPriceWithDiscount: number;
  maxPriceWithDiscount: number;
  categoryId: number;
  categoryName: string;
  discountRate: number;
  averageRating: number | null;
  slug: string;
  colorDefault: string | null;
  images: string[];
  variants: ProductVariant[];
  featured: boolean;
}
