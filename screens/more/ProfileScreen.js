import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { COLORS } from "../../utils/constants";

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const { accounts, transactions } = useApp();

  function confirmSignOut() {
    Alert.alert("Sign out?", "You can sign back in with Google any time.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: signOut },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ More</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profileCard}>
          {user?.photo ? (
            <Image source={{ uri: user.photo }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Ionicons name="person" size={28} color={COLORS.surface} />
            </View>
          )}
          <Text style={styles.name}>{user?.name || "Signed in"}</Text>
          {user?.email ? <Text style={styles.email}>{user.email}</Text> : null}
          <View style={styles.methodBadge}>
            <Ionicons
              name={user?.method === "google" ? "logo-google" : "lock-closed-outline"}
              size={12}
              color={COLORS.inkSoft}
              style={{ marginRight: 5 }}
            />
            <Text style={styles.methodText}>
              {user?.method === "google" ? "Signed in with Google" : "Local account"}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{accounts.length}</Text>
            <Text style={styles.statLabel}>Accounts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{transactions.length}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Your data stays on this device</Text>
          <Text style={styles.infoText}>PocketBudget saves your budget information locally so you can manage it easily and privately.</Text>
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={confirmSignOut}>
          <Ionicons name="log-out-outline" size={18} color={COLORS.rose} style={{ marginRight: 8 }} />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>

        <Text style={styles.footnote}>
          Signing out only ends your session — your budget data stays saved on this device.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
  header: { paddingHorizontal: 20, paddingTop: 8 },
  backBtn: { marginBottom: 8 },
  backText: { color: COLORS.gold, fontSize: 14, fontWeight: "600" },
  title: { fontSize: 22, fontWeight: "700", color: COLORS.ink, marginBottom: 20 },
  content: { padding: 20, paddingTop: 4 },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  avatar: { width: 72, height: 72, borderRadius: 36, marginBottom: 14 },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.ink,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  name: { fontSize: 18, fontWeight: "700", color: COLORS.ink },
  email: { fontSize: 13, color: COLORS.inkSoft, marginTop: 4 },
  methodBadge: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  methodText: { fontSize: 11, color: COLORS.inkSoft },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  statValue: { fontSize: 20, fontWeight: "700", color: COLORS.ink },
  statLabel: { fontSize: 12, color: COLORS.inkSoft, marginTop: 2 },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  infoTitle: { color: COLORS.ink, fontSize: 13, fontWeight: "700", marginBottom: 4 },
  infoText: { color: COLORS.inkSoft, fontSize: 12, lineHeight: 18 },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.rose,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 12,
    backgroundColor: COLORS.surface,
  },
  signOutText: { color: COLORS.rose, fontWeight: "700", fontSize: 14 },
  footnote: { color: COLORS.inkSoft, fontSize: 12, textAlign: "center", lineHeight: 17 },
});
