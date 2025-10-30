export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface Media {
  id: number;
  title: string;
  type: 'Movie' | 'TV Show';
  director: string;
  budget?: string;
  location?: string;
  duration?: string;
  year?: string;
  poster?: string;
  imageUrl?:string;
  userId: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface MediaListResponse {
  media: Media[];
  page: number;
  totalPages: number;
  total: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
