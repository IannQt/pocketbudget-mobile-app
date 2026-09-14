const PHILIPPINE_CURRENCY_FORMATTER = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount) {
  const value = Number(amount) || 0;
  return PHILIPPINE_CURRENCY_FORMATTER.format(value);
}

export function formatDate(isoDate) {
  const d = new Date(isoDate);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatDateLong(isoDate) {
  const d = new Date(isoDate);
  return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function monthKey(isoDate) {
  return isoDate.slice(0, 7); // YYYY-MM
}

export function currentMonthKey() {
  return monthKey(todayISO());
}

export function monthLabel(key) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function addDays(isoDate, days) {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function isPastOrToday(isoDate) {
  return isoDate <= todayISO();
}

export function lastNMonthKeys(n) {
  const keys = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return keys;
}

export function shortMonthLabel(key) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, { month: "short" });
}
