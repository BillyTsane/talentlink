export type Role = "player" | "club" | "agent";

export type AppScreen =
  | "boot"
  | "onboarding"
  | "login"
  | "auth"
  | "create-profile"
  | "dashboard"
  | "discover"
  | "upload"
  | "messages"
  | "notifications"
  | "settings"
  | "club-profile";

export type DashboardData = {
  athleteName: string;
  roleLabel: string;
  views: number;
  recentVideos: { id: string; title: string; color: string }[];
  interestedClubs: { id: string; name: string; country: string }[];
};

export type DiscoverPlayer = {
  id: string;
  name: string;
  age: number;
  country: string;
  sport: string;
  position: string;
  likes: number;
  views: number;
  accent: string;
};

export type MessageThread = {
  id: string;
  name: string;
  preview: string;
  timestamp: string;
  unread?: boolean;
};

export type AppNotification = {
  id: string;
  type: "view" | "message" | "like";
  title: string;
  timeLabel: string;
};

export type SettingsSection = {
  id: string;
  label: string;
};

export type ClubProfile = {
  name: string;
  summary: string;
  city: string;
  level: string;
  highlights: string[];
};

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  role: Role;
  country: string;
  city: string;
};

export type AuthSession = {
  access: string;
  refresh: string;
  user: AuthUser;
};
