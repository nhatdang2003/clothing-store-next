import { productApi } from "@/services/product.api";
import { useQuery } from "@tanstack/react-query";

export const useProductListQuery = (page: number, size: number) => {
  return useQuery({
    queryKey: ["products", page, size],
    queryFn: () => productApi.getProducts(page, size),
  });
};
