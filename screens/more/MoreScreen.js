import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../utils/constants";
import { formatCurrency } from "../../utils/format";
import { exportTransactionsCsv } from "../../utils/csv";
import { exportPdfReport } from "../../utils/pdf";

const ROWS = [
  { key: "History", label: "Transaction history", icon: "time-outline", desc: "Every transaction, filterable" },
  { key: "Budgets", label: "Monthly budgets", icon: "pie-chart-outline", desc: "Spending limits per category" },
  { key: "Debts", label: "Debts", icon: "people-outline", desc: "Money you owe or are owed" },
  { key: "Recurring", label: "Recurring bills", icon: "repeat-outline", desc: "Subscriptions & regular payments" },
];

export default function MoreScreen({ navigation }) {
  const { transactions, accounts, netWorth } = useApp();
  const { user } = useAuth();

  async function handleExportCsv() {
    if (transactions.length === 0) {
      Alert.alert("Nothing to export yet", "Add a transaction first.");
      return;
    }
    try {
      await exportTransactionsCsv(transactions, accounts);
    } catch {
      Alert.alert("Couldn't export", "Something went wrong while sharing the file.");
    }
  }

  async function handleExportPdf() {
    if (transactions.length === 0) {
      Alert.alert("Nothing to export yet", "Add a transaction first.");
      return;
    }
    try {
      await exportPdfReport({ transactions, accounts, netWorth });
    } catch {
      Alert.alert("Couldn't create report", "Something went wrong while generating the PDF.");
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>More</Text>
        <Text style={styles.subtitle}>Manage your account, exports, and deeper budget tools.</Text>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroLabel}>Quick overview</Text>
              <Text style={styles.heroValue}>{formatCurrency(netWorth)}</Text>
            </View>
            <View style={styles.localBadge}>
              <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.green} />
              <Text style={styles.localBadgeText}>Local</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{transactions.length}</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{accounts.length}</Text>
              <Text style={styles.statLabel}>Accounts</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionDot} />
          <Text style={styles.sectionTitle}>Account</Text>
        </View>
        <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate("Profile")}>
          {user?.photo ? (
            <Image source={{ uri: user.photo }} style={styles.avatar} />
          ) : (
            <View style={styles.iconWrap}>
              <Ionicons name="person-outline" size={18} color={COLORS.ink} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>{user?.name || "Profile"}</Text>
            <Text style={styles.rowDesc}>{user?.email || "View profile & sign out"}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.inkSoft} />
        </TouchableOpacity>

        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionDot} />
          <Text style={styles.sectionTitle}>Tools</Text>
        </View>
        {ROWS.map((r) => (
          <TouchableOpacity key={r.key} style={styles.row} onPress={() => navigation.navigate(r.key)}>
            <View style={styles.iconWrap}>
              <Ionicons name={r.icon} size={18} color={COLORS.ink} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>{r.label}</Text>
              <Text style={styles.rowDesc}>{r.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.inkSoft} />
          </TouchableOpacity>
        ))}

        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionDot} />
          <Text style={styles.sectionTitle}>Exports</Text>
        </View>
        <TouchableOpacity style={styles.row} onPress={handleExportPdf}>
          <View style={styles.iconWrap}>
            <Ionicons name="document-text-outline" size={18} color={COLORS.ink} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>Export PDF report</Text>
            <Text style={styles.rowDesc}>A designed summary report, ready to share or print</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.inkSoft} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={handleExportCsv}>
          <View style={styles.iconWrap}>
            <Ionicons name="download-outline" size={18} color={COLORS.ink} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>Export CSV data</Text>
            <Text style={styles.rowDesc}>Raw data file for spreadsheets</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.inkSoft} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "800", color: COLORS.ink, marginBottom: 2 },
  subtitle: { color: COLORS.inkSoft, fontSize: 13, marginBottom: 16, lineHeight: 18 },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopWidth: 3,
    borderTopColor: COLORS.gold,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  heroLabel: { color: COLORS.gold, fontSize: 12, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.6 },
  heroValue: { color: COLORS.ink, fontSize: 28, fontWeight: "800", marginTop: 4 },
  localBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.green,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  localBadgeText: { color: COLORS.green, fontSize: 11, fontWeight: "700", marginLeft: 4 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statValue: { color: COLORS.ink, fontSize: 18, fontWeight: "800" },
  statLabel: { color: COLORS.inkSoft, fontSize: 11, marginTop: 4 },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 8,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gold,
    marginRight: 8,
  },
  sectionTitle: {
    color: COLORS.ink,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.paper,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowLabel: { color: COLORS.ink, fontWeight: "700", fontSize: 14 },
  rowDesc: { color: COLORS.inkSoft, fontSize: 12, marginTop: 2, lineHeight: 16 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 12 },
});
