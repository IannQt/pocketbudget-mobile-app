import { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../../context/AppContext";
import { EXPENSE_CATEGORIES, COLORS } from "../../utils/constants";
import { formatCurrency } from "../../utils/format";

export default function BudgetsScreen({ navigation }) {
  const { budgets, setBudget, expenseTotalsByCategory } = useApp();
  const [drafts, setDrafts] = useState({});

  const totalBudgetLimit = Object.values(budgets).reduce((sum, value) => sum + (Number(value) || 0), 0);
  const categoriesWithLimits = Object.values(budgets).filter((value) => Number(value) > 0).length;

  function valueFor(categoryId) {
    if (drafts[categoryId] !== undefined) return drafts[categoryId];
    return budgets[categoryId] ? String(budgets[categoryId]) : "";
  }

  function handleChange(categoryId, text) {
    setDrafts((prev) => ({ ...prev, [categoryId]: text }));
  }

  async function handleSave(categoryId) {
    const raw = valueFor(categoryId);
    await setBudget(categoryId, parseFloat(raw) || 0);
    Keyboard.dismiss();
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ More</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Monthly budgets</Text>
        <Text style={styles.subtitle}>
          Set a spending limit per category. Home shows a warning once you go over.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Budget overview</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalBudgetLimit)}</Text>
          <Text style={styles.summaryMeta}>
            {categoriesWithLimits} category{categoriesWithLimits === 1 ? "" : "ies"} currently limited
          </Text>
        </View>

        {EXPENSE_CATEGORIES.map((c) => {
          const spent = expenseTotalsByCategory[c.id] || 0;
          const limit = budgets[c.id] || 0;
          const isOver = limit > 0 && spent > limit;
          return (
            <View key={c.id} style={styles.row}>
              <View style={[styles.iconWrap, { backgroundColor: c.color }]}>
                <Ionicons name={c.icon} size={16} color={COLORS.surface} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{c.label}</Text>
                {limit > 0 && (
                  <Text style={[styles.spentText, isOver && styles.spentTextOver]}>
                    spent {formatCurrency(spent)}
                  </Text>
                )}
              </View>
              <View style={styles.inputWrap}>
                <Text style={styles.dollar}>₱</Text>
                <TextInput
                  value={valueFor(c.id)}
                  onChangeText={(t) => handleChange(c.id, t)}
                  onBlur={() => handleSave(c.id)}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={COLORS.inkSoft}
                  style={styles.input}
                />
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => EXPENSE_CATEGORIES.forEach((c) => handleSave(c.id))}
        >
          <Text style={styles.doneBtnText}>Save all</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
  header: { paddingHorizontal: 20, paddingTop: 8 },
  backBtn: { marginBottom: 8 },
  backText: { color: COLORS.gold, fontSize: 14, fontWeight: "600" },
  title: { fontSize: 22, fontWeight: "700", color: COLORS.ink, marginBottom: 6 },
  subtitle: { fontSize: 13, color: COLORS.inkSoft, marginBottom: 16, lineHeight: 18 },
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  iconWrap: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", marginRight: 12 },
  label: { color: COLORS.ink, fontWeight: "600", fontSize: 14 },
  spentText: { color: COLORS.inkSoft, fontSize: 11, marginTop: 2 },
  spentTextOver: { color: COLORS.rose },
  inputWrap: { flexDirection: "row", alignItems: "center" },
  dollar: { color: COLORS.inkSoft, fontSize: 15, marginRight: 2 },
  input: { width: 70, textAlign: "right", fontSize: 15, color: COLORS.ink, paddingVertical: 4 },
  doneBtn: { backgroundColor: COLORS.ink, borderRadius: 12, paddingVertical: 16, alignItems: "center", marginTop: 12, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  doneBtnText: { color: COLORS.surface, fontSize: 15, fontWeight: "700" },
});
