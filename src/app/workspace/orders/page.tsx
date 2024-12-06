import { orderApi } from "@/services/order.api";
import React from "react";
import OrderList from "./order-list";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: any;
}) {
  let orders = [];
  try {
    orders = await orderApi.getOrders(
      searchParams.page - 1 || 0,
      searchParams.size || 10,
      searchParams.status
    );
  } catch (error) {
    console.log(error);
    return <div>Đã có lỗi xảy ra, vui lòng thử lại sau</div>;
  }
  return <OrderList orders={orders} />;
}
