import { CheckoutForm } from "@/components/checkout/checkout-form";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen ">
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Trang thanh toán
        </h1>
        <CheckoutForm />
      </main>
    </div>
  );
}
