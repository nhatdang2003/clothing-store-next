import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import http from "@/services/http";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (refreshToken) {
      // Always attempt to logout on backend
      await http.post({
        url: "/api/v1/auth/logout",
        body: { refresh_token: refreshToken },
      });
    }

    // Always clear cookies
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json({
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    // Always clear cookies even if API fails
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json(
      { message: "Đăng xuất thành công" },
      { status: 200 }
    );
  }
}
