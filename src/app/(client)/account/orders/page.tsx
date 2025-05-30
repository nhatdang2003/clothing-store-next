"use client";

import { Suspense } from "react";
import OrderList from "@/components/orders/order-list";
import OrderStatusTabs from "@/components/orders/order-status-tabs";
import { SearchInput } from "@/components/shared/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Loading component for SearchInput
const SearchInputLoading = () => (
    <div className="relative w-full sm:w-[300px]">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
            placeholder="Tìm đơn hàng"
            className="pl-8 w-full"
            disabled
            value=""
        />
    </div>
);

// Loading component for OrderStatusTabs
const OrderStatusTabsLoading = () => (
    <div className="w-full mb-6">
        <div className="overflow-x-auto">
            <div className="flex space-x-2 bg-muted rounded-lg p-1">
                {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="h-9 w-20 rounded-md" />
                ))}
            </div>
        </div>
    </div>
);

// Loading component for OrderList
const OrderListLoading = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
            <Card key={index} className="p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                    <div>
                        <Skeleton className="h-4 w-[200px] mb-2" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <Skeleton className="h-6 w-[100px] rounded-full" />
                </div>
                <Skeleton className="h-[100px] w-full mb-4" />
                <Skeleton className="h-8 w-[200px]" />
            </Card>
        ))}
    </div>
);

export default function OrdersPage() {
    return (
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h1 className="text-3xl font-semibold">Đơn đã mua</h1>
                <Suspense fallback={<SearchInputLoading />}>
                    <SearchInput placeholder="Tìm đơn hàng" className="w-full" />
                </Suspense>
            </div>

            <Suspense fallback={<OrderStatusTabsLoading />}>
                <OrderStatusTabs />
            </Suspense>

            <Suspense fallback={<OrderListLoading />}>
                <OrderList />
            </Suspense>
        </div>
    );
}
