import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, FREQUENCIES, COLORS } from "../utils/constants";
import { todayISO } from "../utils/format";
import AccountPicker from "../components/AccountPicker";
import CategoryPicker from "../components/CategoryPicker";

export default function AddTransactionScreen() {
  const { accounts, addTransaction, addRecurring } = useApp();
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.id || null);
  const [categoryId, setCategoryId] = useState(EXPENSE_CATEGORIES[0].id);
  const [note, setNote] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");
  const [saving, setSaving] = useState(false);

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleTypeChange(next) {
    setType(next);
    setCategoryId(next === "income" ? INCOME_CATEGORIES[0].id : EXPENSE_CATEGORIES[0].id);
  }

  async function handleSave() {
    const numeric = parseFloat(amount);
    if (!numeric || numeric <= 0) {
      Alert.alert("Enter an amount", "Add a valid amount greater than ₱0.");
      return;
    }
    if (!accountId) {
      Alert.alert("Choose an account", "Add an account first from the Accounts tab.");
      return;
    }

    setSaving(true);
    try {
      if (isRecurring) {
        await addRecurring({
          name: note || categories.find((c) => c.id === categoryId)?.label || "Recurring",
          amount: numeric,
          type,
          categoryId,
          accountId,
          frequency,
        });
        Alert.alert("Recurring bill added", "You'll see it in Upcoming bills on Home.");
      } else {
        await addTransaction({ type, amount: numeric, accountId, categoryId, note, date: todayISO() });
        Alert.alert("Saved", `${type === "income" ? "Income" : "Expense"} added.`);
      }
      setAmount("");
      setNote("");
      setIsRecurring(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Add transaction</Text>
          <Text style={styles.subtitle}>Record a one-time or recurring income or expense entry.</Text>

          <View style={styles.helperCard}>
            <Ionicons name="sparkles-outline" size={16} color={COLORS.ink} style={{ marginRight: 8 }} />
            <Text style={styles.helperCardText}>Tip: enter the amount, pick an account, then save.</Text>
          </View>

          <View style={styles.typeToggle}>
            <TouchableOpacity
              style={[styles.typeBtn, type === "expense" && styles.typeBtnActiveExpense]}
              onPress={() => handleTypeChange("expense")}
            >
              <Text style={[styles.typeBtnText, type === "expense" && styles.typeBtnTextActive]}>
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeBtn, type === "income" && styles.typeBtnActiveIncome]}
              onPress={() => handleTypeChange("income")}
            >
              <Text style={[styles.typeBtnText, type === "income" && styles.typeBtnTextActive]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>

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
          <View style={{ marginBottom: 20 }}>
            <AccountPicker accounts={accounts} selectedId={accountId} onSelect={setAccountId} />
          </View>

          <Text style={styles.label}>Category</Text>
          <View style={{ marginBottom: 20 }}>
            <CategoryPicker categories={categories} selectedId={categoryId} onSelect={setCategoryId} />
          </View>

          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="What was this for?"
            placeholderTextColor={COLORS.inkSoft}
            style={styles.noteInput}
          />

          <View style={styles.recurringToggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Make this recurring</Text>
              <Text style={styles.helperText}>Adds it as an upcoming bill instead of a one-off.</Text>
            </View>
            <Switch value={isRecurring} onValueChange={setIsRecurring} trackColor={{ true: COLORS.gold }} />
          </View>

          {isRecurring && (
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
          )}

          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveBtnText}>
              {saving ? "Saving…" : isRecurring ? "Add recurring bill" : "Save transaction"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
  content: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "700", color: COLORS.ink, marginBottom: 6 },
  subtitle: { fontSize: 13, lineHeight: 20, color: COLORS.inkSoft, marginBottom: 18 },
  helperCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  helperCardText: { color: COLORS.inkSoft, fontSize: 12, fontWeight: "600", flex: 1 },
  typeToggle: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  typeBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 7 },
  typeBtnActiveExpense: { backgroundColor: COLORS.rose },
  typeBtnActiveIncome: { backgroundColor: COLORS.green },
  typeBtnText: { color: COLORS.inkSoft, fontWeight: "700", fontSize: 13 },
  typeBtnTextActive: { color: COLORS.surface },
  label: { fontSize: 13, color: COLORS.inkSoft, marginBottom: 8, marginTop: 4 },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  currencySign: { fontSize: 28, color: COLORS.inkSoft, marginRight: 6 },
  amountInput: { flex: 1, fontSize: 28, color: COLORS.ink, paddingVertical: 14 },
  noteInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.ink,
    marginBottom: 20,
  },
  helperText: { color: COLORS.inkSoft, fontSize: 12, marginTop: -4 },
  recurringToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  freqRow: { flexDirection: "row", gap: 8, marginBottom: 24 },
  freqChip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: COLORS.surface,
  },
  freqChipActive: { backgroundColor: COLORS.ink, borderColor: COLORS.ink },
  freqChipText: { color: COLORS.inkSoft, fontSize: 13, fontWeight: "600" },
  freqChipTextActive: { color: COLORS.surface },
  saveBtn: { backgroundColor: COLORS.ink, borderRadius: 12, paddingVertical: 16, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: COLORS.surface, fontSize: 15, fontWeight: "700" },
});
