import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import http from "@/services/http";

export async function GET() {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token found" },
        { status: 200 }
      );
    }

    // Gọi API logout với refresh token
    await http.post({
      url: "/api/v1/auth/logout",
      body: {
        refresh_token: refreshToken,
      },
    });

    // Clear cookies
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    // Vẫn clear cookies ngay cả khi API fail
    const cookieStore = cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json(
      { message: "Logout failed but cookies cleared" },
      { status: 200 }
    );
  }
}
