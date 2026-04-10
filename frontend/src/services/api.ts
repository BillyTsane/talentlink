import {
  dashboardData,
  discoverPlayers,
  featuredClub,
  messageThreads,
  notifications,
  settingsSections,
} from "../data/mockData";
import { AuthSession, AuthUser, DiscoverPlayer, Role } from "../types";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.trim() || "http://localhost:8000/api";

export const mockApi = {
  getDashboard: () => dashboardData,
  getDiscoverFeed: () => discoverPlayers,
  getMessages: () => messageThreads,
  getNotifications: () => notifications,
  getSettingsSections: () => settingsSections,
  getFeaturedClub: () => featuredClub,
};

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, payload: unknown, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function apiPatch<T>(path: string, payload: unknown, token: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

type DiscoverApiItem = {
  id: number;
  user?: {
    id: number;
    username: string;
    country: string;
  };
  sport: string;
  position: string;
  age?: number | null;
};

type RolesApiResponse = {
  roles: { value: "player" | "club" | "agent"; label: string }[];
};

export async function fetchDiscoverFeed(): Promise<DiscoverPlayer[]> {
  const items = await apiGet<DiscoverApiItem[]>("/users/discover");

  return items.map((item, index) => ({
    id: String(item.id),
    name: item.user?.username || `Talent ${item.id}`,
    age: item.age ?? 18,
    country: item.user?.country || "Unknown",
    sport: item.sport || "Football",
    position: item.position || "Joueur",
    likes: 40 + index * 9,
    views: 1000 + index * 350,
    accent: index % 2 === 0 ? "#9AD400" : "#16355F",
  }));
}

export async function fetchRoles(): Promise<RolesApiResponse["roles"]> {
  const response = await apiGet<RolesApiResponse>("/users/roles");
  return response.roles;
}

type LoginResponse = {
  access: string;
  refresh: string;
};

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  role: Role;
  country: string;
  city: string;
};

export async function login(username: string, password: string): Promise<AuthSession> {
  const tokens = await apiPost<LoginResponse>("/auth/login", { username, password });
  const user = await fetchMe(tokens.access);

  return {
    ...tokens,
    user,
  };
}

export async function register(payload: RegisterPayload): Promise<AuthSession> {
  await apiPost("/auth/register", payload);
  return login(payload.username, payload.password);
}

export async function fetchMe(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed: ${response.status}`);
  }

  return response.json() as Promise<AuthUser>;
}
