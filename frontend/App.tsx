import { StatusBar } from "expo-status-bar";
import { startTransition, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import {
  fetchDiscoverFeed,
  fetchMe,
  fetchRoles,
  login,
  mockApi,
  register,
} from "./src/services/api";
import { clearSession, loadSession, saveSession } from "./src/services/authStorage";
import {
  AuthChoiceScreen,
  ClubProfileScreen,
  CreateProfileScreen,
  DashboardScreen,
  DiscoverScreen,
  LoadingScreen,
  LoginScreen,
  MessagesScreen,
  NotificationsScreen,
  OnboardingScreen,
  SettingsScreen,
  UploadScreen,
} from "./src/screens";
import { AppScreen, AuthSession, DiscoverPlayer, Role } from "./src/types";
import { colors } from "./src/theme/tokens";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("boot");
  const [selectedRole, setSelectedRole] = useState<Role>("player");
  const [session, setSession] = useState<AuthSession | null>(null);
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
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
    city: "",
  });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const data = {
    dashboard: session
      ? {
          ...mockApi.getDashboard(),
          athleteName: session.user.username,
          roleLabel: `${session.user.role} | ${session.user.country || "TalentLink"}`,
        }
      : mockApi.getDashboard(),
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
        // Keep mock data when the backend is unavailable during local iteration.
      }
    }

    hydrateFromApi();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const storedSession = await loadSession();

        if (!storedSession) {
          if (isMounted) {
            setScreen("onboarding");
          }
          return;
        }

        const user = await fetchMe(storedSession.access);

        if (!isMounted) {
          return;
        }

        setSession({ ...storedSession, user });
        setLoginForm({ username: user.username, password: "" });
        setScreen("dashboard");
      } catch {
        await clearSession();
        if (isMounted) {
          setScreen("onboarding");
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogin() {
    setAuthLoading(true);
    setAuthError("");

    try {
      const nextSession = await login(loginForm.username.trim(), loginForm.password);
      await saveSession(nextSession);
      setSession(nextSession);
      setScreen("dashboard");
    } catch {
      setAuthError("Connexion impossible. Verifie tes identifiants.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleRegister() {
    setAuthLoading(true);
    setAuthError("");

    try {
      const nextSession = await register({
        username: registerForm.username.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
        role: selectedRole,
        country: registerForm.country.trim(),
        city: registerForm.city.trim(),
      });
      await saveSession(nextSession);
      setSession(nextSession);
      setLoginForm({ username: nextSession.user.username, password: "" });
      setScreen("dashboard");
    } catch {
      setAuthError("Inscription impossible. Verifie les champs puis reessaie.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    await clearSession();
    setSession(null);
    setLoginForm({ username: "", password: "" });
    setRegisterForm({
      username: "",
      email: "",
      password: "",
      country: "",
      city: "",
    });
    setAuthError("");
    setScreen("onboarding");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.appShell}>
        {screen === "boot" ? <LoadingScreen /> : null}
        {screen === "onboarding" ? (
          <OnboardingScreen
            onLogin={() => setScreen("login")}
            onRegister={() => setScreen("auth")}
          />
        ) : null}
        {screen === "login" ? (
          <LoginScreen
            username={loginForm.username}
            password={loginForm.password}
            errorMessage={authError}
            loading={authLoading}
            onUsernameChange={(value) =>
              setLoginForm((current) => ({ ...current, username: value }))
            }
            onPasswordChange={(value) =>
              setLoginForm((current) => ({ ...current, password: value }))
            }
            onSubmit={handleLogin}
            onBack={() => setScreen("onboarding")}
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
            form={registerForm}
            errorMessage={authError}
            loading={authLoading}
            onChangeForm={setRegisterForm}
            onBack={() => setScreen("auth")}
            onFinish={handleRegister}
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
            onLogout={handleLogout}
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
