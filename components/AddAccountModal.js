import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import { ACCOUNT_TYPES, ACCOUNT_TYPE_GROUPS, COLORS } from "../utils/constants";
import ModalShell from "./ModalShell";

export default function AddAccountModal({ onClose }) {
  const { addAccount } = useApp();
  const [name, setName] = useState("");
  const [type, setType] = useState(ACCOUNT_TYPES[0].id);
  const [startingBalance, setStartingBalance] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    if (!name.trim()) {
      setError("Give this account a name.");
      return;
    }
    const typeInfo = ACCOUNT_TYPES.find((t) => t.id === type);
    await addAccount({
      name,
      type,
      color: typeInfo.color,
      startingBalance: parseFloat(startingBalance) || 0,
    });
    onClose();
  }

  return (
    <ModalShell onClose={onClose}>
      <Text style={styles.title}>New account</Text>
      <Text style={styles.subtitle}>Create a wallet, bank, or card profile so you can track balances and activity.</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        autoFocus
        value={name}
        onChangeText={setName}
        placeholder="e.g. BDO Savings"
        placeholderTextColor={COLORS.inkSoft}
        style={styles.input}
      />

      <Text style={styles.label}>Type</Text>
      <View style={styles.typeList}>
        {ACCOUNT_TYPE_GROUPS.map((group) => {
          const items = ACCOUNT_TYPES.filter((t) => t.group === group);
          if (items.length === 0) return null;
          return (
            <View key={group} style={styles.groupBlock}>
              <Text style={styles.groupLabel}>{group}</Text>
              <View style={styles.typeGrid}>
                {items.map((t) => {
                  const active = type === t.id;
                  return (
                    <TouchableOpacity
                      key={t.id}
                      onPress={() => setType(t.id)}
                      style={[styles.chip, active && { backgroundColor: t.color, borderColor: t.color }]}
                    >
                      <Ionicons
                        name={t.icon}
                        size={14}
                        color={active ? COLORS.surface : COLORS.inkSoft}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>{t.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>

      <Text style={styles.label}>Starting balance</Text>
      <View style={styles.amountRow}>
        <Text style={styles.currencySign}>₱</Text>
        <TextInput
          value={startingBalance}
          onChangeText={setStartingBalance}
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
          <Text style={styles.primaryBtnText}>Add account</Text>
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
  typeList: { marginBottom: 12 },
  groupBlock: { marginBottom: 12 },
  groupLabel: { color: COLORS.inkSoft, fontSize: 11, fontWeight: "700", textTransform: "uppercase", marginBottom: 6, letterSpacing: 0.5 },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  chipText: { color: COLORS.inkSoft, fontSize: 12, fontWeight: "600" },
  chipTextActive: { color: COLORS.surface },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  currencySign: { fontSize: 18, color: COLORS.inkSoft, marginRight: 4 },
  amountInput: { flex: 1, fontSize: 18, color: COLORS.ink, paddingVertical: 10 },
  error: { color: COLORS.rose, fontSize: 13, marginTop: 4 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 16 },
  ghostBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 },
  ghostBtnText: { color: COLORS.inkSoft, fontWeight: "600" },
  primaryBtn: { backgroundColor: COLORS.ink, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 },
  primaryBtnText: { color: COLORS.surface, fontWeight: "700" },
});
