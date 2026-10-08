import { create } from "zustand";
import { persist } from "zustand/middleware";
import { httpsRequest } from "../../lib/http";

export interface User {
  id: string;
  fullname: string;
  email: string;
  mobile: string;
  role: "CUSTOMER" | "SERVANT";
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,

      setUser: (user) => {
        console.log("ZUSTAND SET USER:", user);

        set({
          user,
          loading: false,
        });
      },

      logout: async () => {
        try {
          set({ loading: true });
          await httpsRequest.post("/auth/logout");
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({
            user: null,

            loading: false,
          });
        }
      },
    }),
    {
      name: "servant-hiring-auth",
    }
  )
);