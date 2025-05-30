import OrderList from "@/components/orders/order-list";
import OrderStatusTabs from "@/components/orders/order-status-tabs";
import { SearchInput } from "@/components/shared/search-input";

export default async function OrdersPage() {

    return (
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h1 className="text-3xl font-semibold">Đơn đã mua</h1>
                <div className="relative w-full sm:w-[300px]">
                    <SearchInput placeholder="Tìm đơn hàng" className="w-full" />
                </div>
            </div>
            <OrderStatusTabs />
            <OrderList />
        </div>
    );
}
