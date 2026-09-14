import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../utils/constants";
import { formatCurrency } from "../utils/format";

export default function ProgressBar({ label, current, target, color, overIsBad = true }) {
  const hasTarget = target > 0;
  const pct = hasTarget ? Math.min(current / target, 1) : 0;
  const isOver = hasTarget && overIsBad && current > target;

  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.amount, isOver && styles.amountOver]}>
          {formatCurrency(current)}
          {hasTarget ? ` / ${formatCurrency(target)}` : ""}
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: hasTarget ? `${pct * 100}%` : current > 0 ? "100%" : "0%",
              backgroundColor: isOver ? COLORS.rose : color,
            },
          ]}
        />
      </View>
      {isOver && <Text style={styles.overText}>Over budget</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  labelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  label: { color: COLORS.ink, fontWeight: "600", fontSize: 14 },
  amount: { color: COLORS.inkSoft, fontSize: 13 },
  amountOver: { color: COLORS.rose, fontWeight: "600" },
  track: { height: 8, borderRadius: 4, backgroundColor: COLORS.border, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 4 },
  overText: { color: COLORS.rose, fontSize: 12, marginTop: 4 },
});
