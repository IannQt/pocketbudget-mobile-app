import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../utils/constants";
import { formatCurrency, currentMonthKey, monthLabel, formatDate } from "../utils/format";
import CategoryBreakdown from "../components/CategoryBreakdown";
import TrendChart from "../components/TrendChart";
import TransactionItem from "../components/TransactionItem";
import HelpModal from "../components/HelpModal";

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [helpOpen, setHelpOpen] = useState(false);
  const {
    netWorth,
    accounts,
    transactions,
    thisMonthTransactions,
    totalIncomeThisMonth,
    totalExpenseThisMonth,
    expenseTotalsByCategory,
    budgets,
    totalBudget,
    upcomingRecurring,
    markRecurringPaid,
    deleteTransaction,
  } = useApp();

  const accountsById = Object.fromEntries(accounts.map((a) => [a.id, a]));
  const recent = transactions.slice(0, 5);
  const net = totalIncomeThisMonth - totalExpenseThisMonth;
  const firstName = user?.name?.split(" ")[0] || "Friend";
  const budgetEntries = Object.entries(budgets || {});
  const budgetRemaining = totalBudget - totalExpenseThisMonth;
  const budgetProgress = totalBudget > 0 ? Math.min((totalExpenseThisMonth / totalBudget) * 100, 100) : 0;
  const budgetCategories = budgetEntries.filter(([_, limit]) => Number(limit) > 0).length;
  const overBudgetCount = budgetEntries.filter(
    ([categoryId, limit]) => Number(limit) > 0 && (expenseTotalsByCategory[categoryId] || 0) > Number(limit)
  ).length;

  const quickStartSteps = [
    { icon: "wallet-outline", label: "Add your accounts", text: "Start with cash, bank, or e-wallet accounts." },
    { icon: "add-circle-outline", label: "Log entries", text: "Record income, expenses, and transfers from the Add tab." },
    { icon: "pie-chart-outline", label: "Set budgets", text: "Create category limits to stay on top of your spending." },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brandRow}>
          <View style={styles.brandLeft}>
            <Image source={require("../assets/icon.png")} style={styles.logo} />
            <View>
              <Text style={styles.wordmark}>PocketBudget</Text>
              <Text style={styles.monthLabel}>{monthLabel(currentMonthKey())}</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.helpBtn} onPress={() => setHelpOpen(true)}>
              <Ionicons name="help-circle-outline" size={18} color={COLORS.ink} />
              <Text style={styles.helpBtnText}>Help</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroBadge}>Welcome back</Text>
              <Text style={styles.heroGreeting}>{firstName}</Text>
            </View>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillText}>{monthLabel(currentMonthKey())}</Text>
            </View>
          </View>

          <Text style={styles.heroLabel}>Net worth</Text>
          <Text style={styles.heroAmount}>{formatCurrency(netWorth)}</Text>

          <View style={styles.heroRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>Income</Text>
              <Text style={[styles.heroStatValue, { color: COLORS.green }]}>
                +{formatCurrency(totalIncomeThisMonth)}
              </Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>Expenses</Text>
              <Text style={[styles.heroStatValue, { color: COLORS.rose }]}>
                -{formatCurrency(totalExpenseThisMonth)}
              </Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>Net</Text>
              <Text style={styles.heroStatValue}>{formatCurrency(net)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryStrip}>
          <View style={styles.summaryPill}>
            <Text style={styles.summaryPillLabel}>This month</Text>
            <Text style={styles.summaryPillValue}>{thisMonthTransactions.length}</Text>
          </View>
          <View style={styles.summaryPill}>
            <Text style={styles.summaryPillLabel}>Budgets</Text>
            <Text style={styles.summaryPillValue}>{budgetCategories}</Text>
          </View>
          <View style={styles.summaryPill}>
            <Text style={styles.summaryPillLabel}>Bills</Text>
            <Text style={styles.summaryPillValue}>{upcomingRecurring.length}</Text>
          </View>
        </View>

        <View style={styles.quickStartCard}>
          <View style={styles.quickStartHeader}>
            <Text style={styles.quickStartTitle}>Quick start</Text>
            <Text style={styles.quickStartHint}>3 simple steps</Text>
          </View>

          {quickStartSteps.map((step) => (
            <View key={step.label} style={styles.quickStartRow}>
              <View style={styles.quickStartIconWrap}>
                <Ionicons name={step.icon} size={16} color={COLORS.ink} />
              </View>
              <View style={styles.quickStartTextWrap}>
                <Text style={styles.quickStartLabel}>{step.label}</Text>
                <Text style={styles.quickStartText}>{step.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.quickGrid}>
          <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate("Add")}>
            <Ionicons name="add-circle-outline" size={20} color={COLORS.ink} />
            <Text style={styles.quickCardTitle}>Add entry</Text>
            <Text style={styles.quickCardText}>Log income or expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => navigation.navigate("More", { screen: "Budgets" })}
          >
            <Ionicons name="pie-chart-outline" size={20} color={COLORS.ink} />
            <Text style={styles.quickCardTitle}>Budgets</Text>
            <Text style={styles.quickCardText}>Track monthly limits</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => navigation.navigate("More", { screen: "History" })}
          >
            <Ionicons name="time-outline" size={20} color={COLORS.ink} />
            <Text style={styles.quickCardTitle}>History</Text>
            <Text style={styles.quickCardText}>Review recent activity</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Budget snapshot</Text>
        <View style={styles.card}>
          {totalBudget > 0 ? (
            <>
              <Text style={styles.budgetHeadline}>
                {formatCurrency(totalExpenseThisMonth)} spent of {formatCurrency(totalBudget)}
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${budgetProgress}%` },
                    totalExpenseThisMonth > totalBudget && styles.progressFillOver,
                  ]}
                />
              </View>
              <Text style={[styles.budgetMeta, totalExpenseThisMonth > totalBudget && styles.budgetMetaOver]}>
                {budgetRemaining >= 0
                  ? `${formatCurrency(budgetRemaining)} left this month`
                  : `${formatCurrency(Math.abs(budgetRemaining))} over budget`}
              </Text>
              {overBudgetCount > 0 && (
                <Text style={styles.warningText}>
                  {overBudgetCount} {overBudgetCount > 1 ? "categories" : "category"} are above their budget.
                </Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.budgetHeadline}>Set monthly budgets</Text>
              <Text style={styles.budgetMeta}>
                Add category limits to track where your money is going and catch overspending faster.
              </Text>
              <TouchableOpacity
                style={styles.inlineAction}
                onPress={() => navigation.navigate("More", { screen: "Budgets" })}
              >
                <Text style={styles.inlineActionText}>Open budgets</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {upcomingRecurring.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Upcoming bills</Text>
            <View style={styles.card}>
              {upcomingRecurring.map((r) => (
                <View key={r.id} style={styles.recurringRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recurringName}>{r.name}</Text>
                    <Text style={styles.recurringDate}>Due {formatDate(r.nextDate)}</Text>
                  </View>
                  <Text style={styles.recurringAmount}>{formatCurrency(r.amount)}</Text>
                  <TouchableOpacity style={styles.payBtn} onPress={() => markRecurringPaid(r.id)}>
                    <Text style={styles.payBtnText}>Mark paid</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Last 6 months</Text>
        <View style={styles.card}>
          <TrendChart transactions={transactions} />
        </View>

        <Text style={styles.sectionTitle}>Spending by category</Text>
        <View style={styles.card}>
          <CategoryBreakdown totalsByCategory={expenseTotalsByCategory} />
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Recent</Text>
          <TouchableOpacity onPress={() => navigation.navigate("More", { screen: "History" })}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        {recent.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Start tracking your money</Text>
            <Text style={styles.emptyText}>
              Add your first income or expense to see your spending summary update right here.
            </Text>
            <TouchableOpacity style={styles.emptyAction} onPress={() => navigation.navigate("Add")}>
              <Text style={styles.emptyActionText}>Add first entry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            {recent.map((t) => (
              <TransactionItem
                key={t.id}
                transaction={t}
                accountsById={accountsById}
                onDelete={deleteTransaction}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
  content: { padding: 20, paddingBottom: 40 },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  brandLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  logo: { width: 38, height: 38, borderRadius: 12, marginRight: 12 },
  wordmark: { fontSize: 24, fontWeight: "700", color: COLORS.ink },
  monthLabel: { color: COLORS.inkSoft, marginTop: 2 },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  themeToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  themeToggleText: { color: COLORS.ink, fontSize: 12, fontWeight: "700", marginLeft: 6 },
  helpBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  helpBtnText: { color: COLORS.ink, fontSize: 12, fontWeight: "700", marginLeft: 6 },
  heroCard: {
    backgroundColor: "#1F2D3D",
    borderRadius: 22,
    padding: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#0E1720",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  heroTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  heroBadge: { color: "#C6D0D8", fontSize: 11, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" },
  heroGreeting: { color: "#F8FAFC", fontSize: 22, fontWeight: "700", marginTop: 4 },
  heroPill: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  heroPillText: { color: "#F8FAFC", fontSize: 11, fontWeight: "600" },
  heroLabel: { color: "#C6D0D8", fontSize: 13 },
  heroAmount: { color: "#F8FAFC", fontSize: 34, fontWeight: "700", marginTop: 4, marginBottom: 16 },
  heroRow: { flexDirection: "row", justifyContent: "space-between" },
  heroStat: {},
  heroStatLabel: { color: "#B5C0CC", fontSize: 11, marginBottom: 3 },
  heroStatValue: { color: "#F8FAFC", fontSize: 14, fontWeight: "700" },
  summaryStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 22,
  },
  quickStartCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  quickStartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  quickStartTitle: {
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: "700",
  },
  quickStartHint: {
    color: COLORS.inkSoft,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  quickStartRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  quickStartIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  quickStartTextWrap: {
    flex: 1,
  },
  quickStartLabel: {
    color: COLORS.ink,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 2,
  },
  quickStartText: {
    color: COLORS.inkSoft,
    fontSize: 12,
    lineHeight: 18,
  },
  summaryPill: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  summaryPillLabel: { color: COLORS.inkSoft, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.4 },
  summaryPillValue: { color: COLORS.ink, fontSize: 20, fontWeight: "700", marginTop: 4 },
  quickGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24, gap: 10 },
  quickCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  quickCardTitle: { color: COLORS.ink, fontSize: 13, fontWeight: "700", marginTop: 8 },
  quickCardText: { color: COLORS.inkSoft, fontSize: 11, marginTop: 3 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: COLORS.ink, marginBottom: 10, marginTop: 4 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  seeAll: { color: COLORS.blue, fontSize: 13, fontWeight: "600", marginBottom: 10 },
  budgetHeadline: { color: COLORS.ink, fontWeight: "700", fontSize: 15, marginBottom: 8 },
  budgetMeta: { color: COLORS.inkSoft, fontSize: 12, marginTop: 8 },
  budgetMetaOver: { color: COLORS.rose },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: COLORS.border,
    overflow: "hidden",
    marginTop: 4,
  },
  progressFill: { height: "100%", borderRadius: 999, backgroundColor: COLORS.gold },
  progressFillOver: { backgroundColor: COLORS.rose },
  warningText: { color: COLORS.rose, fontSize: 12, fontWeight: "600", marginTop: 8 },
  inlineAction: {
    marginTop: 12,
    backgroundColor: COLORS.ink,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
  },
  inlineActionText: { color: COLORS.surface, fontWeight: "700", fontSize: 12 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: { color: COLORS.ink, fontSize: 15, fontWeight: "700", marginBottom: 6 },
  emptyText: { color: COLORS.inkSoft, fontSize: 13, textAlign: "center", lineHeight: 18, marginBottom: 14 },
  emptyAction: {
    backgroundColor: COLORS.ink,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  emptyActionText: { color: COLORS.surface, fontSize: 12, fontWeight: "700" },
  recurringRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 10,
  },
  recurringName: { color: COLORS.ink, fontWeight: "600", fontSize: 13 },
  recurringDate: { color: COLORS.inkSoft, fontSize: 12, marginTop: 2 },
  recurringAmount: { color: COLORS.ink, fontWeight: "600", fontSize: 13 },
  payBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  payBtnText: { color: COLORS.ink, fontSize: 12, fontWeight: "600" },
});
