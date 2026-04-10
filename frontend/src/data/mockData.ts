import {
  AppNotification,
  ClubProfile,
  DashboardData,
  DiscoverPlayer,
  MessageThread,
  SettingsSection,
} from "../types";

export const dashboardData: DashboardData = {
  athleteName: "Nathan Durand",
  roleLabel: "Attaquant · U21",
  views: 668,
  recentVideos: [
    { id: "1", title: "Finition surface", color: "#B9E449" },
    { id: "2", title: "Vision du jeu", color: "#8CC7FF" },
    { id: "3", title: "Appels profonds", color: "#E3EEF9" },
  ],
  interestedClubs: [
    { id: "1", name: "Charlotte Soccer Club", country: "USA" },
    { id: "2", name: "Olympique de Lille", country: "France" },
  ],
};

export const discoverPlayers: DiscoverPlayer[] = [
  {
    id: "1",
    name: "John Doe",
    age: 18,
    country: "Allemagne",
    sport: "Football",
    position: "Ailier",
    likes: 50,
    views: 1500,
    accent: "#9AD400",
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 20,
    country: "France",
    sport: "Basketball",
    position: "Meneuse",
    likes: 81,
    views: 1940,
    accent: "#16355F",
  },
];

export const messageThreads: MessageThread[] = [
  { id: "1", name: "Albert", preview: "Hello", timestamp: "2h" },
  { id: "2", name: "Tom Smith", preview: "Thanks!", timestamp: "3d", unread: true },
  { id: "3", name: "Marie", preview: "See you then.", timestamp: "Tue" },
];

export const notifications: AppNotification[] = [
  { id: "1", type: "view", title: "New view", timeLabel: "1h ago" },
  { id: "2", type: "message", title: "Message received", timeLabel: "3h ago" },
  { id: "3", type: "like", title: "Video liked", timeLabel: "5h ago" },
  { id: "4", type: "view", title: "New view", timeLabel: "6h ago" },
];

export const settingsSections: SettingsSection[] = [
  { id: "profile", label: "Profil" },
  { id: "security", label: "Sécurité" },
  { id: "language", label: "Langue" },
  { id: "support", label: "Support" },
];

export const featuredClub: ClubProfile = {
  name: "Charlotte Soccer Club",
  summary: "Professional soccer club based in Charlotte, competing in top national league.",
  city: "Charlotte",
  level: "Top national league",
  highlights: ["Recrute U18-U23", "Analyse vidéo active", "Ouvert aux essais vidéo"],
};
