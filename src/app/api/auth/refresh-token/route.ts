import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import http from "@/services/http";

// Tạo instance riêng cho backend API
export async function GET() {
  try {
    const refreshToken = cookies().get("refresh_token")?.value;
    // Gọi API backend
    const response = await http.get({
      url: "/api/v1/auth/refresh",
      options: {
        headers: {
          Cookie: `refresh_token=${refreshToken}`,
        },
      },
    });

    const { access_token, refresh_token } = response.data;

    const decodedAccessToken = jose.decodeJwt(access_token);
    const decodedRefreshToken = jose.decodeJwt(refresh_token);

    // Set cookie
    cookies().set({
      name: "access_token",
      value: access_token,
      httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: (decodedAccessToken.exp ?? 0) * 1000,
    });

    cookies().set({
      name: "refresh_token",
      value: refresh_token,
      httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: (decodedRefreshToken.exp ?? 0) * 1000,
    });

    return NextResponse.json({
      access_token,
      refresh_token,
      message: "Refresh token thành công",
    });
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Đăng nhập thất bại";

    return NextResponse.json({ error: message }, { status });
  }
}