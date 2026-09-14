import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import { COLORS } from "../utils/constants";
import { formatCurrency } from "../utils/format";
import ProgressBar from "../components/ProgressBar";
import AddGoalModal from "../components/AddGoalModal";
import ContributeModal from "../components/ContributeModal";

export default function GoalsScreen() {
  const { goals, deleteGoal } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [contributeGoal, setContributeGoal] = useState(null);

  const totalSaved = goals.reduce((sum, goal) => sum + (Number(goal.savedAmount) || 0), 0);
  const totalTarget = goals.reduce((sum, goal) => sum + (Number(goal.targetAmount) || 0), 0);

  function confirmDelete(goal) {
    Alert.alert(`Remove "${goal.name}"?`, "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => deleteGoal(goal.id) },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Savings goals</Text>
            <Text style={styles.subtitle}>Track your target savings and celebrate progress as you go.</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setAddOpen(true)}>
            <Ionicons name="add" size={20} color={COLORS.surface} />
          </TouchableOpacity>
        </View>

        {goals.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Goal progress</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalSaved)}</Text>
            <Text style={styles.summaryMeta}>Saved toward {formatCurrency(totalTarget)}</Text>
          </View>
        )}

        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Set a target — a trip, an emergency fund, anything — and track your progress.
            </Text>
            <Text style={styles.emptySubtext}>
              Create a goal, then add money whenever you save toward it.
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setAddOpen(true)}>
              <Text style={styles.primaryBtnText}>Add a goal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          goals.map((g) => (
            <View key={g.id} style={styles.card}>
              <ProgressBar
                label={g.name}
                current={g.savedAmount}
                target={g.targetAmount}
                color={g.color}
                overIsBad={false}
              />
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.smallBtn} onPress={() => setContributeGoal(g)}>
                  <Text style={styles.smallBtnText}>Add money</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallGhostBtn} onPress={() => confirmDelete(g)}>
                  <Text style={styles.smallGhostBtnText}>Remove</Text>
                </TouchableOpacity>
              </View>
              {g.savedAmount >= g.targetAmount && g.targetAmount > 0 && (
                <Text style={styles.reachedText}>🎉 Goal reached!</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {addOpen && <AddGoalModal onClose={() => setAddOpen(false)} />}
      {contributeGoal && (
        <ContributeModal goal={contributeGoal} onClose={() => setContributeGoal(null)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  title: { fontSize: 22, fontWeight: "700", color: COLORS.ink },
  subtitle: { color: COLORS.inkSoft, marginTop: 2, fontSize: 13 },
  summaryCard: {
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
  summaryLabel: { color: COLORS.inkSoft, fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  summaryValue: { color: COLORS.ink, fontSize: 24, fontWeight: "700", marginTop: 4 },
  summaryMeta: { color: COLORS.inkSoft, fontSize: 12, marginTop: 4 },
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
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  cardActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  smallBtn: { backgroundColor: COLORS.ink, borderRadius: 6, paddingVertical: 8, paddingHorizontal: 14 },
  smallBtnText: { color: COLORS.surface, fontSize: 12, fontWeight: "700" },
  smallGhostBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, paddingVertical: 8, paddingHorizontal: 14 },
  smallGhostBtnText: { color: COLORS.inkSoft, fontSize: 12, fontWeight: "600" },
  reachedText: { marginTop: 10, color: COLORS.green, fontWeight: "700", fontSize: 13 },
});
