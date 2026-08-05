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

export interface Commodity {
  id: number;
  name: string;
  category?: string;
  unit?: string;
  [key: string]: unknown;
}

export interface SeasonItem {
  id: number;
  name: string;
  commodity?: Commodity;
  start_date: string;
  end_date?: string;
  status: string;
  estimated_harvest_kg?: number;
  total_expense?: number;
  [key: string]: unknown;
}

export interface Land {
  id: number;
  name: string;
  area: string | number;
  area_unit: string;
  address?: string;
  lat?: number | null;
  lng?: number | null;
  commodity?: Commodity;
  seasons?: SeasonItem[];
  [key: string]: unknown;
}

export interface LandsResponse {
  data: Land[];
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

export interface BankAccount {
  id: number;
  bank_name: string;
  account_number: string;
  account_holder: string;
  is_primary?: boolean;
  [key: string]: unknown;
}

export interface ChatMessage {
  id: number;
  sender_id: number;
  message: string;
  created_at: string;
  [key: string]: unknown;
}

export interface ChatItem {
  id: number;
  participant_name?: string;
  last_message?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface NotificationItem {
  id: number;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
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

// ==========================================
// 1. AUTH ENDPOINTS (/api/...)
// ==========================================

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
    const errorMsg = data?.message || (data?.errors ? Object.values(data.errors).flat().join(", ") : "Pendaftaran gagal.");
    throw new Error(errorMsg);
  }
  return data as AuthResponse;
}

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
    const errorMsg = data?.message || (data?.errors ? Object.values(data.errors).flat().join(", ") : "Login gagal.");
    throw new Error(errorMsg);
  }
  return data as AuthResponse;
}

export async function getCurrentUser(token?: string): Promise<User> {
  return fetchWithAuth<User>("/api/user", token ? { headers: { Authorization: `Bearer ${token}` } } : {});
}

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
// 2. FARMER ENDPOINTS (/api/farmer/...)
// ==========================================

export async function getFarmerDashboard(): Promise<FarmerDashboardData> {
  return fetchWithAuth<FarmerDashboardData>("/api/farmer/dashboard");
}

export async function getLands(): Promise<LandsResponse> {
  return fetchWithAuth<LandsResponse>("/api/farmer/lands");
}

