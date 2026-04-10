import { ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors, radius, spacing, typography } from "./theme/tokens";
import {
  AppNotification,
  AppScreen,
  ClubProfile,
  DashboardData,
  DiscoverPlayer,
  MessageThread,
  Role,
  SettingsSection,
} from "./types";

function ScreenFrame({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.screen}>
      <View style={styles.backgroundOrbTop} />
      <View style={styles.backgroundOrbBottom} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BrandHeader />
        {title ? <Text style={styles.screenTitle}>{title}</Text> : null}
        {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
        {children}
      </ScrollView>
    </View>
  );
}

function BrandHeader() {
  return (
    <View style={styles.brandRow}>
      <View style={styles.brandMark}>
        <Text style={styles.brandMarkText}>T</Text>
      </View>
      <Text style={styles.brandText}>TalentLink</Text>
    </View>
  );
}

function PrimaryButton({
  label,
  onPress,
  variant = "primary",
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        variant === "primary" ? styles.buttonPrimary : styles.buttonSecondary,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "primary" ? styles.buttonTextPrimary : styles.buttonTextSecondary,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function TabBar({
  current,
  onNavigate,
}: {
  current: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}) {
  const items: { key: AppScreen; label: string }[] = [
    { key: "dashboard", label: "Accueil" },
    { key: "discover", label: "Découvrir" },
    { key: "upload", label: "Publier" },
    { key: "messages", label: "Messages" },
    { key: "settings", label: "Réglages" },
  ];

  return (
    <View style={styles.tabBar}>
      {items.map((item) => (
        <Pressable key={item.key} onPress={() => onNavigate(item.key)} style={styles.tabItem}>
          <Text
            style={[
              styles.tabLabel,
              current === item.key ? styles.tabLabelActive : null,
            ]}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function OnboardingScreen({
  onLogin,
  onRegister,
}: {
  onLogin: () => void;
  onRegister: () => void;
}) {
  return (
    <ScreenFrame>
      <View style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>Connecting Talents</Text>
        </View>
        <Text style={styles.heroTitle}>Le réseau mobile des talents sportifs.</Text>
        <Text style={styles.heroText}>
          Publie tes vidéos, construis ton profil, attire des clubs et échange avec des
          recruteurs depuis une seule application.
        </Text>
        <View style={styles.heroStats}>
          <StatPill label="Rôles" value="3" />
          <StatPill label="Parcours" value="MVP" />
          <StatPill label="Focus" value="Mobile" />
        </View>
        <View style={styles.stack}>
          <PrimaryButton label="Se connecter" onPress={onLogin} variant="secondary" />
          <PrimaryButton label="Créer un compte" onPress={onRegister} />
        </View>
      </View>
    </ScreenFrame>
  );
}

export function AuthChoiceScreen({
  roles,
  selectedRole,
  onSelectRole,
  onContinue,
}: {
  roles: { value: Role; label: string }[];
  selectedRole: Role;
  onSelectRole: (role: Role) => void;
  onContinue: () => void;
}) {
  const roleDescriptions: Record<Role, string> = {
    player: "Publie et valorise tes performances.",
    club: "Repère et contacte les profils adaptés.",
    agent: "Suis les talents et construis ton pipeline.",
  };

  return (
    <ScreenFrame title="Choisissez votre rôle" subtitle="Le parcours s’adapte à votre profil.">
      <View style={styles.stack}>
        {roles.map((role) => (
          <Pressable
            key={role.value}
            onPress={() => onSelectRole(role.value)}
            style={[
              styles.choiceCard,
              selectedRole === role.value ? styles.choiceCardActive : null,
            ]}
          >
            <Text style={styles.choiceTitle}>{role.label}</Text>
            <Text style={styles.choiceText}>{roleDescriptions[role.value]}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.topGap}>
        <PrimaryButton label="Continuer" onPress={onContinue} />
      </View>
    </ScreenFrame>
  );
}

export function CreateProfileScreen({
  selectedRole,
  onBack,
  onFinish,
}: {
  selectedRole: Role;
  onBack: () => void;
  onFinish: () => void;
}) {
  return (
    <ScreenFrame title="Créer votre profil" subtitle={`Rôle sélectionné: ${selectedRole}`}>
      <View style={styles.profileAvatar} />
      <View style={styles.stack}>
        {["Prénom", "Nom", "Âge", "Pays", "Sport", "Poste", "Taille", "Poids"].map((field) => (
          <View key={field} style={styles.formField}>
            <Text style={styles.formLabel}>{field}</Text>
            <TextInput placeholder={field} placeholderTextColor={colors.textMuted} style={styles.input} />
          </View>
        ))}
        <View style={styles.formField}>
          <Text style={styles.formLabel}>Bio courte</Text>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Parle de ton style de jeu, de tes objectifs et de tes points forts."
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.textarea]}
          />
        </View>
      </View>
      <View style={styles.rowGap}>
        <View style={styles.flexButton}>
          <PrimaryButton label="Retour" onPress={onBack} variant="secondary" />
        </View>
        <View style={styles.flexButton}>
          <PrimaryButton label="Terminer" onPress={onFinish} />
        </View>
      </View>
    </ScreenFrame>
  );
}

export function DashboardScreen({
  data,
  onNavigate,
  onOpenClub,
}: {
  data: DashboardData;
  onNavigate: (screen: AppScreen) => void;
  onOpenClub: () => void;
}) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.dashboardHero}>
          <View>
            <Text style={styles.dashboardName}>{data.athleteName}</Text>
            <Text style={styles.dashboardRole}>{data.roleLabel}</Text>
          </View>
          <Pressable onPress={() => onNavigate("messages")} style={styles.outlineChip}>
            <Text style={styles.outlineChipText}>Contact</Text>
          </Pressable>
        </View>

        <View style={styles.metricsCard}>
          <Text style={styles.metricsValue}>{data.views} vues</Text>
          <Text style={styles.metricsText}>Ton profil gagne en traction cette semaine.</Text>
        </View>

        <SectionTitle>Mes vidéos récentes</SectionTitle>
        <View style={styles.videoGrid}>
          {data.recentVideos.map((video) => (
            <View key={video.id} style={[styles.videoCard, { backgroundColor: video.color }]}>
              <Text style={styles.videoCardTitle}>{video.title}</Text>
            </View>
          ))}
        </View>

        <SectionTitle>Clubs intéressés</SectionTitle>
        <View style={styles.stack}>
          {data.interestedClubs.map((club) => (
            <Pressable key={club.id} onPress={onOpenClub} style={styles.listCard}>
              <Text style={styles.listTitle}>{club.name}</Text>
              <Text style={styles.listText}>{club.country}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <TabBar current="dashboard" onNavigate={onNavigate} />
    </View>
  );
}

export function DiscoverScreen({
  players,
  onNavigate,
  onOpenClub,
}: {
  players: DiscoverPlayer[];
  onNavigate: (screen: AppScreen) => void;
  onOpenClub: () => void;
}) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BrandHeader />
        <Text style={styles.screenTitle}>Découverte</Text>
        <TextInput
          placeholder="Recherche"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
        <View style={styles.filterRow}>
          {["Sport", "Pays", "Âge"].map((filter) => (
            <View key={filter} style={styles.filterChip}>
              <Text style={styles.filterChipText}>{filter}</Text>
            </View>
          ))}
        </View>
        <View style={styles.stack}>
          {players.map((player) => (
            <View key={player.id} style={styles.playerCard}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerMeta}>
                    {player.age} ans · {player.country}
                  </Text>
                </View>
                <View style={[styles.playerSilhouette, { backgroundColor: player.accent }]} />
              </View>
              <View style={styles.playerMedia}>
                <Text style={styles.playerMediaText}>
                  {player.sport} · {player.position}
                </Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.playerStats}>
                  ♥ {player.likes} · 👁 {player.views}
                </Text>
                <Pressable onPress={onOpenClub}>
                  <Text style={styles.contactLink}>Contact</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <TabBar current="discover" onNavigate={onNavigate} />
    </View>
  );
}

export function UploadScreen({ onNavigate }: { onNavigate: (screen: AppScreen) => void }) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BrandHeader />
        <Text style={styles.screenTitle}>Upload Video</Text>
        <View style={styles.uploadDropzone}>
          <Text style={styles.uploadIcon}>↑</Text>
          <PrimaryButton label="Select File" onPress={() => undefined} variant="secondary" />
        </View>
        <View style={styles.stack}>
          {["Title", "Description", "Category", "Type"].map((field) => (
            <View key={field} style={styles.formField}>
              <Text style={styles.formLabel}>{field}</Text>
              <TextInput placeholder={field} placeholderTextColor={colors.textMuted} style={styles.input} />
            </View>
          ))}
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressBar} />
        </View>
        <PrimaryButton label="Publish" onPress={() => onNavigate("dashboard")} />
      </ScrollView>
      <TabBar current="upload" onNavigate={onNavigate} />
    </View>
  );
}

export function MessagesScreen({
  threads,
  onNavigate,
}: {
  threads: MessageThread[];
  onNavigate: (screen: AppScreen) => void;
}) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.messagesHeader}>
          <BrandHeader />
        </View>
        <View style={styles.stack}>
          {threads.map((thread) => (
            <View key={thread.id} style={styles.threadRow}>
              <View style={styles.avatarCircle} />
              <View style={styles.threadBody}>
                <Text style={styles.listTitle}>{thread.name}</Text>
                <Text style={styles.listText}>{thread.preview}</Text>
              </View>
              <Text style={styles.threadTime}>{thread.timestamp}</Text>
            </View>
          ))}
        </View>
        <View style={styles.chatBubbleRight}>
          <Text style={styles.chatBubbleTextLight}>Are you available for a call tomorrow?</Text>
        </View>
        <View style={styles.chatBubbleLeft}>
          <Text style={styles.chatBubbleTextDark}>Yes, I'm available</Text>
        </View>
        <View style={styles.chatBubbleRightSmall}>
          <Text style={styles.chatBubbleTextLight}>Great!</Text>
        </View>
        <View style={styles.messageComposer}>
          <Text style={styles.listText}>Message</Text>
        </View>
      </ScrollView>
      <TabBar current="messages" onNavigate={onNavigate} />
    </View>
  );
}

