export interface ProductVariant {
  id: number;
  color: string;
  size: string;
  quantity: number;
  images: string[];
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  variants: ProductVariant[];
  averageRating?: number;
}
