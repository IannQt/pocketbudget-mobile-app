import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../../context/AppContext";
import { getCategoryFor, FREQUENCIES, COLORS } from "../../utils/constants";
import { formatCurrency, formatDate } from "../../utils/format";
import AddRecurringModal from "../../components/AddRecurringModal";

export default function RecurringScreen({ navigation }) {
  const { recurring, deleteRecurring, markRecurringPaid } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const totalRecurringAmount = recurring.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const dueSoonCount = recurring.filter((r) => r.nextDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)).length;

  function confirmDelete(item) {
    Alert.alert(`Remove "${item.name}"?`, "This won't delete transactions already logged from it.", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => deleteRecurring(item.id) },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ More</Text>
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Recurring bills</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalOpen(true)}>
            <Ionicons name="add" size={20} color={COLORS.surface} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {recurring.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Overview</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalRecurringAmount)}</Text>
            <Text style={styles.summaryMeta}>
              {recurring.length} recurring item{recurring.length > 1 ? "s" : ""} • {dueSoonCount} due soon
            </Text>
          </View>
        )}

        {recurring.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No recurring bills yet.</Text>
            <Text style={styles.emptySubtext}>
              Add subscriptions, rent, or regular payments to keep track of what repeats each week or month.
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setModalOpen(true)}>
              <Text style={styles.primaryBtnText}>Add recurring bill</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            {recurring.map((r) => {
              const category = getCategoryFor(r.type, r.categoryId);
              const freq = FREQUENCIES.find((f) => f.id === r.frequency);
              return (
                <View key={r.id} style={styles.row}>
                  <View style={[styles.iconWrap, { backgroundColor: category.color }]}>
                    <Ionicons name={category.icon} size={16} color={COLORS.surface} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{r.name}</Text>
                    <Text style={styles.meta}>
                      {freq?.label} · next {formatDate(r.nextDate)}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={[styles.amount, r.type === "income" ? styles.amountGreen : styles.amountRose]}>
                      {r.type === "income" ? "+" : "-"}
                      {formatCurrency(r.amount)}
                    </Text>
                    <View style={styles.rowActions}>
                      <TouchableOpacity onPress={() => markRecurringPaid(r.id)}>
                        <Text style={styles.actionText}>Mark paid</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => confirmDelete(r)}>
                        <Ionicons name="close" size={16} color={COLORS.inkSoft} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {modalOpen && <AddRecurringModal onClose={() => setModalOpen(false)} />}
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
  content: { padding: 20, paddingTop: 4, paddingBottom: 40 },
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
  emptyText: { color: COLORS.inkSoft, fontSize: 14, fontWeight: "700", marginBottom: 6 },
  emptySubtext: { color: COLORS.inkSoft, fontSize: 12, textAlign: "center", lineHeight: 18, marginBottom: 16 },
  primaryBtn: { backgroundColor: COLORS.ink, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20 },
  primaryBtnText: { color: COLORS.surface, fontWeight: "700" },
  card: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 12, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 10 },
  iconWrap: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  name: { color: COLORS.ink, fontWeight: "700", fontSize: 14 },
  meta: { color: COLORS.inkSoft, fontSize: 12, marginTop: 2 },
  amount: { fontWeight: "700", fontSize: 14 },
  amountGreen: { color: COLORS.green },
  amountRose: { color: COLORS.ink },
  rowActions: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 },
  actionText: { color: COLORS.gold, fontSize: 11, fontWeight: "700" },
});
