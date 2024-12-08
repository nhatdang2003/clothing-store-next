import CartList from "@/components/cart/cart-list";

export default async function ShoppingCart() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Giỏ hàng của bạn</h1>
      <CartList />
    </div>
  );
}
