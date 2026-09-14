import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useApp } from "../context/AppContext";
import { COLORS } from "../utils/constants";
import ModalShell from "./ModalShell";

export default function ContributeModal({ goal, onClose }) {
  const { contributeToGoal } = useApp();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    const numeric = parseFloat(amount);
    if (!numeric || numeric <= 0) {
      setError("Enter an amount greater than ₱0.");
      return;
    }
    await contributeToGoal(goal.id, numeric);
    onClose();
  }

  return (
    <ModalShell onClose={onClose}>
      <Text style={styles.title}>Add to "{goal.name}"</Text>
      <View style={styles.amountRow}>
        <Text style={styles.currencySign}>₱</Text>
        <TextInput
          autoFocus
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          placeholderTextColor={COLORS.inkSoft}
          keyboardType="decimal-pad"
          style={styles.amountInput}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.ghostBtn} onPress={onClose}>
          <Text style={styles.ghostBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
          <Text style={styles.primaryBtnText}>Add</Text>
        </TouchableOpacity>
      </View>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 17, fontWeight: "700", color: COLORS.ink, marginBottom: 18 },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  currencySign: { fontSize: 22, color: COLORS.inkSoft, marginRight: 4 },
  amountInput: { flex: 1, fontSize: 22, color: COLORS.ink, paddingVertical: 12 },
  error: { color: COLORS.rose, fontSize: 13, marginTop: 4 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 16 },
  ghostBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 },
  ghostBtnText: { color: COLORS.inkSoft, fontWeight: "600" },
  primaryBtn: { backgroundColor: COLORS.ink, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 },
  primaryBtnText: { color: COLORS.surface, fontWeight: "700" },
});
