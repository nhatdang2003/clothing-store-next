"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCard from "../shared/Product";

// Define product type
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  rating: number;
}

// Define products type
interface ProductCategories {
  [key: string]: Product[];
}

export default function ProductShowcase({
  products,
}: {
  products: ProductCategories;
}) {
  const [activeTab, setActiveTab] = useState("featured");

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <Tabs
        defaultValue="featured"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="featured">NỔI BẬT</TabsTrigger>
          <TabsTrigger value="new">MỚI</TabsTrigger>
          <TabsTrigger value="sale">
            <span className="text-red-500">GIẢM GIÁ</span>
          </TabsTrigger>
        </TabsList>
        {Object.entries(products).map(([key, items]) => (
          <TabsContent key={key} value={key}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {items.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <div className="mt-8 text-center">
        <Link href="/store">
          <Button size="lg">Xem thêm</Button>
        </Link>
      </div>
    </div>
  );
}
