import React, { Suspense } from "react";
import PromotionList from "./promotion-list";
import { promotionApi } from "@/services/promotion.api";
import { PAGE_SIZE } from "@/constants/promotion";

export const dynamic = "force-dynamic";

export default async function PromotionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page: number;
    size: number;
    search: string;
  }>;
}) {
  let promotions = [];
  const { page, search } = await searchParams;
  try {
    promotions = await promotionApi.getPromotions(page, PAGE_SIZE, search);
  } catch (error) {
    console.log(error);
    return <div>Đã có lỗi xảy ra, vui lòng thử lại sau</div>;
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PromotionList initialData={promotions} />
    </Suspense>
  );
}
