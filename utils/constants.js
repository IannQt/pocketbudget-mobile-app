export const EXPENSE_CATEGORIES = [
  { id: "food", label: "Food", color: "#A67C3D", icon: "restaurant-outline" },
  { id: "transport", label: "Transport", color: "#3E6B8A", icon: "car-outline" },
  { id: "housing", label: "Housing", color: "#5B7A5E", icon: "home-outline" },
  { id: "utilities", label: "Utilities", color: "#7C5C9C", icon: "flash-outline" },
  { id: "entertainment", label: "Fun", color: "#A6503A", icon: "game-controller-outline" },
  { id: "health", label: "Health", color: "#4A8B7C", icon: "medkit-outline" },
  { id: "shopping", label: "Shopping", color: "#B08968", icon: "bag-outline" },
  { id: "debt", label: "Debt payment", color: "#8A5A44", icon: "card-outline" },
  { id: "other", label: "Other", color: "#6B7280", icon: "ellipsis-horizontal-outline" },
];

export const INCOME_CATEGORIES = [
  { id: "salary", label: "Salary", color: "#5B7A5E", icon: "briefcase-outline" },
  { id: "freelance", label: "Freelance", color: "#3E6B8A", icon: "laptop-outline" },
  { id: "business", label: "Business", color: "#A67C3D", icon: "storefront-outline" },
  { id: "gift", label: "Gift", color: "#A6503A", icon: "gift-outline" },
  { id: "investment", label: "Investment", color: "#7C5C9C", icon: "trending-up-outline" },
  { id: "other_income", label: "Other", color: "#6B7280", icon: "ellipsis-horizontal-outline" },
];

// Labeled institutions for account creation. This does NOT connect to real
// bank/e-wallet accounts (no live balance sync) — it just gives an account
// the right name, icon, and brand-adjacent color so your account list reads
// like your real wallet. Balances are still entered and tracked manually.
export const ACCOUNT_TYPES = [
  { id: "cash", label: "Cash", icon: "cash-outline", color: "#5B7A5E", group: "Cash" },

  { id: "gcash", label: "GCash", icon: "phone-portrait-outline", color: "#0072CE", group: "E-wallets" },
  { id: "maya", label: "Maya", icon: "phone-portrait-outline", color: "#00C16E", group: "E-wallets" },
  { id: "gotyme", label: "GoTyme", icon: "wallet-outline", color: "#7B3FE4", group: "E-wallets" },
  { id: "coins_ph", label: "Coins.ph", icon: "phone-portrait-outline", color: "#3B4CCA", group: "E-wallets" },

  { id: "landbank", label: "Landbank", icon: "business-outline", color: "#00563F", group: "Banks" },
  { id: "bdo", label: "BDO", icon: "business-outline", color: "#003DA5", group: "Banks" },
  { id: "bpi", label: "BPI", icon: "business-outline", color: "#8E1537", group: "Banks" },
  { id: "metrobank", label: "Metrobank", icon: "business-outline", color: "#003876", group: "Banks" },
  { id: "unionbank", label: "UnionBank", icon: "business-outline", color: "#F7941D", group: "Banks" },
  { id: "securitybank", label: "Security Bank", icon: "business-outline", color: "#003C71", group: "Banks" },
  { id: "pnb", label: "PNB", icon: "business-outline", color: "#00563F", group: "Banks" },
  { id: "chinabank", label: "Chinabank", icon: "business-outline", color: "#C8102E", group: "Banks" },
  { id: "bank_other", label: "Other bank", icon: "business-outline", color: "#3E6B8A", group: "Banks" },

  { id: "card", label: "Credit/Debit card", icon: "card-outline", color: "#A6503A", group: "Cards" },
  { id: "savings", label: "Savings", icon: "wallet-outline", color: "#A67C3D", group: "Other" },
  { id: "other", label: "Other", icon: "ellipsis-horizontal-outline", color: "#6B7280", group: "Other" },
];

export const ACCOUNT_TYPE_GROUPS = ["Cash", "E-wallets", "Banks", "Cards", "Other"];

export const FREQUENCIES = [
  { id: "weekly", label: "Weekly", days: 7 },
  { id: "monthly", label: "Monthly", days: 30 },
  { id: "yearly", label: "Yearly", days: 365 },
];

export function getExpenseCategory(id) {
  return EXPENSE_CATEGORIES.find((c) => c.id === id) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
}

export function getIncomeCategory(id) {
  return INCOME_CATEGORIES.find((c) => c.id === id) || INCOME_CATEGORIES[INCOME_CATEGORIES.length - 1];
}

export function getCategoryFor(type, id) {
  return type === "income" ? getIncomeCategory(id) : getExpenseCategory(id);
}

export function getAccountType(id) {
  return ACCOUNT_TYPES.find((a) => a.id === id) || ACCOUNT_TYPES[ACCOUNT_TYPES.length - 1];
}

export const LIGHT_COLORS = {
  paper: "#F5F7FB",
  surface: "#FFFFFF",
  ink: "#1D2736",
  inkSoft: "#5E6C81",
  border: "#D7DFEA",
  gold: "#B77A32",
  rose: "#D96C5D",
  green: "#2E7D73",
  blue: "#406C9D",
};

export const COLORS = { ...LIGHT_COLORS };
