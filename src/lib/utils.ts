import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAccessToken = () => {
  try {
    const authStorage = localStorage.getItem("auth-storage");
    if (!authStorage) return null;

    return JSON.parse(authStorage).state.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};

export const getRefreshToken = () => {
  try {
    const authStorage = localStorage.getItem("auth-storage");
    if (!authStorage) return null;

    return JSON.parse(authStorage).state.refresh_token;
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
