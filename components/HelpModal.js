import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from "react-native";
import { COLORS } from "../utils/constants";

const HELP_STEPS = [
  {
    number: "1",
    title: "Add your accounts",
    text: "Start with your main wallet, bank account, or e-wallet. This gives PocketBudget a place to track your money.",
  },
  {
    number: "2",
    title: "Log your money moves",
    text: "Use the Add tab to record income, expenses, or transfers. The dashboard will update automatically as you go.",
  },
  {
    number: "3",
    title: "Set budgets and goals",
    text: "Create category budgets to stay on track, then add savings goals for things like travel, emergencies, or large purchases.",
  },
  {
    number: "4",
    title: "Track debts and recurring bills",
    text: "Use the Debts and Recurring sections to monitor what you owe, what people owe you, and regular payments like subscriptions.",
  },
  {
    number: "5",
    title: "Review your summaries",
    text: "Check the Home dashboard, History, and More menu to see trends, totals, and important reminders at a glance.",
  },
];

export default function HelpModal({ onClose }) {
  return (
    <Modal transparent={false} animationType="slide" visible onRequestClose={onClose}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.eyebrow}>Need a hand?</Text>
            <Text style={styles.title}>How PocketBudget works</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Start simple, stay in control</Text>
            <Text style={styles.heroText}>
              PocketBudget helps you track spending, budgets, recurring bills, goals, and debts in one place.
            </Text>
          </View>

          {HELP_STEPS.map((step) => (
            <View key={step.number} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{step.number}</Text>
                </View>
                <Text style={styles.stepTitle}>{step.title}</Text>
              </View>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.primaryBtn} onPress={onClose}>
            <Text style={styles.primaryBtnText}>I’m ready to start</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.paper,
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  headerTextWrap: { flex: 1 },
  eyebrow: { color: COLORS.inkSoft, fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  title: { fontSize: 24, fontWeight: "700", color: COLORS.ink, marginTop: 4 },
  closeBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeBtnText: { color: COLORS.ink, fontWeight: "700", fontSize: 12 },
  content: { paddingBottom: 30 },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },
  heroTitle: { fontSize: 18, fontWeight: "700", color: COLORS.ink, marginBottom: 6 },
  heroText: { color: COLORS.inkSoft, fontSize: 13, lineHeight: 20 },
  stepCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  stepHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.ink,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  stepBadgeText: { color: COLORS.surface, fontSize: 12, fontWeight: "700" },
  stepTitle: { color: COLORS.ink, fontSize: 14, fontWeight: "700", flex: 1 },
  stepText: { color: COLORS.inkSoft, fontSize: 12, lineHeight: 18 },
  primaryBtn: {
    backgroundColor: COLORS.ink,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  primaryBtnText: { color: COLORS.surface, fontWeight: "700", fontSize: 15 },
});
