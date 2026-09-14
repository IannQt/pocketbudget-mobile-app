import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import { getAccountType, COLORS } from "../utils/constants";
import { formatCurrency } from "../utils/format";
import AddAccountModal from "../components/AddAccountModal";

export default function AccountsScreen() {
  const { accounts, accountBalances, netWorth, deleteAccount } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  function confirmDelete(account) {
    Alert.alert(
      `Remove ${account.name}?`,
      "This also deletes every transaction linked to this account.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => deleteAccount(account.id) },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Accounts</Text>
            <Text style={styles.subtitle}>Track every wallet, bank, and card in one place.</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalOpen(true)}>
            <Ionicons name="add" size={20} color={COLORS.surface} />
          </TouchableOpacity>
        </View>

        {accounts.length > 0 && (
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Overview</Text>
            <Text style={styles.overviewValue}>{formatCurrency(netWorth)}</Text>
            <Text style={styles.overviewMeta}>{accounts.length} account{accounts.length > 1 ? "s" : ""} tracked</Text>
          </View>
        )}

        {accounts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Add your first account — cash, a bank account, or a card — to start tracking.
            </Text>
            <Text style={styles.emptySubtext}>
              Start with your main wallet, savings account, or e-wallet, then add transactions from the Home tab.
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setModalOpen(true)}>
              <Text style={styles.primaryBtnText}>Add account</Text>
            </TouchableOpacity>
          </View>
        ) : (
          accounts.map((a) => {
            const type = getAccountType(a.type);
            const balance = accountBalances[a.id] || 0;
            return (
              <TouchableOpacity
                key={a.id}
                style={styles.accountCard}
                onLongPress={() => confirmDelete(a)}
              >
                <View style={[styles.iconWrap, { backgroundColor: a.color || type.color }]}>
                  <Ionicons name={type.icon} size={18} color={COLORS.surface} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.accountName}>{a.name}</Text>
                  <Text style={styles.accountType}>{type.label}</Text>
                </View>
                <Text style={[styles.balance, balance < 0 && styles.balanceNegative]}>
                  {formatCurrency(balance)}
                </Text>
              </TouchableOpacity>
            );
          })
        )}

        {accounts.length > 0 && (
          <Text style={styles.hint}>Long-press an account to remove it.</Text>
        )}
      </ScrollView>

      {modalOpen && <AddAccountModal onClose={() => setModalOpen(false)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { fontSize: 22, fontWeight: "700", color: COLORS.ink },
  subtitle: { color: COLORS.inkSoft, marginTop: 2, fontSize: 13 },
  overviewCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  overviewLabel: { color: COLORS.inkSoft, fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  overviewValue: { color: COLORS.ink, fontSize: 24, fontWeight: "700", marginTop: 4 },
  overviewMeta: { color: COLORS.inkSoft, fontSize: 12, marginTop: 4 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.ink,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  emptyState: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
  emptyText: { color: COLORS.inkSoft, fontSize: 13, textAlign: "center", marginBottom: 10 },
  emptySubtext: { color: COLORS.inkSoft, fontSize: 12, textAlign: "center", lineHeight: 18, marginBottom: 16 },
  primaryBtn: { backgroundColor: COLORS.ink, borderRadius: 10, paddingVertical: 11, paddingHorizontal: 20 },
  primaryBtnText: { color: COLORS.surface, fontWeight: "700" },
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  iconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", marginRight: 12 },
  accountName: { color: COLORS.ink, fontWeight: "700", fontSize: 15 },
  accountType: { color: COLORS.inkSoft, fontSize: 12, marginTop: 2 },
  balance: { color: COLORS.ink, fontWeight: "700", fontSize: 15 },
  balanceNegative: { color: COLORS.rose },
  hint: { color: COLORS.inkSoft, fontSize: 12, textAlign: "center", marginTop: 8 },
});
