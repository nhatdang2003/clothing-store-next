import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, User } from "@/types/store";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      access_token: null,
      refresh_token: null,
      setUser: (user) => set({ user }),
      setAccessToken: (access_token) => set({ access_token }),
      setRefreshToken: (refresh_token) => set({ refresh_token }),
      login: (user: User, access_token: string, refresh_token: string) =>
        set({ user, access_token, refresh_token }),
      logout: () => {
        set({ user: null, access_token: null, refresh_token: null });
      },
    }),
    {
      name: "auth-storage", // tên unique cho localStorage
    }
  )
);
