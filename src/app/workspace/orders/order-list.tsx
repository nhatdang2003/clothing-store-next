"use client";

import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/shared/pagination";
import {
  formatPrice,
  getPaymentMethodText,
  getPaymentStatusColor,
  getPaymentStatusText,
  getShippingMethodText,
  getStatusColor,
  getStatusText,
} from "@/lib/utils";

export default function OrderList({ orders }: { orders: any }) {
  const currentPage = orders.meta.page;
  const totalPages = orders.meta.pages;
  const data = orders.data;

  if (!data) return <div>Không tìm thấy đơn hàng</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Đơn hàng</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn hàng</TableHead>
            <TableHead>Ngày đặt</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead className="text-right">Tổng tiền</TableHead>
            <TableHead className="text-center">Trạng thái thanh toán</TableHead>
            <TableHead className="text-center">Trạng thái đơn hàng</TableHead>
            <TableHead className="text-right">Số lượng</TableHead>
            <TableHead className="text-center">
              Phương thức thanh toán
            </TableHead>
            <TableHead className="text-center">Phương thức giao hàng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((order: any) => (
            <TableRow key={order.id}>
              <TableCell>{order.orderCode}</TableCell>
              <TableCell>
                {format(new Date(order.orderDate), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell className="text-right">
                {formatPrice(order.total)}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className={getPaymentStatusColor(order.paymentStatus)}
                >
                  {getPaymentStatusText(order.paymentStatus)}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className={getStatusColor(order.orderStatus)}
                >
                  {getStatusText(order.orderStatus)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {order.numberOfItems}
              </TableCell>
              <TableCell className="text-center">
                {getPaymentMethodText(order.paymentMethod)}
              </TableCell>
              <TableCell className="text-center">
                {getShippingMethodText(order.deliveryMethod)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
