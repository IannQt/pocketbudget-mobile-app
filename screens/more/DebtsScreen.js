import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../../context/AppContext";
import { COLORS } from "../../utils/constants";
import { formatCurrency, formatDate } from "../../utils/format";
import AddDebtModal from "../../components/AddDebtModal";

export default function DebtsScreen({ navigation }) {
  const { debts, toggleDebtSettled, deleteDebt } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const owedToMe = debts.filter((d) => d.direction === "owed" && !d.settled);
  const iOwe = debts.filter((d) => d.direction === "owe" && !d.settled);
  const settled = debts.filter((d) => d.settled);

  const netOwedToMe = owedToMe.reduce((s, d) => s + d.amount, 0);
  const netIOwe = iOwe.reduce((s, d) => s + d.amount, 0);

  function confirmDelete(debt) {
    Alert.alert(`Remove this debt?`, `${debt.personName} · ${formatCurrency(debt.amount)}`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => deleteDebt(debt.id) },
    ]);
  }

  function renderRow(d) {
    return (
      <TouchableOpacity key={d.id} style={styles.row} onPress={() => toggleDebtSettled(d.id)} onLongPress={() => confirmDelete(d)}>
        <View style={styles.checkbox}>
          {d.settled && <Ionicons name="checkmark" size={14} color={COLORS.surface} />}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.personName, d.settled && styles.settledText]}>{d.personName}</Text>
          {d.note ? <Text style={styles.note}>{d.note}</Text> : null}
          {d.dueDate ? <Text style={styles.note}>Due {formatDate(d.dueDate)}</Text> : null}
        </View>
        <Text
          style={[
            styles.amount,
            d.direction === "owed" ? styles.amountGreen : styles.amountRose,
            d.settled && styles.settledText,
          ]}
        >
          {formatCurrency(d.amount)}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ More</Text>
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Debts</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalOpen(true)}>
            <Ionicons name="add" size={20} color={COLORS.surface} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Owed to me</Text>
            <Text style={[styles.summaryAmount, { color: COLORS.green }]}>{formatCurrency(netOwedToMe)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>I owe</Text>
            <Text style={[styles.summaryAmount, { color: COLORS.rose }]}>{formatCurrency(netIOwe)}</Text>
          </View>
        </View>

        <View style={styles.helperCard}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.ink} style={{ marginRight: 8 }} />
          <Text style={styles.helperText}>Tap a debt to mark it settled. Long-press to remove it.</Text>
        </View>

        {debts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No debts tracked yet.</Text>
            <Text style={styles.emptySubtext}>Add a debt, repayment, or money someone owes you.</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setModalOpen(true)}>
              <Text style={styles.primaryBtnText}>Add debt</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {owedToMe.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Owed to me</Text>
                <View style={styles.card}>{owedToMe.map(renderRow)}</View>
              </>
            )}
            {iOwe.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>I owe</Text>
                <View style={styles.card}>{iOwe.map(renderRow)}</View>
              </>
            )}
            {settled.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Settled</Text>
                <View style={styles.card}>{settled.map(renderRow)}</View>
              </>
            )}
          </>
        )}
        <Text style={styles.hint}>Tap to mark settled · Long-press to remove.</Text>
      </ScrollView>

      {modalOpen && <AddDebtModal onClose={() => setModalOpen(false)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
  header: { paddingHorizontal: 20, paddingTop: 8 },
  backBtn: { marginBottom: 8 },
  backText: { color: COLORS.gold, fontSize: 14, fontWeight: "600" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  title: { fontSize: 22, fontWeight: "700", color: COLORS.ink },
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.ink, alignItems: "center", justifyContent: "center" },
  content: { padding: 20, paddingTop: 4, paddingBottom: 40 },
  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  summaryCard: { flex: 1, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 14, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  summaryLabel: { color: COLORS.inkSoft, fontSize: 12, marginBottom: 4 },
  summaryAmount: { fontSize: 18, fontWeight: "700" },
  helperCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  helperText: { color: COLORS.inkSoft, fontSize: 12, fontWeight: "600", flex: 1 },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: COLORS.ink, marginBottom: 8 },
  card: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 12, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: COLORS.paper,
  },
  personName: { color: COLORS.ink, fontWeight: "700", fontSize: 14 },
  note: { color: COLORS.inkSoft, fontSize: 12, marginTop: 2 },
  amount: { fontWeight: "700", fontSize: 14 },
  amountGreen: { color: COLORS.green },
  amountRose: { color: COLORS.rose },
  settledText: { color: COLORS.inkSoft, textDecorationLine: "line-through" },
  emptyText: { color: COLORS.inkSoft, fontSize: 14, fontWeight: "700", marginBottom: 6 },
  emptySubtext: { color: COLORS.inkSoft, fontSize: 12, textAlign: "center", lineHeight: 18, marginBottom: 16 },
  primaryBtn: { backgroundColor: COLORS.ink, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20 },
  primaryBtnText: { color: COLORS.surface, fontWeight: "700" },
  hint: { color: COLORS.inkSoft, fontSize: 12, textAlign: "center" },
});
