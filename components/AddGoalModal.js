import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useApp } from "../context/AppContext";
import { COLORS } from "../utils/constants";
import ModalShell from "./ModalShell";

const GOAL_COLORS = ["#A67C3D", "#5B7A5E", "#3E6B8A", "#7C5C9C", "#A6503A"];

export default function AddGoalModal({ onClose }) {
  const { addGoal } = useApp();
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [color, setColor] = useState(GOAL_COLORS[0]);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!name.trim()) {
      setError("Give this goal a name.");
      return;
    }
    if (!parseFloat(targetAmount) || parseFloat(targetAmount) <= 0) {
      setError("Enter a target amount greater than ₱0.");
      return;
    }
    await addGoal({ name, targetAmount, color });
    onClose();
  }

  return (
    <ModalShell onClose={onClose}>
      <Text style={styles.title}>New savings goal</Text>
      <Text style={styles.subtitle}>Plan a future purchase or emergency fund and keep your target visible.</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        autoFocus
        value={name}
        onChangeText={setName}
        placeholder="e.g. Emergency fund"
        placeholderTextColor={COLORS.inkSoft}
        style={styles.input}
      />

      <Text style={styles.label}>Target amount</Text>
      <View style={styles.amountRow}>
        <Text style={styles.currencySign}>₱</Text>
        <TextInput
          value={targetAmount}
          onChangeText={setTargetAmount}
          placeholder="0.00"
          placeholderTextColor={COLORS.inkSoft}
          keyboardType="decimal-pad"
          style={styles.amountInput}
        />
      </View>

      <Text style={styles.label}>Color</Text>
      <View style={styles.swatchRow}>
        {GOAL_COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setColor(c)}
            style={[styles.swatch, { backgroundColor: c }, color === c && styles.swatchActive]}
          />
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.ghostBtn} onPress={onClose}>
          <Text style={styles.ghostBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
          <Text style={styles.primaryBtnText}>Add goal</Text>
        </TouchableOpacity>
      </View>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", color: COLORS.ink, marginBottom: 6 },
  subtitle: { fontSize: 13, lineHeight: 20, color: COLORS.inkSoft, marginBottom: 18 },
  label: { fontSize: 13, color: COLORS.inkSoft, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.ink,
    marginBottom: 16,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  currencySign: { fontSize: 18, color: COLORS.inkSoft, marginRight: 4 },
  amountInput: { flex: 1, fontSize: 18, color: COLORS.ink, paddingVertical: 10 },
  swatchRow: { flexDirection: "row", gap: 10, marginBottom: 8 },
  swatch: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: "transparent" },
  swatchActive: { borderColor: COLORS.ink },
  error: { color: COLORS.rose, fontSize: 13, marginTop: 8 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 16 },
  ghostBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 },
  ghostBtnText: { color: COLORS.inkSoft, fontWeight: "600" },
  primaryBtn: { backgroundColor: COLORS.ink, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 },
  primaryBtnText: { color: COLORS.surface, fontWeight: "700" },
});
