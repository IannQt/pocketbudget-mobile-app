import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../utils/constants";

export default function CategoryPicker({ categories, selectedId, onSelect }) {
  return (
    <View style={styles.grid}>
      {categories.map((c) => {
        const active = selectedId === c.id;
        return (
          <TouchableOpacity
            key={c.id}
            onPress={() => onSelect(c.id)}
            style={[styles.chip, active && { backgroundColor: c.color, borderColor: c.color }]}
          >
            <Ionicons
              name={c.icon}
              size={14}
              color={active ? COLORS.surface : COLORS.inkSoft}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{c.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
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
