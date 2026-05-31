/**
 * ============================================================
 * ExpensesSection.jsx — Gym Operating Expenses Tracker
 * ============================================================
 *
 * Tracks and displays all gym operational expenses.
 * Features:
 *   - Monthly expense summary stats
 *   - Expense breakdown bar chart by category
 *   - Full expenses table (sortable by date)
 *   - "Add Expense" button
 *
 * BACKEND INTEGRATION:
 *   Data source → GET /api/gyms/:gymId/expenses?month=2025-06
 *   Maps to: expenses table
 *   Expected response shape (per expense):
 *   {
 *     id:       number,  // expenses.id
 *     title:    string,  // expenses.title
 *     amount:   number,  // expenses.amount (DECIMAL 10,2)
 *     date:     string,  // expenses.date (YYYY-MM-DD)
 *     category: string,  // optional: add a category column to expenses table
 *   }
 *
 *   Monthly summary → GET /api/gyms/:gymId/expenses/summary?month=2025-06
 *   Response: { total, highest, count, avgPerDay }
 *
 *   Add Expense    → POST   /api/expenses  { gym_id, title, amount, date }
 *   Delete Expense → DELETE /api/expenses/:id
 *
 * SCHEMA NOTE:
 *   expenses table: id, gym_id, title (VARCHAR), amount (DECIMAL), date (DATE)
 *   Consider adding a "category" ENUM column for better grouping/reporting.
 * ============================================================
 */

import { useState } from "react";
import { Plus, TrendingDown, Trash2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import Card          from "../ui/Card";
import CustomTooltip from "../charts/CustomTooltip";
import T from "../../theme";

// ── Mock expense records ───────────────────────────────────
// TODO: Replace with API data from GET /api/expenses?month=2025-06
const MOCK_EXPENSES = [
  { id: 1,  title: "Electricity Bill",      amount: 12500, date: "2025-06-01", category: "Utilities"   },
  { id: 2,  title: "Equipment Maintenance", amount: 8000,  date: "2025-06-03", category: "Equipment"   },
  { id: 3,  title: "Staff Salaries",        amount: 45000, date: "2025-06-05", category: "Salaries"    },
  { id: 4,  title: "Gym Cleaning Service",  amount: 3500,  date: "2025-06-08", category: "Maintenance" },
  { id: 5,  title: "Water & Beverages",     amount: 2000,  date: "2025-06-10", category: "Supplies"    },
  { id: 6,  title: "Internet Bill",         amount: 1500,  date: "2025-06-12", category: "Utilities"   },
  { id: 7,  title: "New Dumbbell Set",      amount: 15000, date: "2025-06-15", category: "Equipment"   },
  { id: 8,  title: "Marketing / Flyers",    amount: 4000,  date: "2025-06-18", category: "Marketing"   },
];

// ── Bar chart data: expenses by category ──────────────────
// TODO: Compute from API aggregation
const CATEGORY_CHART_DATA = [
  { category: "Salaries",    amount: 45000 },
  { category: "Equipment",   amount: 23000 },
  { category: "Utilities",   amount: 14000 },
  { category: "Maintenance", amount: 3500  },
  { category: "Marketing",   amount: 4000  },
  { category: "Supplies",    amount: 2000  },
];

// ── Summary stats ──────────────────────────────────────────
const totalExpenses = MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0);

// Category color map for the table badges
const CATEGORY_COLORS = {
  Utilities:   { color: T.blue,  bg: T.blueBg  },
  Equipment:   { color: T.gold,  bg: T.goldBg  },
  Salaries:    { color: T.green, bg: T.greenBg },
  Maintenance: { color: T.amber, bg: T.amberBg },
  Supplies:    { color: T.blue,  bg: T.blueBg  },
  Marketing:   { color: "#9B6AE8", bg: "rgba(155,106,232,0.1)" },
};

const TABLE_HEADERS = ["Title", "Category", "Amount", "Date", ""];

