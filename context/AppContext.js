import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { currentMonthKey, monthKey, todayISO, generateId, addDays } from "../utils/format";
import { FREQUENCIES } from "../utils/constants";

const KEYS = {
  accounts: "pocketbudget:accounts",
  transactions: "pocketbudget:transactions",
  budgets: "pocketbudget:budgets",
  goals: "pocketbudget:goals",
  debts: "pocketbudget:debts",
  recurring: "pocketbudget:recurring",
};

const DEFAULT_ACCOUNTS = [
  { id: "cash-default", name: "Cash", type: "cash", color: "#16213A", startingBalance: 0 },
];

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [accounts, setAccounts] = useState(DEFAULT_ACCOUNTS);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [goals, setGoals] = useState([]);
  const [debts, setDebts] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const entries = await AsyncStorage.multiGet(Object.values(KEYS));
        const map = Object.fromEntries(entries);
        if (map[KEYS.accounts]) setAccounts(JSON.parse(map[KEYS.accounts]));
        if (map[KEYS.transactions]) setTransactions(JSON.parse(map[KEYS.transactions]));
        if (map[KEYS.budgets]) setBudgets(JSON.parse(map[KEYS.budgets]));
        if (map[KEYS.goals]) setGoals(JSON.parse(map[KEYS.goals]));
        if (map[KEYS.debts]) setDebts(JSON.parse(map[KEYS.debts]));
        if (map[KEYS.recurring]) setRecurring(JSON.parse(map[KEYS.recurring]));
      } catch (err) {
        console.warn("Failed to load saved data", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback((key, setter) => async (next) => {
    const value = typeof next === "function" ? next : next;
    setter(next);
    await AsyncStorage.setItem(key, JSON.stringify(next));
  }, []);

  const saveAccounts = useCallback(async (next) => {
    setAccounts(next);
    await AsyncStorage.setItem(KEYS.accounts, JSON.stringify(next));
  }, []);
  const saveTransactions = useCallback(async (next) => {
    setTransactions(next);
    await AsyncStorage.setItem(KEYS.transactions, JSON.stringify(next));
  }, []);
  const saveBudgets = useCallback(async (next) => {
    setBudgets(next);
    await AsyncStorage.setItem(KEYS.budgets, JSON.stringify(next));
  }, []);
  const saveGoals = useCallback(async (next) => {
    setGoals(next);
    await AsyncStorage.setItem(KEYS.goals, JSON.stringify(next));
  }, []);
  const saveDebts = useCallback(async (next) => {
    setDebts(next);
    await AsyncStorage.setItem(KEYS.debts, JSON.stringify(next));
  }, []);
  const saveRecurring = useCallback(async (next) => {
    setRecurring(next);
    await AsyncStorage.setItem(KEYS.recurring, JSON.stringify(next));
  }, []);

  // ---------- Accounts ----------
  const addAccount = useCallback(
    async ({ name, type, color, startingBalance }) => {
      const account = {
        id: generateId(),
        name: name.trim(),
        type,
        color,
        startingBalance: Number(startingBalance) || 0,
      };
      await saveAccounts([...accounts, account]);
      return account;
    },
    [accounts, saveAccounts]
  );

  const deleteAccount = useCallback(
    async (id) => {
      await saveAccounts(accounts.filter((a) => a.id !== id));
      await saveTransactions(
        transactions.filter((t) => t.accountId !== id && t.toAccountId !== id)
      );
    },
    [accounts, transactions, saveAccounts, saveTransactions]
  );

  const accountBalances = useMemo(() => {
    const balances = {};
    accounts.forEach((a) => {
      balances[a.id] = a.startingBalance;
    });
    transactions.forEach((t) => {
      if (t.type === "income") balances[t.accountId] = (balances[t.accountId] || 0) + t.amount;
      else if (t.type === "expense") balances[t.accountId] = (balances[t.accountId] || 0) - t.amount;
      else if (t.type === "transfer") {
        balances[t.accountId] = (balances[t.accountId] || 0) - t.amount;
        balances[t.toAccountId] = (balances[t.toAccountId] || 0) + t.amount;
      }
    });
    return balances;
  }, [accounts, transactions]);

  const netWorth = useMemo(
    () => Object.values(accountBalances).reduce((sum, v) => sum + v, 0),
    [accountBalances]
  );

  // ---------- Transactions ----------
  const addTransaction = useCallback(
    async (input) => {
      const entry = {
        id: generateId(),
        type: input.type, // income | expense | transfer
        amount: Number(input.amount),
        accountId: input.accountId,
        toAccountId: input.toAccountId || null,
        categoryId: input.categoryId || null,
        note: input.note?.trim() || "",
        date: input.date || todayISO(),
      };
      await saveTransactions([entry, ...transactions]);
      return entry;
    },
    [transactions, saveTransactions]
  );

  const deleteTransaction = useCallback(
    async (id) => {
      await saveTransactions(transactions.filter((t) => t.id !== id));
    },
    [transactions, saveTransactions]
  );

  const thisMonthTransactions = useMemo(() => {
    const key = currentMonthKey();
    return transactions.filter((t) => monthKey(t.date) === key);
  }, [transactions]);

  const totalIncomeThisMonth = useMemo(
    () => thisMonthTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
    [thisMonthTransactions]
  );
  const totalExpenseThisMonth = useMemo(
    () => thisMonthTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    [thisMonthTransactions]
  );

  const expenseTotalsByCategory = useMemo(() => {
    const totals = {};
    thisMonthTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        totals[t.categoryId] = (totals[t.categoryId] || 0) + t.amount;
      });
    return totals;
  }, [thisMonthTransactions]);

  const totalBudget = useMemo(
    () => Object.values(budgets).reduce((sum, v) => sum + (Number(v) || 0), 0),
    [budgets]
  );

  // ---------- Budgets ----------
  const setBudget = useCallback(
    async (categoryId, amount) => {
      await saveBudgets({ ...budgets, [categoryId]: Number(amount) || 0 });
    },
    [budgets, saveBudgets]
  );

  // ---------- Goals ----------
  const addGoal = useCallback(
    async ({ name, targetAmount, icon, color, targetDate }) => {
      const goal = {
        id: generateId(),
        name: name.trim(),
        targetAmount: Number(targetAmount) || 0,
        savedAmount: 0,
        icon: icon || "airplane-outline",
        color: color || "#2F7D5C",
        targetDate: targetDate || null,
      };
      await saveGoals([...goals, goal]);
      return goal;
    },
    [goals, saveGoals]
  );

  const contributeToGoal = useCallback(
    async (id, amount) => {
      await saveGoals(
        goals.map((g) => (g.id === id ? { ...g, savedAmount: g.savedAmount + Number(amount) } : g))
      );
    },
    [goals, saveGoals]
  );

  const deleteGoal = useCallback(
    async (id) => {
      await saveGoals(goals.filter((g) => g.id !== id));
    },
    [goals, saveGoals]
  );

  // ---------- Debts ----------
  const addDebt = useCallback(
    async ({ personName, amount, direction, dueDate, note }) => {
      const debt = {
        id: generateId(),
        personName: personName.trim(),
        amount: Number(amount) || 0,
        direction, // 'owe' (I owe them) | 'owed' (they owe me)
        dueDate: dueDate || null,
        note: note?.trim() || "",
        settled: false,
      };
      await saveDebts([debt, ...debts]);
      return debt;
    },
    [debts, saveDebts]
  );

  const toggleDebtSettled = useCallback(
    async (id) => {
      await saveDebts(debts.map((d) => (d.id === id ? { ...d, settled: !d.settled } : d)));
    },
    [debts, saveDebts]
  );

  const deleteDebt = useCallback(
    async (id) => {
      await saveDebts(debts.filter((d) => d.id !== id));
    },
    [debts, saveDebts]
  );

  // ---------- Recurring ----------
  const addRecurring = useCallback(
    async ({ name, amount, type, categoryId, accountId, frequency }) => {
      const item = {
        id: generateId(),
        name: name.trim(),
        amount: Number(amount) || 0,
        type, // income | expense
        categoryId,
        accountId,
        frequency, // weekly | monthly
        nextDate: todayISO(),
      };
      await saveRecurring([...recurring, item]);
      return item;
    },
    [recurring, saveRecurring]
  );

  const deleteRecurring = useCallback(
    async (id) => {
      await saveRecurring(recurring.filter((r) => r.id !== id));
    },
    [recurring, saveRecurring]
  );

  const markRecurringPaid = useCallback(
    async (id) => {
      const item = recurring.find((r) => r.id === id);
      if (!item) return;
      await addTransaction({
        type: item.type,
        amount: item.amount,
        accountId: item.accountId,
        categoryId: item.categoryId,
        note: item.name,
        date: todayISO(),
      });
      const freq = FREQUENCIES.find((f) => f.id === item.frequency) || FREQUENCIES[1];
      await saveRecurring(
        recurring.map((r) => (r.id === id ? { ...r, nextDate: addDays(r.nextDate, freq.days) } : r))
      );
    },
    [recurring, saveRecurring, addTransaction]
  );

  const upcomingRecurring = useMemo(() => {
    const today = todayISO();
    return recurring
      .filter((r) => r.nextDate <= addDays(today, 7))
      .sort((a, b) => a.nextDate.localeCompare(b.nextDate));
  }, [recurring]);

  const value = {
    loading,
    accounts,
    addAccount,
    deleteAccount,
    accountBalances,
    netWorth,
    transactions,
    addTransaction,
    deleteTransaction,
    thisMonthTransactions,
    totalIncomeThisMonth,
    totalExpenseThisMonth,
    expenseTotalsByCategory,
    budgets,
    setBudget,
    totalBudget,
    goals,
    addGoal,
    contributeToGoal,
    deleteGoal,
    debts,
    addDebt,
    toggleDebtSettled,
    deleteDebt,
    recurring,
    addRecurring,
    deleteRecurring,
    markRecurringPaid,
    upcomingRecurring,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
