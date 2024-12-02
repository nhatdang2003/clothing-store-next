import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import http from "@/services/http";
import { cookies } from "next/headers";

// Đánh dấu route này là dynamic
export const dynamic = "force-dynamic";

// Tạo instance riêng cho backend API
export async function GET() {
  try {
    const refreshToken = cookies().get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token not found" },
        { status: 401 }
      );
    }

    // Call API backend to refresh token
    const response = await http.get({
      url: "/api/v1/auth/refresh",
      options: {
        headers: {
          Cookie: `refresh_token=${refreshToken}`,
        },
      },
    });

    const { access_token, refresh_token } = response.data;

    // Decode new tokens to get expiration
    const { exp: accessExp } = jose.decodeJwt(access_token);
    const { exp: refreshExp } = jose.decodeJwt(refresh_token);

    const cookieStore = cookies();

    // Set new access token with JWT expiration
    cookieStore.set("access_token", access_token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(accessExp! * 1000),
    });

    // Set new refresh token with JWT expiration
    cookieStore.set("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(refreshExp! * 1000),
    });

    return NextResponse.json({
      access_token,
      refresh_token,
      message: "Refresh token thành công",
    });
  } catch (error: any) {
    console.log(">>>>", error.message);
    if (error.message === "NEXT_REDIRECT") throw error;
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Refresh token thất bại";

    return NextResponse.json({ error: message }, { status });
  }
}