export default function ExpensesSection() {
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);

  // Remove expense locally — TODO: call DELETE /api/expenses/:id
  function handleDelete(id) {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }

  return (
    <div>

      {/* ── Section Header ──────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ color: T.text, fontSize: 22, fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: 0 }}>
            Expenses
          </h2>
          <p style={{ color: T.textMuted, fontSize: 14, margin: "4px 0 0" }}>
            Monthly operating costs — June 2025
          </p>
        </div>

        {/* Add Expense CTA — TODO: open modal with form */}
        <button style={{
          background:   `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
          color:        "#07090F",
          border:       "none",
          borderRadius: 10,
          padding:      "10px 20px",
          fontSize:     14,
          fontWeight:   700,
          cursor:       "pointer",
          display:      "flex",
          alignItems:   "center",
          gap:          8,
          fontFamily:   "'DM Sans', sans-serif",
        }}>
          <Plus size={16} /> Add Expense
        </button>
      </div>

      {/* ── Summary Stat Cards ───────────────────────── */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap:                 16,
        marginBottom:        24,
      }}>
        {[
          { label: "Total Expenses",    value: `PKR ${(totalExpenses).toLocaleString()}`, color: T.red   },
          { label: "Highest Category",  value: "Salaries",                                 color: T.gold  },
          { label: "Total Entries",     value: `${expenses.length} items`,                color: T.blue  },
          { label: "Avg Per Entry",     value: `PKR ${Math.round(totalExpenses / expenses.length).toLocaleString()}`, color: T.amber },
        ].map((stat, i) => (
          <Card key={i}>
            <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: stat.color, marginTop: 8, fontFamily: "'Syne', sans-serif" }}>
              {stat.value}
            </div>
          </Card>
        ))}
      </div>

      {/* ── Expenses by Category Bar Chart ───────────── */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>
          Expenses by Category
        </div>
        <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 20 }}>June 2025 breakdown</div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={CATEGORY_CHART_DATA} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fill: T.textMuted, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: T.textMuted, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" name="Amount" fill={T.gold} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* ── Expenses Table ───────────────────────────── */}
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
              {expenses.map((expense, index) => {
                const catStyle = CATEGORY_COLORS[expense.category] || { color: T.textMuted, bg: T.bgSecondary };

                return (
                  <tr
                    key={expense.id}
                    style={{ borderBottom: index < expenses.length - 1 ? `1px solid ${T.border}` : "none" }}
                    onMouseEnter={e => e.currentTarget.style.background = T.bgCardHover}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Expense title (expenses.title) */}
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width:          32,
                          height:         32,
                          borderRadius:   8,
                          background:     catStyle.bg,
                          display:        "flex",
                          alignItems:     "center",
                          justifyContent: "center",
                          flexShrink:     0,
                        }}>
                          <TrendingDown size={15} color={catStyle.color} />
                        </div>
                        <span style={{ fontSize: 14, color: T.text, fontWeight: 500 }}>{expense.title}</span>
                      </div>
                    </td>

                    {/* Category badge (add category column to expenses table) */}
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        fontSize:     12,
                        fontWeight:   600,
                        padding:      "3px 10px",
                        borderRadius: 20,
                        background:   catStyle.bg,
                        color:        catStyle.color,
                        border:       `1px solid ${catStyle.color}33`,
                      }}>
                        {expense.category}
                      </span>
                    </td>

                    {/* Amount (expenses.amount) */}
                    <td style={{ padding: "12px 14px", fontSize: 14, color: T.red, fontWeight: 700 }}>
                      PKR {expense.amount.toLocaleString()}
                    </td>

                    {/* Date (expenses.date) */}
                    <td style={{ padding: "12px 14px", fontSize: 13, color: T.textMuted }}>
                      {expense.date}
                    </td>

                    {/* Delete action */}
                    {/* TODO: Call DELETE /api/expenses/:id with confirmation dialog */}
                    <td style={{ padding: "12px 14px" }}>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        style={{
                          background:   "none",
                          border:       "none",
                          cursor:       "pointer",
                          color:        T.textDim,
                          display:      "flex",
                          padding:      4,
                          borderRadius: 6,
                          transition:   "color 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = T.red}
                        onMouseLeave={e => e.currentTarget.style.color = T.textDim}
                        title="Delete expense"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
