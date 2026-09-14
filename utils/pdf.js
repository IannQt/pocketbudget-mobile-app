import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { getCategoryFor } from "./constants";
import { formatCurrency, formatDateLong, currentMonthKey, monthLabel, monthKey } from "./format";
import { LOGO_BASE64 } from "./logoBase64";

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function buildReportHtml({ transactions, accounts, netWorth }) {
  const monthTx = transactions.filter((t) => monthKey(t.date) === currentMonthKey());
  const income = monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const accountName = (id) => accounts.find((a) => a.id === id)?.name || "—";

  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  const rows = sorted
    .map((t) => {
      const category = getCategoryFor(t.type, t.categoryId);
      const isIncome = t.type === "income";
      return `
        <tr>
          <td class="date">${escapeHtml(formatDateLong(t.date))}</td>
          <td>${escapeHtml(category.label)}</td>
          <td>${escapeHtml(accountName(t.accountId))}</td>
          <td class="note">${escapeHtml(t.note || "")}</td>
          <td class="amount ${isIncome ? "income" : "expense"}">
            ${isIncome ? "+" : "-"}${escapeHtml(formatCurrency(t.amount))}
          </td>
        </tr>`;
    })
    .join("");

  return `
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
        color: #1E2B22;
        margin: 0;
        padding: 36px 40px;
      }
      .header {
        display: flex;
        align-items: center;
        border-bottom: 2px solid #1E2B22;
        padding-bottom: 18px;
        margin-bottom: 24px;
      }
      .header img { width: 46px; height: 46px; border-radius: 11px; margin-right: 14px; }
      .header h1 { font-size: 22px; margin: 0; }
      .header p { font-size: 12px; color: #4A5A4E; margin: 2px 0 0; }
      .header .generated { margin-left: auto; text-align: right; font-size: 11px; color: #4A5A4E; }

      .summary { display: flex; gap: 14px; margin-bottom: 28px; }
      .summary .card {
        flex: 1;
        border: 1px solid #D5D9C9;
        border-radius: 8px;
        padding: 14px 16px;
        background: #FBFAF6;
      }
      .summary .label { font-size: 11px; color: #4A5A4E; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.4px; }
      .summary .value { font-size: 19px; font-weight: 700; }
      .summary .income .value { color: #5B7A5E; }
      .summary .expense .value { color: #A6503A; }

      h2 { font-size: 14px; margin: 0 0 10px; }

      table { width: 100%; border-collapse: collapse; font-size: 11px; }
      thead th {
        text-align: left;
        border-bottom: 1px solid #1E2B22;
        padding: 8px 6px;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        color: #4A5A4E;
      }
      tbody td { padding: 7px 6px; border-bottom: 1px solid #EEF1E7; }
      tbody tr:nth-child(even) { background: #FBFAF6; }
      td.date { white-space: nowrap; color: #4A5A4E; }
      td.note { color: #4A5A4E; }
      td.amount { text-align: right; font-weight: 700; white-space: nowrap; }
      td.amount.income { color: #5B7A5E; }
      td.amount.expense { color: #1E2B22; }

      .footer { margin-top: 24px; font-size: 10px; color: #4A5A4E; text-align: center; }
    </style>
  </head>
  <body>
    <div class="header">
      <img src="data:image/png;base64,${LOGO_BASE64}" />
      <div>
        <h1>PocketBudget</h1>
        <p>Financial summary report</p>
      </div>
      <div class="generated">
        Generated ${escapeHtml(formatDateLong(new Date().toISOString().slice(0, 10)))}<br/>
        ${escapeHtml(monthLabel(currentMonthKey()))} overview
      </div>
    </div>

    <div class="summary">
      <div class="card">
        <div class="label">Net worth</div>
        <div class="value">${escapeHtml(formatCurrency(netWorth))}</div>
      </div>
      <div class="card income">
        <div class="label">Income this month</div>
        <div class="value">+${escapeHtml(formatCurrency(income))}</div>
      </div>
      <div class="card expense">
        <div class="label">Expenses this month</div>
        <div class="value">-${escapeHtml(formatCurrency(expense))}</div>
      </div>
    </div>

    <h2>All transactions (${sorted.length})</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Account</th>
          <th>Note</th>
          <th style="text-align:right">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${rows || `<tr><td colspan="5" style="text-align:center;color:#4A5A4E;padding:20px;">No transactions yet.</td></tr>`}
      </tbody>
    </table>

    <div class="footer">Generated by PocketBudget — private, on-device budget tracking.</div>
  </body>
  </html>`;
}

export async function exportPdfReport({ transactions, accounts, netWorth }) {
  const html = buildReportHtml({ transactions, accounts, netWorth });
  const { uri } = await Print.printToFileAsync({ html, base64: false });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: "PocketBudget report",
      UTI: "com.adobe.pdf",
    });
  }
  return uri;
}