export function NotificationsScreen({
  notifications,
  onNavigate,
}: {
  notifications: AppNotification[];
  onNavigate: (screen: AppScreen) => void;
}) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BrandHeader />
        <Text style={styles.screenTitle}>Notifications</Text>
        <View style={styles.stack}>
          {notifications.map((notification) => (
            <View key={notification.id} style={styles.notificationRow}>
              <View
                style={[
                  styles.notificationIcon,
                  notification.type === "message"
                    ? styles.notificationIconBlue
                    : styles.notificationIconGreen,
                ]}
              />
              <View>
                <Text style={styles.listTitle}>{notification.title}</Text>
                <Text style={styles.listText}>{notification.timeLabel}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <TabBar current="notifications" onNavigate={onNavigate} />
    </View>
  );
}

export function SettingsScreen({
  sections,
  onNavigate,
  onLogout,
}: {
  sections: SettingsSection[];
  onNavigate: (screen: AppScreen) => void;
  onLogout: () => void;
}) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BrandHeader />
        <Text style={styles.screenTitle}>Paramètres</Text>
        <View style={styles.stack}>
          {sections.map((section) => (
            <View key={section.id} style={styles.settingsRow}>
              <Text style={styles.listTitle}>{section.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          ))}
        </View>
        <View style={styles.topGap}>
          <PrimaryButton label="Déconnexion" onPress={onLogout} />
        </View>
        <Pressable onPress={() => onNavigate("notifications")} style={styles.aboutCard}>
          <Text style={styles.listTitle}>À propos</Text>
          <Text style={styles.listText}>Version MVP TalentLink prête pour le branchement API.</Text>
        </Pressable>
      </ScrollView>
      <TabBar current="settings" onNavigate={onNavigate} />
    </View>
  );
}

