import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  role: "client" | "admin";
};

type AuthState = {
  user: User | null;
  role: User["role"] | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, role: user?.role, isAuthenticated: true }),

      clearUser: () => set({ user: null, role: null, isAuthenticated: false }),
    }),
    {
      name: "auth-user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
