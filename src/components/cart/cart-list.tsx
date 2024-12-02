"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { QuantitySelector } from "../detail/quantity-selector";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { OrderSummary } from "./order-summary";
import {
  useUpdateCartItem,
  useGetCart,
  useDeleteCartItem,
} from "@/hooks/use-cart-query";
import { CartItem } from "@/types/cart";

interface CartItemRowProps {
  item: CartItem;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onUpdateQuantity: (item: CartItem, newQuantity: number) => void;
  onDelete: (id: number) => void;
}

function CartItemRow({
  item,
  isSelected,
  onSelect,
  onUpdateQuantity,
  onDelete,
}: CartItemRowProps) {
  return (
    <div className="flex space-x-4">
      <div className="flex items-center">
        <Checkbox
          id={`item-${item.cartItemId}`}
          checked={isSelected}
          onCheckedChange={(checked) =>
            onSelect(item.cartItemId.toString(), checked as boolean)
          }
        />
      </div>

      <div className="flex-shrink-0 w-24 h-auto">
        <Image
          src={item.productVariant?.image}
          alt={item.productName}
          width={96}
          height={96}
          className="object-cover rounded-md w-full h-full"
        />
      </div>

      <div className="flex-grow flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold">{item.productName}</h2>
          <p className="text-sm text-muted-foreground">
            Màu: {item.productVariant.color}
          </p>
          <p className="text-sm text-muted-foreground">
            Kích thước: {item.productVariant.size}
          </p>
          <p className="font-medium mt-1">{formatPrice(item.finalPrice)}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <QuantitySelector
            initialQuantity={item.quantity}
            min={1}
            max={item.inStock}
            value={item.quantity}
            onChange={(value) => onUpdateQuantity(item, value)}
          />
          <Button
            variant="ghost"
            onClick={() => onDelete(+item.cartItemId)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CartList() {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Sử dụng các custom hooks
  const { data: cartItems = [], isLoading } = useGetCart();
  const { mutate: updateCartItem } = useUpdateCartItem();
  const { mutate: deleteCartItem } = useDeleteCartItem();

  // Cập nhật selectedItems khi cartItems thay đổi
  useEffect(() => {
    setSelectedItems((prev) =>
      prev.filter((id) =>
        cartItems.some((item: CartItem) => item.cartItemId.toString() === id)
      )
    );
  }, [cartItems]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Giỏ hàng của bạn đang trống.
          </p>
        </CardContent>
      </Card>
    );
  }

  const orderSummary = {
    subtotal: cartItems.reduce((total: number, item: CartItem) => {
      if (selectedItems.includes(item.cartItemId.toString())) {
        return total + item.finalPrice * item.quantity;
      }
      return total;
    }, 0),
    discount: 0,
    shippingFee: 0,
    total: 0,
  };
  orderSummary.total =
    orderSummary.subtotal - orderSummary.discount + orderSummary.shippingFee;

  const handleSelectItem = (cartItemId: string, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? [...prev, cartItemId] : prev.filter((id) => id !== cartItemId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(
      checked
        ? cartItems.map((item: CartItem) => item.cartItemId.toString())
        : []
    );
  };

  const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
    updateCartItem({
      ...item,
      quantity: newQuantity,
    });
  };

  const handleDeleteItem = (cartItemId: number) => {
    // Xóa item khỏi selectedItems trước khi xóa khỏi giỏ hàng
    setSelectedItems((prev) =>
      prev.filter((id) => id !== cartItemId.toString())
    );
    deleteCartItem(cartItemId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Checkbox
                id="select-all"
                checked={selectedItems.length === cartItems.length}
                onCheckedChange={(checked) =>
                  handleSelectAll(checked as boolean)
                }
              />
              <label htmlFor="select-all" className="ml-2 text-sm">
                Chọn tất cả ({selectedItems.length}/{cartItems.length})
              </label>
            </div>

            <div className="space-y-6">
              {cartItems.map((item: CartItem) => (
                <CartItemRow
                  key={item.cartItemId}
                  item={item}
                  isSelected={selectedItems.includes(
                    item.cartItemId.toString()
                  )}
                  onSelect={handleSelectItem}
                  onUpdateQuantity={handleUpdateQuantity}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <OrderSummary
          orderSummary={orderSummary}
          selectedItemsCount={selectedItems.length}
          onCheckout={() => {
            localStorage.setItem(
              "selectedItems",
              JSON.stringify(selectedItems)
            );
            router.push("/checkout");
          }}
        />
      </div>
    </div>
  );
}
