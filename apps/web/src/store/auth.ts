import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "marcelino-auth" }
  )
);

export function getPortalPath(roles: string[]): string {
  if (roles.includes("SUPER_ADMIN") || roles.includes("ADMIN")) return "/portal/admin";
  if (roles.includes("TEACHER")) return "/portal/teacher";
  if (roles.includes("PARENT")) return "/portal/parent";
  if (roles.includes("STUDENT")) return "/portal/student";
  return "/auth/login";
}
