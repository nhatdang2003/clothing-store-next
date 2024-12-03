"use client";

import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Star, Truck } from "lucide-react";
import React, { useEffect, useState } from "react";
import ColorSelector from "./color-selector";
import ImageGallery from "./image-gallery";
import SizeSelector from "./size-selector";
import { QuantitySelector } from "./quantity-selector";
import { useToast } from "@/hooks/use-toast";
import { useAddToCartMutation } from "@/hooks/use-cart-query";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const InfoProduct = ({ product }: { product: any }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [images, setImages] = useState(product.images);
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const addToCartMutation = useAddToCartMutation();

  useEffect(() => {
    // Tìm tất cả variants có màu được chọn
    const variantsWithColor = product.variants.filter(
      (v: any) => v.color === selectedColor
    );

    // Cập nhật ảnh nếu có màu được chọn
    if (variantsWithColor.length > 0) {
      // Lấy ảnh từ variant đầu tiên của màu đó
      setImages([...variantsWithColor[0].images, ...product.images]);
    } else {
      setImages(product.images);
    }

    // Tìm variant hoàn chỉnh nếu có cả màu và size
    if (selectedColor && selectedSize) {
      const completeVariant = variantsWithColor.find(
        (v: any) => v.size === selectedSize
      );

      setSelectedVariant(completeVariant);

      // Chỉ điều chỉnh số lượng khi có variant hoàn chỉnh
      if (completeVariant && quantity > completeVariant.quantity) {
        setQuantity(
          completeVariant.quantity - completeVariant.currentUserCartQuantity
        );
      }
    } else {
      setSelectedVariant(null);
    }
  }, [selectedSize, selectedColor, product.variants, product.images, quantity]);

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast({
        title: "Vui lòng chọn màu sắc",
        description: "Bạn cần chọn màu sắc trước khi thêm vào giỏ hàng",
      });
      return;
    }
    if (!selectedSize) {
      toast({
        title: "Vui lòng chọn kích thước",
        description: "Bạn cần chọn kích thước trước khi thêm vào giỏ hàng",
      });
      return;
    }
    if (
      selectedVariant?.quantity - selectedVariant?.currentUserCartQuantity <
      quantity
    ) {
      toast({
        title: "Số lượng không khả dụng",
        description: "Vui lòng chọn số lượng nhỏ hơn hoặc bằng số lượng có sẵn",
      });
      return;
    }

    if (!Cookies.get("access_token")) {
      router.push("/login?redirect=/shop/" + product.slug);
      return;
    }

    addToCartMutation.mutate(
      {
        variantId: selectedVariant.id,
        quantity: quantity,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
        },
      }
    );
  };

  return (
    <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
      <div>
        <ImageGallery images={images} alt={product.name} />
      </div>
      <div>
        {showSuccess && (
          <Alert className="col-span-2 bg-white border border-gray-200 shadow-md rounded-lg p-4 mb-4 animate-in slide-in-from-top duration-300">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-green-500" />
              <AlertTitle className="text-green-500 font-semibold text-base">
                Thêm vào giỏ hàng thành công!
              </AlertTitle>
            </div>
            <AlertDescription className="mt-2 flex items-center justify-between flex-col md:flex-row gap-2">
              <span className="text-gray-600">
                Sản phẩm đã được thêm vào giỏ hàng của bạn. Bấm vào để{" "}
                <Link href="/cart" className="underline text-black">
                  xem giỏ hàng
                </Link>
              </span>
            </AlertDescription>
          </Alert>
        )}
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <div className="flex items-center mb-4">
          <div className="flex">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          </div>
          <span className="ml-2 text-gray-600 leading-none">
            {product.averageRating
              ? `${product.averageRating} sao`
              : "Chưa có đánh giá"}
          </span>
        </div>
        <p className="text-2xl font-semibold mb-4">
          {formatPrice(product.price)}
        </p>
        <p className="mb-6">{product.description}</p>
        <ColorSelector
          colors={Array.from(
            new Set(product?.variants?.map((variant: any) => variant.color))
          )}
          value={selectedColor}
          setValue={(color: string | null) => setSelectedColor(color)}
        />
        <SizeSelector
          sizes={Array.from(
            new Set(product?.variants?.map((variant: any) => variant.size))
          )}
          value={selectedSize}
          setValue={(size: string | null) => setSelectedSize(size)}
        />
        {!selectedVariant ||
        selectedVariant?.quantity - selectedVariant?.currentUserCartQuantity >
          0 ? (
          <div>
            <p className="text-sm font-medium mb-2">Số lượng:</p>
            <QuantitySelector
              key={`${selectedVariant?.id}-${selectedVariant?.quantity}`}
              initialQuantity={1}
              min={1}
              max={
                selectedVariant?.quantity -
                selectedVariant?.currentUserCartQuantity
              }
              value={quantity}
              onChange={(value: number) => setQuantity(value)}
            />
          </div>
        ) : (
          <p className="text-sm font-medium mb-2">
            Bạn đã thêm hết số lượng sản phẩm này vào giỏ hàng
          </p>
        )}
        <button
          className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAddToCart}
          disabled={
            selectedVariant?.quantity -
              selectedVariant?.currentUserCartQuantity ===
            0
          }
        >
          Thêm vào giỏ hàng
        </button>
        <div className="flex items-center mt-6 text-gray-600">
          <Truck className="w-5 h-5 mr-2" />
          <span>Miễn phí vận chuyển đơn hàng trên 500.000đ</span>
        </div>
      </div>
    </div>
  );
};

export default InfoProduct;
