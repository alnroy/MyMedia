import { AuthResponse, User } from '@/types';
import axios from "axios";

const API_URL = "https://my-media-backend.vercel.app/api/auth/"; // ✅ match your backend prefix

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});
export const authService = {
  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/signup', {
      name,
      email,
      password,
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/login', {
      email,
      password,
    });

    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    
    return data;
  },
  

  async logout(): Promise<void> {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },

  getMe: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // should be { user: {...} } or just {...}
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
