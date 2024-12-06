import {
  Gift,
  Layers,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

export const SIDEBAR = {
  ADMIN: [
    { title: "Dashboard", icon: LayoutDashboard, href: "/workspace/dashboard" },
    { title: "Users", icon: Users, href: "/workspace/users" },
    { title: "Products", icon: Package, href: "/workspace/products" },
    { title: "Categories", icon: Layers, href: "/workspace/categories" },
    { title: "Orders", icon: ShoppingCart, href: "/workspace/orders" },
    { title: "Promotions", icon: Gift, href: "/workspace/promotions" },
  ],
  STAFF: [
    { title: "Dashboard", icon: LayoutDashboard, href: "/workspace/dashboard" },
    { title: "Products", icon: Package, href: "/workspace/products" },
    { title: "Categories", icon: Layers, href: "/workspace/categories" },
    { title: "Orders", icon: ShoppingCart, href: "/workspace/orders" },
    { title: "Promotions", icon: Gift, href: "/workspace/promotions" },
  ],
  USER: [{ title: "Orders", icon: ShoppingCart, href: "/workspace/orders" }],
};
