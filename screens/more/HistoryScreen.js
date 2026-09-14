import { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../../context/AppContext";
import { COLORS } from "../../utils/constants";
import { formatCurrency } from "../../utils/format";
import TransactionItem from "../../components/TransactionItem";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "income", label: "Income" },
  { id: "expense", label: "Expense" },
];

export default function HistoryScreen({ navigation }) {
  const { transactions, accounts, deleteTransaction } = useApp();
  const [filter, setFilter] = useState("all");
  const accountsById = Object.fromEntries(accounts.map((a) => [a.id, a]));

  const filtered = useMemo(
    () => (filter === "all" ? transactions : transactions.filter((t) => t.type === filter)),
    [transactions, filter]
  );

  const filteredIncome = filtered.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const filteredExpense = filtered.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const netMovement = filteredIncome - filteredExpense;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ More</Text>
        </TouchableOpacity>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>Review recent activity and compare income vs expenses at a glance.</Text>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.filterChip, filter === f.id && styles.filterChipActive]}
            onPress={() => setFilter(f.id)}
          >
            <Text style={[styles.filterText, filter === f.id && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.helperCard}>
        <Text style={styles.helperText}>Use the filters to review income, expenses, or everything in one place.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filtered.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Overview</Text>
            <Text style={styles.summaryValue}>{filtered.length} item{filtered.length > 1 ? "s" : ""}</Text>
            <Text style={styles.summaryMeta}>
              Income {formatCurrency(filteredIncome)} • Expenses {formatCurrency(filteredExpense)} • Net {formatCurrency(netMovement)}
            </Text>
          </View>
        )}
        {filtered.length === 0 ? (
          <Text style={styles.emptyText}>No transactions here yet.</Text>
        ) : (
          <View style={styles.card}>
            {filtered.map((t) => (
              <TransactionItem
                key={t.id}
                transaction={t}
                accountsById={accountsById}
                onDelete={deleteTransaction}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
  header: { paddingHorizontal: 20, paddingTop: 8 },
  backBtn: { marginBottom: 8 },
  backText: { color: COLORS.gold, fontSize: 14, fontWeight: "600" },
  title: { fontSize: 22, fontWeight: "700", color: COLORS.ink, marginBottom: 4 },
  subtitle: { color: COLORS.inkSoft, fontSize: 13, marginBottom: 14 },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  summaryLabel: { color: COLORS.inkSoft, fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  summaryValue: { color: COLORS.ink, fontSize: 24, fontWeight: "700", marginTop: 4 },
  summaryMeta: { color: COLORS.inkSoft, fontSize: 12, marginTop: 4 },
  filterRow: { flexDirection: "row", gap: 8, paddingHorizontal: 20, marginBottom: 12 },
  helperCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  helperText: { color: COLORS.inkSoft, fontSize: 12, fontWeight: "600" },
  filterChip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: COLORS.surface,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  filterChipActive: { backgroundColor: COLORS.ink, borderColor: COLORS.ink },
  filterText: { color: COLORS.inkSoft, fontSize: 13, fontWeight: "600" },
  filterTextActive: { color: COLORS.surface },
  content: { padding: 20, paddingTop: 4, paddingBottom: 40 },
  card: { backgroundColor: COLORS.surface, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 16, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  emptyText: { color: COLORS.inkSoft, fontSize: 13 },
});
