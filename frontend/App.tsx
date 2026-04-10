import { StatusBar } from "expo-status-bar";
import { startTransition, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import { fetchDiscoverFeed, fetchRoles, mockApi } from "./src/services/api";
import {
  AuthChoiceScreen,
  ClubProfileScreen,
  CreateProfileScreen,
  DashboardScreen,
  DiscoverScreen,
  MessagesScreen,
  NotificationsScreen,
  OnboardingScreen,
  SettingsScreen,
  UploadScreen,
} from "./src/screens";
import { AppScreen, DiscoverPlayer, Role } from "./src/types";
import { colors } from "./src/theme/tokens";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("onboarding");
  const [selectedRole, setSelectedRole] = useState<Role>("player");
  const [discoverFeed, setDiscoverFeed] = useState<DiscoverPlayer[]>(
    mockApi.getDiscoverFeed()
  );
  const [availableRoles, setAvailableRoles] = useState<
    { value: Role; label: string }[]
  >([
    { value: "player", label: "Player" },
    { value: "club", label: "Club" },
    { value: "agent", label: "Agent" },
  ]);

  const data = {
    dashboard: mockApi.getDashboard(),
    messages: mockApi.getMessages(),
    notifications: mockApi.getNotifications(),
    settings: mockApi.getSettingsSections(),
    featuredClub: mockApi.getFeaturedClub(),
  };

  useEffect(() => {
    let isMounted = true;

    async function hydrateFromApi() {
      try {
        const [roles, discover] = await Promise.all([
          fetchRoles(),
          fetchDiscoverFeed(),
        ]);

        if (!isMounted) {
          return;
        }

        startTransition(() => {
          setAvailableRoles(roles);
          if (discover.length > 0) {
            setDiscoverFeed(discover);
          }
        });
      } catch {
        // Keep mock data when the backend is unavailable during local mobile iteration.
      }
    }

    hydrateFromApi();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.appShell}>
        {screen === "onboarding" ? (
          <OnboardingScreen
            onLogin={() => setScreen("dashboard")}
            onRegister={() => setScreen("auth")}
          />
        ) : null}
        {screen === "auth" ? (
          <AuthChoiceScreen
            roles={availableRoles}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
            onContinue={() => setScreen("create-profile")}
          />
        ) : null}
        {screen === "create-profile" ? (
          <CreateProfileScreen
            selectedRole={selectedRole}
            onBack={() => setScreen("auth")}
            onFinish={() => setScreen("dashboard")}
          />
        ) : null}
        {screen === "dashboard" ? (
          <DashboardScreen
            data={data.dashboard}
            onNavigate={setScreen}
            onOpenClub={() => setScreen("club-profile")}
          />
        ) : null}
        {screen === "discover" ? (
          <DiscoverScreen
            players={discoverFeed}
            onNavigate={setScreen}
            onOpenClub={() => setScreen("club-profile")}
          />
        ) : null}
        {screen === "upload" ? <UploadScreen onNavigate={setScreen} /> : null}
        {screen === "messages" ? (
          <MessagesScreen threads={data.messages} onNavigate={setScreen} />
        ) : null}
        {screen === "notifications" ? (
          <NotificationsScreen
            notifications={data.notifications}
            onNavigate={setScreen}
          />
        ) : null}
        {screen === "settings" ? (
          <SettingsScreen
            sections={data.settings}
            onNavigate={setScreen}
            onLogout={() => setScreen("onboarding")}
          />
        ) : null}
        {screen === "club-profile" ? (
          <ClubProfileScreen
            club={data.featuredClub}
            onBack={() => setScreen("discover")}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  appShell: {
    flex: 1,
    backgroundColor: colors.paper,
  },
});