export function ClubProfileScreen({
  club,
  onBack,
}: {
  club: ClubProfile;
  onBack: () => void;
}) {
  return (
    <ScreenFrame>
      <Pressable onPress={onBack} style={styles.backLink}>
        <Text style={styles.contactLink}>← Retour</Text>
      </Pressable>
      <View style={styles.clubCover} />
      <View style={styles.clubHeader}>
        <View style={styles.clubLogo} />
        <View style={styles.clubHeaderBody}>
          <Text style={styles.screenTitle}>{club.name}</Text>
          <Text style={styles.screenSubtitle}>
            {club.city} · {club.level}
          </Text>
        </View>
      </View>
      <View style={styles.aboutCard}>
        <Text style={styles.listText}>{club.summary}</Text>
      </View>
      <PrimaryButton label="Contacter" onPress={() => undefined} />
      <SectionTitle>Vidéos</SectionTitle>
      <View style={styles.videoGrid}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.clubVideoCard}>
            <Text style={styles.videoCardTitle}>Highlight #{item}</Text>
          </View>
        ))}
      </View>
      <SectionTitle>Points clés</SectionTitle>
      <View style={styles.stack}>
        {club.highlights.map((highlight) => (
          <View key={highlight} style={styles.listCard}>
            <Text style={styles.listText}>{highlight}</Text>
          </View>
        ))}
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: 110,
    gap: spacing.md,
  },
  backgroundOrbTop: {
    position: "absolute",
    top: -120,
    right: -70,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.mint,
    opacity: 0.35,
  },
  backgroundOrbBottom: {
    position: "absolute",
    bottom: -110,
    left: -90,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: colors.sky,
    opacity: 0.4,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  brandMark: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  brandMarkText: {
    color: colors.lime,
    fontSize: 24,
    fontWeight: "800",
  },
  brandText: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "800",
  },
  screenTitle: {
    color: colors.ink,
    fontSize: typography.hero,
    fontWeight: "800",
    lineHeight: 34,
  },
  screenSubtitle: {
    color: colors.textMuted,
    fontSize: typography.subtitle,
    lineHeight: 24,
  },
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.mint,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  heroBadgeText: {
    color: colors.ink,
    fontWeight: "700",
    fontSize: typography.caption,
  },
  heroTitle: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },
  heroText: {
    color: colors.textMuted,
    fontSize: typography.subtitle,
    lineHeight: 26,
  },
  heroStats: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statPill: {
    flex: 1,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  statValue: {
    color: colors.ink,
    fontSize: typography.title,
    fontWeight: "800",
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    marginTop: 2,
  },
  stack: {
    gap: spacing.md,
  },
  button: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: colors.lime,
  },
  buttonSecondary: {
    backgroundColor: colors.ink,
  },
  buttonText: {
    fontSize: typography.subtitle,
    fontWeight: "800",
  },
  buttonTextPrimary: {
    color: colors.ink,
  },
  buttonTextSecondary: {
    color: colors.card,
  },
  choiceCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  choiceCardActive: {
    borderColor: colors.lime,
    backgroundColor: "#F6FCE9",
  },
  choiceTitle: {
    color: colors.ink,
    fontSize: typography.title,
    fontWeight: "800",
  },
  choiceText: {
    color: colors.textMuted,
    lineHeight: 22,
  },
  topGap: {
    marginTop: spacing.lg,
  },
  profileAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#DCE7C6",
    borderWidth: 4,
    borderColor: colors.inkSoft,
    alignSelf: "center",
  },
  formField: {
    gap: spacing.xs,
  },
  formLabel: {
    color: colors.ink,
    fontSize: typography.subtitle,
    fontWeight: "700",
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: typography.subtitle,
  },
  textarea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  rowGap: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  flexButton: {
    flex: 1,
  },
  dashboardHero: {
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    padding: spacing.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dashboardName: {
    color: colors.card,
    fontSize: 26,
    fontWeight: "800",
  },
  dashboardRole: {
    color: "#C7D4EA",
    marginTop: spacing.xs,
    fontSize: typography.subtitle,
  },
  outlineChip: {
    backgroundColor: colors.lime,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  outlineChipText: {
    color: colors.ink,
    fontWeight: "800",
  },
  metricsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  metricsValue: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: "900",
  },
  metricsText: {
    marginTop: spacing.xs,
    color: colors.textMuted,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "800",
    marginTop: spacing.md,
  },
  videoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  videoCard: {
    width: "47%",
    minHeight: 148,
    borderRadius: radius.lg,
    padding: spacing.md,
    justifyContent: "flex-end",
  },
  clubVideoCard: {
    width: "30%",
    aspectRatio: 0.9,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: "flex-end",
    padding: spacing.sm,
  },
  videoCardTitle: {
    color: colors.ink,
    fontWeight: "800",
  },
  listCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  listTitle: {
    color: colors.ink,
    fontSize: typography.title,
    fontWeight: "700",
  },
  listText: {
    color: colors.textMuted,
    fontSize: typography.subtitle,
    lineHeight: 22,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderColor: colors.inkSoft,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: typography.subtitle,
    marginTop: spacing.sm,
  },
  filterRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  filterChip: {
    borderColor: colors.inkSoft,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
  },
  filterChipText: {
    color: colors.ink,
    fontWeight: "700",
  },
  playerCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  playerName: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "800",
  },
  playerMeta: {
    color: colors.textMuted,
    fontSize: typography.subtitle,
  },
  playerSilhouette: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  playerMedia: {
    minHeight: 180,
    borderRadius: radius.lg,
    backgroundColor: "#EFF5F0",
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  playerMediaText: {
    color: colors.ink,
    fontWeight: "800",
    fontSize: typography.title,
  },
  playerStats: {
    color: colors.inkSoft,
    fontWeight: "700",
  },
  contactLink: {
    color: colors.ink,
    fontWeight: "800",
    fontSize: typography.subtitle,
  },
  uploadDropzone: {
    minHeight: 220,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  uploadIcon: {
    fontSize: 48,
    color: colors.inkSoft,
  },
  progressTrack: {
    height: 10,
    backgroundColor: "#D7DDE6",
    borderRadius: radius.pill,
    overflow: "hidden",
    marginVertical: spacing.md,
  },
  progressBar: {
    width: "72%",
    height: "100%",
    backgroundColor: colors.lime,
  },
  messagesHeader: {
    backgroundColor: "#B7BECA",
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginTop: -spacing.xl,
    marginBottom: spacing.md,
  },
  threadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D9DDE4",
    borderWidth: 2,
    borderColor: "#9AA5B3",
  },
  threadBody: {
    flex: 1,
  },
  threadTime: {
    color: colors.textMuted,
    fontSize: typography.subtitle,
  },
  chatBubbleRight: {
    alignSelf: "flex-end",
    backgroundColor: colors.inkSoft,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    maxWidth: "78%",
    marginTop: spacing.lg,
  },
  chatBubbleRightSmall: {
    alignSelf: "flex-end",
    backgroundColor: colors.inkSoft,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    maxWidth: "40%",
    marginTop: spacing.md,
  },
  chatBubbleLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#81DD8A",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    maxWidth: "60%",
    marginTop: spacing.md,
  },
  chatBubbleTextLight: {
    color: colors.card,
    fontSize: typography.subtitle,
  },
  chatBubbleTextDark: {
    color: colors.card,
    fontSize: typography.subtitle,
  },
  messageComposer: {
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.xl,
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  notificationIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  notificationIconGreen: {
    backgroundColor: "#C8EDC8",
  },
  notificationIconBlue: {
    backgroundColor: "#D8E4FA",
  },
  settingsRow: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 30,
    lineHeight: 30,
  },
  aboutCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  backLink: {
    alignSelf: "flex-start",
  },
  clubCover: {
    height: 190,
    borderRadius: radius.lg,
    backgroundColor: "#E3E7EE",
    borderWidth: 1,
    borderColor: colors.line,
  },
  clubHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  clubLogo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.card,
    borderColor: colors.inkSoft,
    borderWidth: 2,
  },
  clubHeaderBody: {
    flex: 1,
  },
  tabBar: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  tabLabel: {
    color: "#B7C4D8",
    fontSize: 11,
    fontWeight: "700",
  },
  tabLabelActive: {
    color: colors.lime,
  },
});
