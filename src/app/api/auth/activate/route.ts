import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import http from "@/services/http";
import * as jose from "jose";

export async function POST(request: Request) {
  try {
    const { key } = await request.json();

    const response = await http.get({
      url: `/api/v1/auth/activate?key=${key}`,
    });

    const { access_token, refresh_token } = response.data;

    // Decode JWT to get expiration
    const { exp: accessExp } = jose.decodeJwt(access_token);
    const { exp: refreshExp } = jose.decodeJwt(refresh_token);

    const cookieStore = await cookies();

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
      message: "Tài khoản đã được kích hoạt thành công",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message || "Không thể kích hoạt tài khoản",
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}
