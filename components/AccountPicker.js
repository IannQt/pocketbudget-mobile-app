import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAccountType, COLORS } from "../utils/constants";

export default function AccountPicker({ accounts, selectedId, onSelect }) {
  if (accounts.length === 0) {
    return <Text style={styles.emptyText}>Add an account first from the Accounts tab.</Text>;
  }

  return (
    <View style={styles.grid}>
      {accounts.map((a) => {
        const active = selectedId === a.id;
        const type = getAccountType(a.type);
        return (
          <TouchableOpacity
            key={a.id}
            onPress={() => onSelect(a.id)}
            style={[styles.chip, active && { backgroundColor: a.color || type.color, borderColor: a.color || type.color }]}
          >
            <Ionicons
              name={type.icon}
              size={14}
              color={active ? COLORS.surface : COLORS.inkSoft}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{a.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  emptyText: { color: COLORS.inkSoft, fontSize: 13 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: COLORS.surface,
  },
  chipText: { color: COLORS.inkSoft, fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: COLORS.surface },
});
