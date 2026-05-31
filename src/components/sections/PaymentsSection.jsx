/**
 * ============================================================
 * PaymentsSection.jsx — Payment Transactions View
 * ============================================================
 *
 * Displays gym payment history with:
 *   - 4 summary stat cards (total, online, cash, failed)
 *   - Full transaction table with method + status badges
 *   - Export button (wire to CSV/PDF download)
 *
 * BACKEND INTEGRATION:
 *   Data source → GET /api/gyms/:gymId/payments?month=2025-06
 *   Expected response shape (per payment):
 *   {
 *     id:     number,                         // payments.id
 *     member: string,                         // users.name (via members → users)
 *     amount: string,                         // payments.amount (formatted)
 *     method: "Cash" | "Online",              // payments.method
 *     status: "success" | "pending" | "failed", // payments.status
 *     date:   string (YYYY-MM-DD),            // payments.created_at
 *     txn:    string,                         // payments.transaction_id
 *   }
 *
 *   Summary stats → GET /api/gyms/:gymId/payments/summary?month=2025-06
 *   Response: { total, online, cash, failedPending }
 *
 *   Export CSV  → GET /api/gyms/:gymId/payments/export?format=csv
 *
 * PLAN NOTE (from schema):
 *   Basic plan → method = 'cash' only (online will be null/disabled)
 *   Premium    → both cash & online payments enabled
 * ============================================================
 */

import { Download } from "lucide-react";
import Avatar      from "../ui/Avatar";
import StatusBadge from "../ui/StatusBadge";
import Card        from "../ui/Card";
import { payments } from "../../data/mockData";
import T from "../../theme";

// ── Payment Summary Stats ──────────────────────────────────
// TODO: Replace with dynamic values from /api/payments/summary
const PAYMENT_STATS = [
  { label: "Total Collected",  value: "PKR 34,500", color: T.green },
  { label: "Online Payments",  value: "PKR 25,500", color: T.blue  },
  { label: "Cash Payments",    value: "PKR 10,000", color: T.gold  },
  { label: "Failed / Pending", value: "PKR 13,500", color: T.red   },
];

// Table column headers
const TABLE_HEADERS = ["Member", "Amount", "Method", "Transaction", "Date", "Status"];

export default function PaymentsSection() {
  return (
    <div>

      {/* ── Section Header ──────────────────────────── */}
      <div style={{
        display:        "flex",
        justifyContent: "space-between",
        alignItems:     "center",
        marginBottom:   24,
        flexWrap:       "wrap",
        gap:            12,
      }}>
        <div>
          <h2 style={{ color: T.text, fontSize: 22, fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: 0 }}>
            Payments
          </h2>
          <p style={{ color: T.textMuted, fontSize: 14, margin: "4px 0 0" }}>Transaction history</p>
        </div>

        {/* Export button — TODO: call /api/payments/export */}
        <button style={{
          background:   T.bgSecondary,
          color:        T.textMuted,
          border:       `1px solid ${T.border}`,
          borderRadius: 10,
          padding:      "10px 20px",
          fontSize:     14,
          cursor:       "pointer",
          display:      "flex",
          alignItems:   "center",
          gap:          8,
          fontFamily:   "'DM Sans', sans-serif",
        }}>
          <Download size={15} /> Export
        </button>
      </div>

      {/* ── Summary Stat Cards ───────────────────────── */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap:                 16,
        marginBottom:        20,
      }}>
        {PAYMENT_STATS.map((stat, i) => (
          <Card key={i}>
            <div style={{
              fontSize:      11,
              color:         T.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}>
              {stat.label}
            </div>
            <div style={{
              fontSize:   22,
              fontWeight: 700,
              color:      stat.color,
              marginTop:  8,
              fontFamily: "'Syne', sans-serif",
            }}>
              {stat.value}
            </div>
          </Card>
        ))}
      </div>

      {/* ── Transactions Table ───────────────────────── */}
      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>

            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {TABLE_HEADERS.map(header => (
                  <th key={header} style={{
                    padding:       "10px 14px",
                    textAlign:     "left",
                    fontSize:      11,
                    color:         T.textMuted,
                    fontWeight:    600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {payments.map((payment, index) => (
                <tr
                  key={payment.id}
                  style={{ borderBottom: index < payments.length - 1 ? `1px solid ${T.border}` : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.bgCardHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Member name + avatar */}
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={payment.member} size={32} />
                      <span style={{ fontSize: 14, color: T.text, fontWeight: 500 }}>{payment.member}</span>
                    </div>
                  </td>

                  {/* Amount (payments.amount) */}
                  <td style={{ padding: "12px 14px", fontSize: 14, color: T.text, fontWeight: 700 }}>
                    {payment.amount}
                  </td>

                  {/* Payment method badge (payments.method) */}
                  {/* Online = blue, Cash = gold — per schema ENUM('cash','online') */}
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{
                      fontSize:     12,
                      padding:      "3px 10px",
                      borderRadius: 20,
                      fontWeight:   600,
                      background:   payment.method === "Online" ? T.blueBg  : T.goldBg,
                      color:        payment.method === "Online" ? T.blue    : T.gold,
                      border:       `1px solid ${payment.method === "Online" ? T.blue + "33" : T.goldBorder}`,
                    }}>
                      {payment.method}
                    </span>
                  </td>

                  {/* Transaction ID (payments.transaction_id) */}
                  <td style={{ padding: "12px 14px", fontSize: 12, color: T.textDim, fontFamily: "monospace" }}>
                    {payment.txn}
                  </td>

                  {/* Date (payments.created_at) */}
                  <td style={{ padding: "12px 14px", fontSize: 13, color: T.textMuted }}>
                    {payment.date}
                  </td>

                  {/* Status badge (payments.status) */}
                  <td style={{ padding: "12px 14px" }}>
                    <StatusBadge status={payment.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
