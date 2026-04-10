import {
  dashboardData,
  discoverPlayers,
  featuredClub,
  messageThreads,
  notifications,
  settingsSections,
} from "../data/mockData";
import { DiscoverPlayer } from "../types";

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
