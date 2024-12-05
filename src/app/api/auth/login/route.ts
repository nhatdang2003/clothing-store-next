import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import http from "@/services/http";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await http.post({
      url: "/api/v1/auth/login",
      body,
    });

    const { access_token, refresh_token } = response.data;

    // Decode JWT to get expiration
    const { exp: accessExp } = jose.decodeJwt(access_token);
    const { exp: refreshExp } = jose.decodeJwt(refresh_token);

    const cookieStore = cookies();

    cookieStore.set("access_token", access_token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(accessExp! * 1000), // Convert to milliseconds
    });

    cookieStore.set("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(refreshExp! * 1000), // Convert to milliseconds
    });

    return NextResponse.json({
      message: "Đăng nhập thành công",
    });
  } catch (error: any) {
    console.error("Login error:", error.message);
    const status = error.response?.status || 500;
    const message = error.message || "Đăng nhập thất bại";

    return NextResponse.json({ message }, { status });
  }
}
