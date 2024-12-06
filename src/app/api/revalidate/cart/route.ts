import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    // Revalidate shop page and all dynamic product pages
    revalidatePath("/", "layout");

    return Response.json({ success: true });
  } catch (error) {
    console.error("Revalidation error:", error);
    return Response.json(
      { success: false, error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}
