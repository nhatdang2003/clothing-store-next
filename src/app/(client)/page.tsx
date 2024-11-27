import CategoryCarousel from "@/components/home/category-carousel";
import HomeCarousel from "@/components/home/home-carousel";
import TabsProduct from "@/components/home/tabsProduct";
import http from "@/services/http";

const products = {
  featured: [
    {
      id: 1,
      name: "Áo thun mùa hè",
      description: "Áo cotton nhẹ cho thời tiết ấm",
      price: "249000",
      category: "Tops",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Quần jean classic",
      description: "Quần jean basic đa năng",
      price: "599000",
      category: "Bottoms",
      rating: 4.5,
    },
    {
      id: 3,
      name: "Áo khoác denim",
      description: "Áo khoác jean thời trang",
      price: "799000",
      category: "Outerwear",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Áo polo basic",
      description: "Áo polo đơn giản thanh lịch",
      price: "299000",
      category: "Tops",
      rating: 4.6,
    },
  ],
  new: [
    {
      id: 5,
      name: "Áo sơ mi kẻ sọc",
      description: "Áo sơ mi văn phòng thời trang",
      price: "449000",
      category: "Tops",
      rating: 4.4,
    },
    {
      id: 6,
      name: "Quần short thể thao",
      description: "Quần short thoáng mát",
      price: "199000",
      category: "Bottoms",
      rating: 4.3,
    },
    {
      id: 7,
      name: "Áo len mỏng",
      description: "Áo len mỏng thời trang",
      price: "399000",
      category: "Tops",
      rating: 4.9,
    },
    {
      id: 8,
      name: "Áo khoác gió",
      description: "Áo khoác gió nhẹ chống nước",
      price: "699000",
      category: "Outerwear",
      rating: 4.7,
    },
  ],
  sale: [
    {
      id: 9,
      name: "Áo thun graphic",
      description: "Áo thun in họa tiết",
      price: "149000",
      category: "Tops",
      rating: 4.5,
    },
    {
      id: 10,
      name: "Quần jogger",
      description: "Quần jogger thoải mái",
      price: "299000",
      category: "Bottoms",
      rating: 4.6,
    },
    {
      id: 11,
      name: "Áo hoodie basic",
      description: "Áo hoodie đơn giản",
      price: "499000",
      category: "Outerwear",
      rating: 4.8,
    },
    {
      id: 12,
      name: "Áo polo sọc",
      description: "Áo polo kẻ sọc thời trang",
      price: "249000",
      category: "Tops",
      rating: 4.4,
    },
  ],
};

export default async function Home() {
  try {
    const response = await http.get({ url: "/api/v1/products" });
    console.log(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <HomeCarousel />
      <TabsProduct products={products} />
      <CategoryCarousel />
    </div>
  );
}
