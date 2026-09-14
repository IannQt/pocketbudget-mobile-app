import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useApp } from "../context/AppContext";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, FREQUENCIES, COLORS } from "../utils/constants";
import AccountPicker from "./AccountPicker";
import CategoryPicker from "./CategoryPicker";
import ModalShell from "./ModalShell";

export default function AddRecurringModal({ onClose }) {
  const { accounts, addRecurring } = useApp();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [accountId, setAccountId] = useState(accounts[0]?.id || null);
  const [categoryId, setCategoryId] = useState(EXPENSE_CATEGORIES[0].id);
  const [frequency, setFrequency] = useState("monthly");
  const [error, setError] = useState("");

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleTypeChange(next) {
    setType(next);
    setCategoryId(next === "income" ? INCOME_CATEGORIES[0].id : EXPENSE_CATEGORIES[0].id);
  }

  async function handleSave() {
    if (!name.trim()) {
      setError("Give this bill a name.");
      return;
    }
    if (!parseFloat(amount) || parseFloat(amount) <= 0) {
      setError("Enter an amount greater than ₱0.");
      return;
    }
    if (!accountId) {
      setError("Add an account first.");
      return;
    }
    await addRecurring({ name, amount, type, categoryId, accountId, frequency });
    onClose();
  }

  return (
    <ModalShell onClose={onClose}>
      <Text style={styles.title}>New recurring bill</Text>
      <Text style={styles.subtitle}>Set up regular income or expenses so your monthly schedule stays organized.</Text>

      <View style={styles.typeToggle}>
        <TouchableOpacity
          style={[styles.typeBtn, type === "expense" && styles.typeBtnActiveRose]}
          onPress={() => handleTypeChange("expense")}
        >
          <Text style={[styles.typeBtnText, type === "expense" && styles.typeBtnTextActive]}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeBtn, type === "income" && styles.typeBtnActiveGreen]}
          onPress={() => handleTypeChange("income")}
        >
          <Text style={[styles.typeBtnText, type === "income" && styles.typeBtnTextActive]}>Income</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        autoFocus
        value={name}
        onChangeText={setName}
        placeholder="e.g. Netflix"
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

      <Text style={styles.label}>Account</Text>
      <View style={{ marginBottom: 16 }}>
        <AccountPicker accounts={accounts} selectedId={accountId} onSelect={setAccountId} />
      </View>

      <Text style={styles.label}>Category</Text>
      <View style={{ marginBottom: 16 }}>
        <CategoryPicker categories={categories} selectedId={categoryId} onSelect={setCategoryId} />
      </View>

      <Text style={styles.label}>Repeats</Text>
      <View style={styles.freqRow}>
        {FREQUENCIES.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.freqChip, frequency === f.id && styles.freqChipActive]}
            onPress={() => setFrequency(f.id)}
          >
            <Text style={[styles.freqChipText, frequency === f.id && styles.freqChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.ghostBtn} onPress={onClose}>
          <Text style={styles.ghostBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
          <Text style={styles.primaryBtnText}>Add bill</Text>
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
  freqRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  freqChip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  freqChipActive: { backgroundColor: COLORS.ink, borderColor: COLORS.ink },
  freqChipText: { color: COLORS.inkSoft, fontSize: 12, fontWeight: "600" },
  freqChipTextActive: { color: COLORS.surface },
  error: { color: COLORS.rose, fontSize: 13, marginTop: 8 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 16 },
  ghostBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 },
  ghostBtnText: { color: COLORS.inkSoft, fontWeight: "600" },
  primaryBtn: { backgroundColor: COLORS.ink, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 },
  primaryBtnText: { color: COLORS.surface, fontWeight: "700" },
});
