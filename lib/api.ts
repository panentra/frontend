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

export interface ExpenseItem {
  id: number;
  title: string;
  category: string;
  amount: number;
  note?: string;
  incurred_on?: string;
  season_id?: number;
  season_name?: string;
  [key: string]: unknown;
}

export interface ExpensesResponse {
  data: ExpenseItem[];
}

export interface CreateExpensePayload {
  planting_season_id?: number;
  title: string;
  category: string;
  amount: number;
  note?: string;
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
  is_default?: boolean;
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

export interface SeasonResponse {
  data: Season[];
}

export async function getSeasons(landId: number | string = 3): Promise<SeasonResponse> {
  return fetchWithAuth<SeasonResponse>(`/api/farmer/lands/${landId}/seasons`);
}

export async function createSeason(landId: number | string = 3, payload: Record<string, unknown>): Promise<{ data: Season }> {
  return fetchWithAuth<{ data: Season }>(`/api/farmer/lands/${landId}/seasons`, {
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

export async function getExpenses(): Promise<ExpensesResponse> {
  return fetchWithAuth<ExpensesResponse>("/api/farmer/expenses");
}

export async function createExpense(payload: CreateExpensePayload): Promise<{ data: ExpenseItem }> {
  return fetchWithAuth<{ data: ExpenseItem }>("/api/farmer/expenses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteExpense(id: number | string): Promise<{ message: string }> {
  return fetchWithAuth<{ message: string }>(`/api/farmer/expenses/${id}`, {
    method: "DELETE",
  });
}

export interface FarmerListingItem {
  id: number;
  farmerName?: string;
  farmerRating?: number;
  farmerTotalSales?: number;
  farmerLocation?: string;
  distanceKm?: number;
  commodity?: string;
  grade?: string;
  hppPerKg?: number;
  sellingPrice?: number;
  availableKg?: number;
  harvestStatus?: string;
  allowNegotiation?: boolean;
  productImage?: string | null;
  farmerAvatar?: string | null;
  harvestCategory?: string;
  isBestSeller?: boolean;
  deliveryMethod?: string;
  certifications?: string[];
  status?: string;
  expiresAt?: string;
  [key: string]: unknown;
}

export interface FarmerListingsResponse {
  data: FarmerListingItem[];
}

export async function getFarmerListings(): Promise<FarmerListingsResponse> {
  return fetchWithAuth<FarmerListingsResponse>("/api/farmer/listings");
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

export interface SupplierOrderItem {
  id: number;
  order_no: string;
  commodity: string;
  grade: string;
  qtyKg: number;
  pricePerKg: number;
  subtotal: number;
  service_fee?: number;
  grandTotal: number;
  status: string;
  escrowStatus?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  deliveryMethod?: string;
  deliveryAddress?: string;
  deliveryInfo?: DeliveryInfo | null;
  listingPhoto?: string | null;
  listingLocation?: string;
  paidAt?: string | null;
  completedAt?: string | null;
  createdAt?: string;
  buyer?: {
    id: number;
    name: string;
    phone?: string | null;
  };
  seller?: {
    id: number;
    name: string;
    location?: string | null;
    rating?: number | null;
  };
  [key: string]: unknown;
}

export interface SupplierOrdersResponse {
  data: SupplierOrderItem[];
}

export interface SupplierDashboardData {
  monthly_spend?: number;
  monthly_kg?: number;
  active_orders_count: number;
  completed_orders_count: number;
  favorite_farmers_count: number;
  recent_orders: RecentSale[];
  [key: string]: unknown;
}

export interface FarmerOrderItem {
  id: number;
  order_no: string;
  commodity: string;
  grade: string;
  qtyKg: number;
  pricePerKg: number;
  subtotal: number;
  service_fee?: number;
  grandTotal: number;
  status: string;
  escrowStatus?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  deliveryMethod?: string;
  deliveryAddress?: string;
  buyer?: {
    id: number;
    name: string;
    phone?: string | null;
  };
  seller?: {
    id: number;
    name: string;
    location?: string | null;
    rating?: number | null;
  };
  createdAt?: string;
  [key: string]: unknown;
}

export interface FarmerOrdersResponse {
  data: FarmerOrderItem[];
}

export async function getFarmerOrders(status?: string): Promise<FarmerOrdersResponse> {
  const query = status ? `?status=${status}` : "";
  return fetchWithAuth<FarmerOrdersResponse>(`/api/farmer/orders${query}`);
}

export async function updateOrderStatus(id: number | string, status: string): Promise<{ message?: string; data?: FarmerOrderItem }> {
  return fetchWithAuth<{ message?: string; data?: FarmerOrderItem }>(`/api/farmer/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export interface FarmerTaskItem {
  id: number;
  day: number;
  month_year: string;
  title: string;
  crop?: string;
  time?: string;
  status: "pending" | "completed" | string;
  type: "fertilizer" | "water" | "harvest" | "pest" | "care" | string;
  desc?: string;
}

export interface FarmerTasksResponse {
  data: FarmerTaskItem[];
}

export async function getFarmerTasks(): Promise<FarmerTasksResponse> {
  return fetchWithAuth<FarmerTasksResponse>("/api/farmer/tasks");
}

export async function createTask(payload: {
  day: number;
  month_year: string;
  title: string;
  type: string;
  crop?: string;
  time?: string;
  desc?: string;
  land_id?: number;
  status?: string;
}): Promise<{ data: FarmerTaskItem }> {
  return fetchWithAuth<{ data: FarmerTaskItem }>("/api/farmer/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTask(
  id: number | string,
  payload: { status?: string; title?: string; time?: string; desc?: string }
): Promise<{ data: FarmerTaskItem }> {
  return fetchWithAuth<{ data: FarmerTaskItem }>(`/api/farmer/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function downloadSalesInvoice(orderId: number | string): Promise<Blob> {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/api/farmer/orders/${orderId}/invoice`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to download invoice: ${res.statusText}`);
  }
  return res.blob();
}

export async function downloadHppReport(): Promise<Blob> {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/api/farmer/hpp-report`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to download HPP report: ${res.statusText}`);
  }
  return res.blob();
}

// ==========================================
// 3. SUPPLIER ENDPOINTS (/api/supplier/...)
// ==========================================

export async function getSupplierDashboard(): Promise<SupplierDashboardData> {
  return fetchWithAuth<SupplierDashboardData>("/api/supplier/dashboard");
}

export async function getMarketplace(params?: Record<string, string>): Promise<FarmerListingsResponse> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  return fetchWithAuth<FarmerListingsResponse>(`/api/supplier/marketplace${query}`);
}

export async function getListingDetail(id: number | string): Promise<{ data: FarmerListingItem }> {
  return fetchWithAuth<{ data: FarmerListingItem }>(`/api/supplier/listings/${id}`);
}

export async function getSupplierOrders(): Promise<SupplierOrdersResponse> {
  return fetchWithAuth<SupplierOrdersResponse>("/api/supplier/orders");
}

export async function createSupplierOrder(payload: Record<string, unknown>): Promise<{ data: SupplierOrderItem }> {
  return fetchWithAuth<{ data: SupplierOrderItem }>("/api/supplier/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function payOrder(id: number | string, payload?: Record<string, unknown>): Promise<{ data: SupplierOrderItem }> {
  return fetchWithAuth<{ data: SupplierOrderItem }>(`/api/supplier/orders/${id}/pay`, {
    method: "PATCH",
    body: payload ? JSON.stringify(payload) : undefined,
  });
}

export async function confirmOrderReceived(id: number | string): Promise<{
  data: { id: number; status: string; escrowStatus: string; completedAt: string };
}> {
  return fetchWithAuth<{ data: { id: number; status: string; escrowStatus: string; completedAt: string } }>(
    `/api/supplier/orders/${id}/confirm-received`,
    { method: "PATCH" }
  );
}

export async function startNegotiation(payload: StartNegotiationPayload): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>("/api/supplier/chats/from-listing", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function respondFarmerNegotiation(payload: {
  order_id: number | string;
  action: "accept" | "counter" | "reject";
  counter_price?: number;
  message?: string;
}): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>("/api/farmer/negotiations/respond", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getFavorites(): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>("/api/supplier/favorites");
}

export async function addFavorite(sellerId: number | string): Promise<{ message: string }> {
  return fetchWithAuth<{ message: string }>(`/api/supplier/favorites/${sellerId}`, {
    method: "POST",
  });
}

export async function removeFavorite(sellerId: number | string): Promise<{ message: string }> {
  return fetchWithAuth<{ message: string }>(`/api/supplier/favorites/${sellerId}`, {
    method: "DELETE",
  });
}

export interface StartNegotiationPayload {
  listing_id: number | string;
  offer_price?: number;
  offer_qty?: number;
  message?: string;
}

export async function getSupplierDeliveries(): Promise<SupplierOrdersResponse> {
  return fetchWithAuth<SupplierOrdersResponse>("/api/supplier/deliveries");
}

export interface ReviewPayload {
  order_id: number | string;
  rating: number;
  comment?: string;
}

export async function submitReview(payload: ReviewPayload): Promise<{ message?: string }> {
  return fetchWithAuth<{ message?: string }>("/api/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ==========================================
// 4. SHARED ENDPOINTS (/api/shared/...)
// ==========================================

export interface MarketPriceItem {
  id: number;
  name: string;
  category?: string;
  farmerPrice: number;
  marketPrice: number;
  trend?: string;
  location?: string;
  status?: string;
  harvestVol?: string;
  recordedOn?: string;
}

export interface PriceHistoryItem {
  id: number;
  commodity_id?: number;
  commodity: string;
  date: string;
  price: number;
}

export async function getMarketPrices(): Promise<{ data: MarketPriceItem[] }> {
  try {
    return await fetchWithAuth<{ data: MarketPriceItem[] }>("/api/shared/market-prices");
  } catch {
    return fetchWithAuth<{ data: MarketPriceItem[] }>("/api/prices");
  }
}

export async function getPriceHistory(commodity?: string): Promise<{ data: PriceHistoryItem[] }> {
  const query = commodity ? `?commodity=${encodeURIComponent(commodity)}` : "";
  try {
    return await fetchWithAuth<{ data: PriceHistoryItem[] }>(`/api/shared/price-history${query}`);
  } catch {
    return fetchWithAuth<{ data: PriceHistoryItem[] }>(`/api/price-history${query}`);
  }
}

export interface ApiChatCounterpart {
  id: number;
  name: string;
  location?: string;
  avatar?: string | null;
}

export interface ApiChatListItem {
  id: number;
  counterpart: ApiChatCounterpart;
  item: string;
  grade?: string;
  last_message: string;
  last_message_time: string;
  offer_price?: number | null;
  offer_qty?: number | null;
  unread_count?: number;
  order_id?: number | null;
  listing_id?: number | null;
}

export interface ApiChatMessageItem {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_name: string;
  text: string;
  offer_price?: number | null;
  offer_qty?: number | null;
  created_at: string;
  read_at?: string | null;
}

export async function getChats(): Promise<{ data: ApiChatListItem[] }> {
  return fetchWithAuth<{ data: ApiChatListItem[] }>("/api/chats");
}

export async function getChatMessages(chatId: number | string): Promise<{ data: ApiChatMessageItem[] }> {
  return fetchWithAuth<{ data: ApiChatMessageItem[] }>(`/api/chats/${chatId}/messages`);
}

export async function sendChatMessage(
  chatId: number | string,
  payload: { text: string; conversation_id?: number | string; offer_price?: number; offer_qty?: number }
): Promise<{ data: ApiChatMessageItem }> {
  return fetchWithAuth<{ data: ApiChatMessageItem }>(`/api/chats/${chatId}/messages`, {
    method: "POST",
    body: JSON.stringify({
      conversation_id: chatId,
      text: payload.text,
      offer_price: payload.offer_price,
      offer_qty: payload.offer_qty,
    }),
  });
}



export async function getBankAccounts(): Promise<{ data: BankAccount[] }> {
  try {
    return await fetchWithAuth<{ data: BankAccount[] }>("/api/bank-accounts");
  } catch {
    return await fetchWithAuth<{ data: BankAccount[] }>("/api/shared/bank-accounts");
  }
}

export async function createBankAccount(payload: Record<string, unknown>): Promise<{ data: BankAccount }> {
  try {
    return await fetchWithAuth<{ data: BankAccount }>("/api/bank-accounts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch {
    return await fetchWithAuth<{ data: BankAccount }>("/api/shared/bank-accounts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

export async function deleteBankAccount(id: number | string): Promise<{ message: string }> {
  try {
    return await fetchWithAuth<{ message: string }>(`/api/bank-accounts/${id}`, {
      method: "DELETE",
    });
  } catch {
    return await fetchWithAuth<{ message: string }>(`/api/shared/bank-accounts/${id}`, {
      method: "DELETE",
    });
  }
}

export async function setPrimaryBankAccount(id: number | string): Promise<{ message: string }> {
  try {
    return await fetchWithAuth<{ message: string }>(`/api/bank-accounts/${id}/primary`, {
      method: "PATCH",
    });
  } catch {
    return await fetchWithAuth<{ message: string }>(`/api/shared/bank-accounts/${id}/primary`, {
      method: "PATCH",
    });
  }
}

export interface FarmerOnboardingPayload {
  role?: "petani";
  display_name: string;
  farming_system: "konvensional" | "organik" | "semi_organik";
  land?: {
    name?: string;
    area?: number;
    area_unit?: "ha" | "are" | "m2";
    address?: string;
    lat?: number;
    lng?: number;
    commodity_id?: number;
    commodity_ids?: number[];
  };
}

export interface SupplierOnboardingPayload {
  role?: "pemasok";
  store_name: string;
  store_type: "modern" | "pasar" | "distributor" | "horeka" | "industri";
  purchase_volume: "kecil" | "sedang" | "besar" | "grosir";
  address?: string;
  lat?: number;
  lng?: number;
}

export async function completeOnboarding(
  payload: FarmerOnboardingPayload | SupplierOnboardingPayload
): Promise<Record<string, unknown>> {
  return fetchWithAuth<Record<string, unknown>>("/api/onboarding", {
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
