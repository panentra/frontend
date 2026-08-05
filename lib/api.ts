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

export interface Land {
  id: number;
  name: string;
  area: number;
  area_unit: string;
  commodity_id?: number;
  [key: string]: unknown;
}

export interface CreateLandPayload {
  name: string;
  area: number;
  area_unit: string;
  commodity_id?: number;
}

export interface Season {
  id: number;
  land_id: number;
  commodity_id: number;
  start_date: string;
  estimated_harvest_date?: string;
  status?: string;
  [key: string]: unknown;
}

export interface Expense {
  id: number;
  season_id?: number;
  category: string;
  amount: number;
  notes?: string;
  [key: string]: unknown;
}

export interface Listing {
  id: number;
  commodity: string;
  price: number;
  quantity: number;
  status?: string;
  [key: string]: unknown;
}

export interface Order {
  id: number;
  buyer_name?: string;
  commodity?: string;
  total_price?: number;
  status?: string;
  [key: string]: unknown;
}

export interface FarmerTask {
  id: number;
  title: string;
  date?: string;
  status?: string;
  [key: string]: unknown;
}

export interface DeliveryInfo {
  driver_name?: string;
  vehicle?: string;
  driver_phone?: string;
  eta?: string;
  [key: string]: unknown;
}

export interface RecentSale {
  id: number;
  order_no: string;
  listing_id?: number;
  buyer_id?: number;
  seller_id?: number;
  agreed_price: number;
  qty_kg: number;
  subtotal: number;
  service_fee: number;
  grand_total: number;
  grade?: string;
  payment_method?: string;
  delivery_method?: string;
  delivery_address?: string;
  status: string;
  escrow_status?: string;
  paid_at?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
  delivery_info?: DeliveryInfo;
  [key: string]: unknown;
}

export interface ActiveSeasonItem {
  id: number;
  name: string;
  status: string;
  [key: string]: unknown;
}

export interface FarmerDashboardData {
  revenue: number;
  completed_sales_count: number;
  active_orders_count: number;
  total_expense: number;
  active_lands_count: number;
  active_seasons: ActiveSeasonItem[];
  recent_sales: RecentSale[];
  [key: string]: unknown;
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
 * Generic authenticated fetch wrapper
 */
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Token autentikasi tidak ditemukan. Silakan login terlebih dahulu.");
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    ...(options.headers as Record<string, string>),
  };

  if (options.body && typeof options.body === "string" && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      (data?.errors ? Object.values(data.errors).flat().join(", ") : "Gagal memproses permintaan.");
    throw new Error(errorMsg);
  }

  return data as T;
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
  return fetchWithAuth<User>("/api/user", token ? { headers: { Authorization: `Bearer ${token}` } } : {});
}

/**
 * Logout current user
 * POST /api/logout
 */
export async function logoutUser(): Promise<{ message: string }> {
  try {
    await fetchWithAuth<{ message: string }>("/api/logout", { method: "POST" });
  } catch (err) {
    console.warn("Logout API error:", err);
  }
  clearAuthData();
  return { message: "Logged out." };
}

// ==========================================
// FARMER ENDPOINTS (/api/farmer/...)
// ==========================================

/**
 * GET /api/farmer/dashboard
 */
export async function getFarmerDashboard(): Promise<FarmerDashboardData> {
  return fetchWithAuth<FarmerDashboardData>("/api/farmer/dashboard");
}

/**
 * GET /api/farmer/lands
 */
export async function getLands(): Promise<Land[]> {
  return fetchWithAuth<Land[]>("/api/farmer/lands");
}

/**
 * POST /api/farmer/lands
 */
export async function createLand(payload: CreateLandPayload): Promise<Land> {
  return fetchWithAuth<Land>("/api/farmer/lands", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * PUT /api/farmer/lands/{id}
 */
export async function updateLand(id: number | string, payload: Partial<CreateLandPayload>): Promise<Land> {
  return fetchWithAuth<Land>(`/api/farmer/lands/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * DELETE /api/farmer/lands/{id}
 */
export async function deleteLand(id: number | string): Promise<{ message: string }> {
  return fetchWithAuth<{ message: string }>(`/api/farmer/lands/${id}`, {
    method: "DELETE",
  });
}

/**
 * GET /api/farmer/seasons
 */
export async function getSeasons(): Promise<Season[]> {
  return fetchWithAuth<Season[]>("/api/farmer/seasons");
}

/**
 * POST /api/farmer/seasons
 */
export async function createSeason(payload: Record<string, unknown>): Promise<Season> {
  return fetchWithAuth<Season>("/api/farmer/seasons", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * PUT /api/farmer/seasons/{id}
 */
export async function updateSeason(id: number | string, payload: Record<string, unknown>): Promise<Season> {
  return fetchWithAuth<Season>(`/api/farmer/seasons/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * GET /api/farmer/expenses
 */
export async function getExpenses(): Promise<Expense[]> {
  return fetchWithAuth<Expense[]>("/api/farmer/expenses");
}

/**
 * POST /api/farmer/expenses
 */
export async function createExpense(payload: Record<string, unknown>): Promise<Expense> {
  return fetchWithAuth<Expense>("/api/farmer/expenses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * DELETE /api/farmer/expenses/{id}
 */
export async function deleteExpense(id: number | string): Promise<{ message: string }> {
  return fetchWithAuth<{ message: string }>(`/api/farmer/expenses/${id}`, {
    method: "DELETE",
  });
}

/**
 * GET /api/farmer/listings
 */
export async function getFarmerListings(): Promise<Listing[]> {
  return fetchWithAuth<Listing[]>("/api/farmer/listings");
}

/**
 * POST /api/farmer/listings
 */
export async function createListing(payload: Record<string, unknown>): Promise<Listing> {
  return fetchWithAuth<Listing>("/api/farmer/listings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * PUT /api/farmer/listings/{id}
 */
export async function updateListing(id: number | string, payload: Record<string, unknown>): Promise<Listing> {
  return fetchWithAuth<Listing>(`/api/farmer/listings/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * DELETE /api/farmer/listings/{id}
 */
export async function deleteListing(id: number | string): Promise<{ message: string }> {
  return fetchWithAuth<{ message: string }>(`/api/farmer/listings/${id}`, {
    method: "DELETE",
  });
}

/**
 * GET /api/farmer/orders
 */
export async function getFarmerOrders(): Promise<Order[]> {
  return fetchWithAuth<Order[]>("/api/farmer/orders");
}

/**
 * PATCH /api/farmer/orders/{id}
 */
export async function updateOrderStatus(id: number | string, status: string): Promise<Order> {
  return fetchWithAuth<Order>(`/api/farmer/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

/**
 * GET /api/farmer/tasks
 */
export async function getFarmerTasks(): Promise<FarmerTask[]> {
  return fetchWithAuth<FarmerTask[]>("/api/farmer/tasks");
}

/**
 * POST /api/farmer/tasks
 */
export async function createTask(payload: Record<string, unknown>): Promise<FarmerTask> {
  return fetchWithAuth<FarmerTask>("/api/farmer/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * PUT /api/farmer/tasks/{id}
 */
export async function updateTask(id: number | string, payload: Record<string, unknown>): Promise<FarmerTask> {
  return fetchWithAuth<FarmerTask>(`/api/farmer/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * POST /api/farmer/negotiations/respond
 */
export async function respondNegotiation(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>("/api/farmer/negotiations/respond", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
