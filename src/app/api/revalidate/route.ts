import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    // xử lý logic add to cart của bạn

    // Revalidate các trang liên quan
    revalidatePath("/shop/[slug]", "page");
    revalidatePath("/cart");

    return Response.json({ success: true });
  } catch (error) {
    // xử lý error
  }
}
