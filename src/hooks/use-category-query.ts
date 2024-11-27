import { categoryApi } from "@/services/category.api";
import { useQuery } from "@tanstack/react-query";

export const useCategoryListQuery = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getCategories,
  });
};
