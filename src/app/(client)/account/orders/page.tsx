import OrderList from "@/components/orders/order-list";
import OrderStatusTabs from "@/components/orders/order-status-tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { orderApi } from "@/services/order.api";
import { SearchInput } from "@/components/shared/search-input";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page: number;
    size: number;
    status: string;
    search: string;
  }>;
}) {
  let orders = [];
  const { page, size, status, search } = await searchParams;
  try {
    orders = await orderApi.getOrdersByUser(
      page || 1,
      size || 6,
      status,
      search
    );
  } catch (error) {
    console.log(error);
    return <div>Đã có lỗi xảy ra, vui lòng thử lại sau</div>;
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-semibold">Đơn đã mua</h1>
        <div className="relative w-full sm:w-[300px]">
          <SearchInput placeholder="Tìm đơn hàng" className="w-full" />
        </div>
      </div>
      <OrderStatusTabs />
      <OrderList orders={orders} />
    </div>
  );
}
