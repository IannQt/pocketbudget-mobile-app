import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCategoryFor, COLORS } from "../utils/constants";
import { formatCurrency, formatDate } from "../utils/format";

export default function TransactionItem({ transaction, accountsById, onDelete }) {
  const isIncome = transaction.type === "income";
  const category = getCategoryFor(transaction.type, transaction.categoryId);
  const account = accountsById?.[transaction.accountId];

  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: category.color }]}>
        <Ionicons name={category.icon} size={16} color={COLORS.surface} />
      </View>
      <View style={styles.middle}>
        <Text style={styles.category}>{category.label}</Text>
        <Text style={styles.note} numberOfLines={1}>
          {account?.name || ""}
          {transaction.note ? ` · ${transaction.note}` : ""}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, isIncome ? styles.amountIncome : styles.amountExpense]}>
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>
      {onDelete && (
        <TouchableOpacity
          onPress={() => onDelete(transaction.id)}
          style={styles.deleteBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={16} color={COLORS.inkSoft} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  middle: { flex: 1, marginRight: 8 },
  category: { color: COLORS.ink, fontWeight: "600", fontSize: 14 },
  note: { color: COLORS.inkSoft, fontSize: 12, marginTop: 2 },
  right: { alignItems: "flex-end", marginRight: 8 },
  amount: { fontWeight: "600", fontSize: 14 },
  amountIncome: { color: COLORS.green },
  amountExpense: { color: COLORS.ink },
  date: { color: COLORS.inkSoft, fontSize: 12, marginTop: 2 },
  deleteBtn: { padding: 4 },
});
