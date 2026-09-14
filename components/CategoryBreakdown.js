import { View, Text, StyleSheet } from "react-native";
import { getExpenseCategory, COLORS } from "../utils/constants";
import { formatCurrency } from "../utils/format";

export default function CategoryBreakdown({ totalsByCategory }) {
  const entries = Object.entries(totalsByCategory)
    .filter(([, amount]) => amount > 0)
    .map(([id, amount]) => ({ ...getExpenseCategory(id), amount }))
    .sort((a, b) => b.amount - a.amount);

  const total = entries.reduce((sum, e) => sum + e.amount, 0);

  if (entries.length === 0) {
    return <Text style={styles.emptyText}>No expenses logged yet this month.</Text>;
  }

  return (
    <View>
      <View style={styles.bar}>
        {entries.map((e) => (
          <View
            key={e.id}
            style={{ flex: e.amount, backgroundColor: e.color, height: "100%" }}
          />
        ))}
      </View>
      <View style={styles.legend}>
        {entries.map((e) => (
          <View key={e.id} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: e.color }]} />
            <Text style={styles.legendLabel}>{e.label}</Text>
            <Text style={styles.legendAmount}>
              {formatCurrency(e.amount)} · {Math.round((e.amount / total) * 100)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: COLORS.border,
    marginBottom: 14,
  },
  legend: { gap: 8 },
  legendRow: { flexDirection: "row", alignItems: "center" },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  legendLabel: { flex: 1, color: COLORS.ink, fontSize: 13, fontWeight: "600" },
  legendAmount: { color: COLORS.inkSoft, fontSize: 12 },
  emptyText: { color: COLORS.inkSoft, fontSize: 13 },
});
