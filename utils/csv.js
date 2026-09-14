import { Share } from "react-native";
import { getCategoryFor } from "./constants";
import { formatDateLong } from "./format";

function escapeCsv(value) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildTransactionsCsv(transactions, accounts) {
  const accountName = (id) => accounts.find((a) => a.id === id)?.name || "Unknown";
  const header = ["Date", "Type", "Category", "Account", "Amount", "Note"];
  const rows = transactions.map((t) => [
    formatDateLong(t.date),
    t.type,
    getCategoryFor(t.type, t.categoryId).label,
    accountName(t.accountId),
    t.amount.toFixed(2),
    t.note || "",
  ]);
  return [header, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
}

export async function exportTransactionsCsv(transactions, accounts) {
  const csv = buildTransactionsCsv(transactions, accounts);
  await Share.share({
    title: "PocketBudget export",
    message: csv,
  });
}
