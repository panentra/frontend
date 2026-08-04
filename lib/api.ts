const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://senoaji.daffahmad.my.id";

export interface User {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Helper to save authentication data in localStorage
export function setAuthData(token: string, user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("panentra_token", token);
    localStorage.setItem("panentra_user", JSON.stringify(user));
  }
}

// Helper to get stored Bearer token
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("panentra_token");
  }
  return null;
}

// Helper to get stored user object
export function getAuthUser(): User | null {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("panentra_user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}

// Helper to clear stored auth data
export function clearAuthData() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("panentra_token");
    localStorage.removeItem("panentra_user");
  }
}

/**
 * Register a new user
 * POST /api/register
 */
export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      (data?.errors ? Object.values(data.errors).flat().join(", ") : "Pendaftaran gagal.");
    throw new Error(errorMsg);
  }

  return data as AuthResponse;
}

/**
 * Login user
 * POST /api/login
 */
export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      (data?.errors ? Object.values(data.errors).flat().join(", ") : "Login gagal.");
    throw new Error(errorMsg);
  }

  return data as AuthResponse;
}

/**
 * Get current user info
 * GET /api/user
 */
export async function getCurrentUser(token?: string): Promise<User> {
  const authToken = token || getAuthToken();
  if (!authToken) {
    throw new Error("Token autentikasi tidak ditemukan.");
  }

  const response = await fetch(`${API_BASE_URL}/api/user`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Gagal mengambil data pengguna.");
  }

  return data as User;
}

/**
 * Logout current user
 * POST /api/logout
 */
export async function logoutUser(token?: string): Promise<{ message: string }> {
  const authToken = token || getAuthToken();

  if (authToken) {
    try {
      await fetch(`${API_BASE_URL}/api/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
    } catch (err) {
      console.warn("Logout API call error:", err);
    }
  }

  clearAuthData();
  return { message: "Logged out." };
}
