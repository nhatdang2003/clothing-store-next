import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  BarChart3,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  LayoutDashboard,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";
import {
  formatPrice,
  getPaymentStatusColor,
  getPaymentStatusText,
  getStatusColor,
  getStatusText,
  getPaymentMethodText,
  getShippingMethodText,
} from "@/lib/utils";
import { format } from "date-fns";
import { orderApi } from "@/services/order.api";
import page from "../../page";

export default async function DashboardPage() {
  const orders = await orderApi.getOrders(1, 5);
  const data = orders.data;
  return (
    <div className="flex">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Dashboard Content */}
        <div className="p-6">
          {/* Metrics */}
          <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Total Revenue",
                value: "$54,230",
                icon: DollarSign,
                color: "text-green-600",
              },
              {
                title: "Orders",
                value: "1,240",
                icon: ShoppingBag,
                color: "text-blue-600",
              },
              {
                title: "Customers",
                value: "3,540",
                icon: Users,
                color: "text-yellow-600",
              },
              {
                title: "Products",
                value: "450",
                icon: Package,
                color: "text-purple-600",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {item.title}
                  </CardTitle>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Orders */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn hàng</TableHead>
                    <TableHead>Ngày đặt</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead className="text-right">Tổng tiền</TableHead>
                    <TableHead className="text-center">
                      Trạng thái thanh toán
                    </TableHead>
                    <TableHead className="text-center">
                      Trạng thái đơn hàng
                    </TableHead>
                    <TableHead className="text-right">Số lượng</TableHead>
                    <TableHead className="text-center">
                      Phương thức thanh toán
                    </TableHead>
                    <TableHead className="text-center">
                      Phương thức giao hàng
                    </TableHead>
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
