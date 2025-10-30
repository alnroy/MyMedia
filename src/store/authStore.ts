import { create } from "zustand";
import { authService } from "@/services/authService";
import { User } from "@/types";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,

register: async (name, email, password) => {
  set({ isLoading: true });
  try {
    // hit the signup API
    await authService.signup(name, email, password);

    // 🚫 don't auto-login — remove token & user storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // mark as NOT authenticated so user goes to SignIn
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  } finally {
    set({ isLoading: false });
  }
},


  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const data = await authService.login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
  },
checkAuth: async () => {
  set({ isLoading: true });

  const token = localStorage.getItem("token");

  // If no token exists, reset everything
  if (!token) {
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    return;
  }

  try {
    // ✅ Fetch user info from backend using token
    const response = await authService.getMe();

    // Assuming your backend returns something like:
    // { id, name, email, createdAt, ... }
    const userData = response.user || response;

    // ✅ Store user info in Zustand + localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    set({
      user: userData,
      token,
      isAuthenticated: true,
    });
  } catch (error) {
    console.error("Auth check failed:", error);
    // If token is invalid or expired, clear everything
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
  } finally {
    set({ isLoading: false });
  }
},

}));
