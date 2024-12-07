import { orderApi } from "@/services/order.api";
import React from "react";
import OrderList from "./order-list";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page: number;
    size: number;
    status: string;
    paymentStatus: string;
    orderStatus: string;
    paymentMethod: string;
    deliveryMethod: string;
    search: string;
  }>;
}) {
  let orders = [];
  const {
    page,
    size,
    status,
    paymentStatus,
    orderStatus,
    paymentMethod,
    deliveryMethod,
    search,
  } = await searchParams;
  try {
    orders = await orderApi.getOrders(
      page - 1 || 0,
      size || 10,
      status,
      paymentStatus,
      orderStatus,
      paymentMethod,
      deliveryMethod,
      search
    );
    console.log(orders);
  } catch (error) {
    console.log(error);
    return <div>Đã có lỗi xảy ra, vui lòng thử lại sau</div>;
  }
  return <OrderList orders={orders} />;
}
