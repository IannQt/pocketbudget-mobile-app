import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useApp } from "../context/AppContext";
import { COLORS } from "../utils/constants";
import ModalShell from "./ModalShell";

export default function AddDebtModal({ onClose }) {
  const { addDebt } = useApp();
  const [personName, setPersonName] = useState("");
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState("owed"); // owed = they owe me, owe = I owe them
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    if (!personName.trim()) {
      setError("Add a name.");
      return;
    }
    if (!parseFloat(amount) || parseFloat(amount) <= 0) {
      setError("Enter an amount greater than ₱0.");
      return;
    }
    await addDebt({ personName, amount, direction, note });
    onClose();
  }

  return (
    <ModalShell onClose={onClose}>
      <Text style={styles.title}>New debt</Text>
      <Text style={styles.subtitle}>Record what people owe you or what you owe to keep your balances clear.</Text>

      <View style={styles.typeToggle}>
        <TouchableOpacity
          style={[styles.typeBtn, direction === "owed" && styles.typeBtnActiveGreen]}
          onPress={() => setDirection("owed")}
        >
          <Text style={[styles.typeBtnText, direction === "owed" && styles.typeBtnTextActive]}>
            Owed to me
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeBtn, direction === "owe" && styles.typeBtnActiveRose]}
          onPress={() => setDirection("owe")}
        >
          <Text style={[styles.typeBtnText, direction === "owe" && styles.typeBtnTextActive]}>
            I owe
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Person</Text>
      <TextInput
        autoFocus
        value={personName}
        onChangeText={setPersonName}
        placeholder="Who?"
        placeholderTextColor={COLORS.inkSoft}
        style={styles.input}
      />

      <Text style={styles.label}>Amount</Text>
      <View style={styles.amountRow}>
        <Text style={styles.currencySign}>₱</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          placeholderTextColor={COLORS.inkSoft}
          keyboardType="decimal-pad"
          style={styles.amountInput}
        />
      </View>

      <Text style={styles.label}>Note (optional)</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="What for?"
        placeholderTextColor={COLORS.inkSoft}
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.ghostBtn} onPress={onClose}>
          <Text style={styles.ghostBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
          <Text style={styles.primaryBtnText}>Add debt</Text>
        </TouchableOpacity>
      </View>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", color: COLORS.ink, marginBottom: 6 },
  subtitle: { fontSize: 13, lineHeight: 20, color: COLORS.inkSoft, marginBottom: 18 },
  typeToggle: {
    flexDirection: "row",
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  typeBtn: { flex: 1, paddingVertical: 9, alignItems: "center", borderRadius: 7 },
  typeBtnActiveGreen: { backgroundColor: COLORS.green },
  typeBtnActiveRose: { backgroundColor: COLORS.rose },
  typeBtnText: { color: COLORS.inkSoft, fontWeight: "700", fontSize: 13 },
  typeBtnTextActive: { color: COLORS.surface },
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
  error: { color: COLORS.rose, fontSize: 13, marginBottom: 8 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 4 },
  ghostBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 },
  ghostBtnText: { color: COLORS.inkSoft, fontWeight: "600" },
  primaryBtn: { backgroundColor: COLORS.ink, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 },
  primaryBtnText: { color: COLORS.surface, fontWeight: "700" },
});
