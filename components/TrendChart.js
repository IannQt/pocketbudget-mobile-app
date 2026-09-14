import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../utils/constants";
import { lastNMonthKeys, shortMonthLabel, monthKey } from "../utils/format";

const CHART_HEIGHT = 100;

export default function TrendChart({ transactions, months = 6 }) {
  const keys = lastNMonthKeys(months);

  const data = keys.map((key) => {
    const inMonth = transactions.filter((t) => monthKey(t.date) === key);
    const income = inMonth.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = inMonth.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { key, income, expense };
  });

  const max = Math.max(1, ...data.map((d) => Math.max(d.income, d.expense)));

  return (
    <View>
      <View style={styles.chartRow}>
        {data.map((d) => (
          <View key={d.key} style={styles.col}>
            <View style={styles.barsWrap}>
              <View
                style={[
                  styles.bar,
                  { height: (d.income / max) * CHART_HEIGHT, backgroundColor: COLORS.green },
                ]}
              />
              <View
                style={[
                  styles.bar,
                  { height: (d.expense / max) * CHART_HEIGHT, backgroundColor: COLORS.rose },
                ]}
              />
            </View>
            <Text style={styles.monthLabel}>{shortMonthLabel(d.key)}</Text>
          </View>
        ))}
      </View>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: COLORS.green }]} />
          <Text style={styles.legendText}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: COLORS.rose }]} />
          <Text style={styles.legendText}>Expense</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: CHART_HEIGHT + 24,
  },
  col: { alignItems: "center", flex: 1 },
  barsWrap: { flexDirection: "row", alignItems: "flex-end", gap: 3, height: CHART_HEIGHT },
  bar: { width: 8, borderRadius: 3, minHeight: 2 },
  monthLabel: { color: COLORS.inkSoft, fontSize: 11, marginTop: 6 },
  legendRow: { flexDirection: "row", gap: 16, marginTop: 10, justifyContent: "center" },
  legendItem: { flexDirection: "row", alignItems: "center" },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { color: COLORS.inkSoft, fontSize: 12 },
});