export async function createLand(payload: CreateLandPayload): Promise<Land> {
  return fetchWithAuth<Land>("/api/farmer/lands", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateLand(id: number | string, payload: Partial<CreateLandPayload>): Promise<Land> {
  return fetchWithAuth<Land>(`/api/farmer/lands/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteLand(id: number | string): Promise<{ message: string }> {
  return fetchWithAuth<{ message: string }>(`/api/farmer/lands/${id}`, {
    method: "DELETE",
  });
}

export async function getSeasons(): Promise<Season[]> {
  return fetchWithAuth<Season[]>("/api/farmer/seasons");
}

export async function createSeason(payload: Record<string, unknown>): Promise<Season> {
  return fetchWithAuth<Season>("/api/farmer/seasons", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateSeason(id: number | string, payload: Record<string, unknown>): Promise<Season> {
  return fetchWithAuth<Season>(`/api/farmer/seasons/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getExpenses(): Promise<Expense[]> {
  return fetchWithAuth<Expense[]>("/api/farmer/expenses");
}

export async function createExpense(payload: Record<string, unknown>): Promise<Expense> {
  return fetchWithAuth<Expense>("/api/farmer/expenses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteExpense(id: number | string): Promise<{ message: string }> {
  return fetchWithAuth<{ message: string }>(`/api/farmer/expenses/${id}`, {
    method: "DELETE",
  });
}

export async function getFarmerListings(): Promise<Listing[]> {
  return fetchWithAuth<Listing[]>("/api/farmer/listings");
}

export async function createListing(payload: Record<string, unknown>): Promise<Listing> {
  return fetchWithAuth<Listing>("/api/farmer/listings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateListing(id: number | string, payload: Record<string, unknown>): Promise<Listing> {
  return fetchWithAuth<Listing>(`/api/farmer/listings/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteListing(id: number | string): Promise<{ message: string }> {
  return fetchWithAuth<{ message: string }>(`/api/farmer/listings/${id}`, {
    method: "DELETE",
  });
}

export async function getFarmerOrders(): Promise<Order[]> {
  return fetchWithAuth<Order[]>("/api/farmer/orders");
}

export async function updateOrderStatus(id: number | string, status: string): Promise<Order> {
  return fetchWithAuth<Order>(`/api/farmer/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getFarmerTasks(): Promise<FarmerTask[]> {
  return fetchWithAuth<FarmerTask[]>("/api/farmer/tasks");
}

export async function createTask(payload: Record<string, unknown>): Promise<FarmerTask> {
  return fetchWithAuth<FarmerTask>("/api/farmer/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTask(id: number | string, payload: Record<string, unknown>): Promise<FarmerTask> {
  return fetchWithAuth<FarmerTask>(`/api/farmer/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function respondNegotiation(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>("/api/farmer/negotiations/respond", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ==========================================
// 3. SUPPLIER ENDPOINTS (/api/supplier/...)
// ==========================================

export async function getSupplierDashboard(): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>("/api/supplier/dashboard");
}

export async function getMarketplace(params?: Record<string, string>): Promise<Record<string, unknown>> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  return fetchWithAuth<Record<string, unknown>>(`/api/supplier/marketplace${query}`);
}

export async function getListingDetail(id: number | string): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>(`/api/supplier/listings/${id}`);
}

export async function getPurchaseHistory(): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>("/api/supplier/purchases");
}

export async function createSupplierOrder(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>("/api/supplier/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function payOrder(id: number | string, payload?: Record<string, unknown>): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>(`/api/supplier/orders/${id}/pay`, {
    method: "PATCH",
    body: payload ? JSON.stringify(payload) : undefined,
  });
}

export async function confirmOrderReceived(id: number | string): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>(`/api/supplier/orders/${id}/confirm-received`, {
    method: "PATCH",
  });
}

export async function startNegotiation(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>("/api/supplier/negotiations/start", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getFavorites(): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>("/api/supplier/favorites");
}

export async function addFavorite(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>("/api/supplier/favorites", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function removeFavorite(id: number | string): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>(`/api/supplier/favorites/${id}`, {
    method: "DELETE",
  });
}

export async function getSupplierDeliveries(): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>("/api/supplier/deliveries");
}

// ==========================================
// 4. SHARED ENDPOINTS (/api/shared/...)
// ==========================================

export async function getMarketPrices(): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>("/api/shared/market-prices");
}

export async function getPriceHistory(params?: Record<string, string>): Promise<Record<string, unknown>> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  return fetchWithAuth<Record<string, unknown>>(`/api/shared/price-history${query}`);
}

export async function getChats(): Promise<ChatItem[]> {
  return fetchWithAuth<ChatItem[]>("/api/shared/chats");
}

export async function getChatMessages(chatId: number | string): Promise<ChatMessage[]> {
  return fetchWithAuth<ChatMessage[]>(`/api/shared/chats/${chatId}/messages`);
}

export async function sendChatMessage(chatId: number | string, message: string): Promise<ChatMessage> {
  return fetchWithAuth<ChatMessage>(`/api/shared/chats/${chatId}/messages`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function getBankAccounts(): Promise<BankAccount[]> {
  return fetchWithAuth<BankAccount[]>("/api/shared/bank-accounts");
}

export async function createBankAccount(payload: Record<string, unknown>): Promise<BankAccount> {
  return fetchWithAuth<BankAccount>("/api/shared/bank-accounts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteBankAccount(id: number | string): Promise<{ message: string }> {
  return fetchWithAuth<{ message: string }>(`/api/shared/bank-accounts/${id}`, {
    method: "DELETE",
  });
}

export async function setPrimaryBankAccount(id: number | string): Promise<BankAccount> {
  return fetchWithAuth<BankAccount>(`/api/shared/bank-accounts/${id}/primary`, {
    method: "PATCH",
  });
}

export async function createReview(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>("/api/shared/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ==========================================
// 5. NOTIFICATIONS ENDPOINTS (/api/notifications/...)
// ==========================================

export async function getNotifications(): Promise<NotificationItem[]> {
  return fetchWithAuth<NotificationItem[]>("/api/notifications");
}

export async function markNotificationRead(id: number | string): Promise<NotificationItem> {
  return fetchWithAuth<NotificationItem>(`/api/notifications/${id}/read`, {
    method: "PATCH",
  });
}

export async function markAllNotificationsRead(): Promise<{ message: string }> {
  return fetchWithAuth<{ message: string }>("/api/notifications/read-all", {
    method: "PATCH",
  });
}

export async function deleteNotification(id: number | string): Promise<{ message: string }> {
  return fetchWithAuth<{ message: string }>(`/api/notifications/${id}`, {
    method: "DELETE",
  });
}

// ==========================================
// 6. ADMIN ENDPOINTS (/api/admin/...)
// ==========================================

export async function getAdminUsers(): Promise<User[]> {
  return fetchWithAuth<User[]>("/api/admin/users");
}

export async function assignUserRole(id: number | string, role: string): Promise<User> {
  return fetchWithAuth<User>(`/api/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export async function verifyUser(id: number | string): Promise<User> {
  return fetchWithAuth<User>(`/api/admin/users/${id}/verify`, {
    method: "PATCH",
  });
}

export async function deleteAdminUser(id: number | string): Promise<{ message: string }> {
  return fetchWithAuth<{ message: string }>(`/api/admin/users/${id}`, {
    method: "DELETE",
  });
}

export async function getAdminCommodities(): Promise<Commodity[]> {
  return fetchWithAuth<Commodity[]>("/api/admin/commodities");
}

export async function createAdminCommodity(payload: Record<string, unknown>): Promise<Commodity> {
  return fetchWithAuth<Commodity>("/api/admin/commodities", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminCommodity(id: number | string, payload: Record<string, unknown>): Promise<Commodity> {
  return fetchWithAuth<Commodity>(`/api/admin/commodities/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminCommodity(id: number | string): Promise<{ message: string }> {
  return fetchWithAuth<{ message: string }>(`/api/admin/commodities/${id}`, {
    method: "DELETE",
  });
}

export async function getAdminPrices(): Promise<Record<string, unknown>[]> {
  return fetchWithAuth<Record<string, unknown>[]>("/api/admin/prices");
}

export async function createAdminPrice(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>("/api/admin/prices", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminPrice(id: number | string, payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>(`/api/admin/prices/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminPrice(id: number | string): Promise<{ message: string }> {
  return fetchWithAuth<{ message: string }>(`/api/admin/prices/${id}`, {
    method: "DELETE",
  });
}

export async function getAdminListings(): Promise<Listing[]> {
  return fetchWithAuth<Listing[]>("/api/admin/listings");
}

export async function deleteAdminListing(id: number | string): Promise<{ message: string }> {
  return fetchWithAuth<{ message: string }>(`/api/admin/listings/${id}`, {
    method: "DELETE",
  });
}

export async function getAdminOrders(): Promise<Order[]> {
  return fetchWithAuth<Order[]>("/api/admin/orders");
}
