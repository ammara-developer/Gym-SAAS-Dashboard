/**
 * ============================================================
 * StatCard.jsx — KPI / Metric Summary Card
 * ============================================================
 *
 * Displays a single key metric: icon, value, label, and a
 * percentage change indicator (up = green, down = red).
 *
 * Used on the Dashboard overview in a 4-column responsive grid.
 *
 * PROPS:
 *   icon        (LucideIcon) — Icon component from lucide-react
 *   label       (string)     — Metric description, e.g. "Total Members"
 *   value       (string)     — Display value, e.g. "247" or "PKR 1.2M"
 *   change      (string)     — Change amount, e.g. "12%" or "3"
 *   changeType  (string)     — "up" → green arrow | "down" → red arrow
 *   accent      (string)     — Hex color for the icon background tint
 *
 * BACKEND NOTE:
 *   These values should come from aggregate API responses:
 *   - Total Members  → SELECT COUNT(*) FROM members WHERE status='active'
 *   - Monthly Revenue → SELECT SUM(amount) FROM payments WHERE MONTH(created_at) = ?
 *   - Active Today   → SELECT COUNT(*) FROM attendance WHERE date = CURDATE()
 *   - Expiring Soon  → SELECT COUNT(*) FROM members WHERE end_date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY)
 *
 * USAGE:
 *   <StatCard
 *     icon={Users}
 *     label="Total Members"
 *     value="247"
 *     change="12%"
 *     changeType="up"
 *     accent={T.gold}
 *   />
 * ============================================================
 */

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Card from "./Card";
import T from "../../theme";

export default function StatCard({ icon: Icon, label, value, change, changeType, accent }) {
  const isUp = changeType === "up";

  return (
    <Card style={{ position: "relative", overflow: "hidden" }}>

      {/* Decorative background circle (purely visual) */}
      <div
        style={{
          position:     "absolute",
          top:          -20,
          right:        -20,
          width:        100,
          height:       100,
          borderRadius: "50%",
          background:   `${accent}0A`,
          pointerEvents: "none",
        }}
      />

      {/* Top row: Icon + Change indicator */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>

        {/* Tinted icon box */}
        <div
          style={{
            width:          42,
            height:         42,
            borderRadius:   12,
            background:     `${accent}18`,
            border:         `1px solid ${accent}30`,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
          }}
        >
          <Icon size={20} color={accent} />
        </div>

        {/* Percent change badge */}
        <span
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        4,
            fontSize:   12,
            color:      isUp ? T.green : T.red,
            fontWeight: 600,
          }}
        >
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </span>
      </div>

      {/* Bottom: Metric value + label */}
      <div style={{ marginTop: 16 }}>
        <div
          style={{
            fontSize:   26,
            fontWeight: 700,
            color:      T.text,
            fontFamily: "'Syne', sans-serif",
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>
          {label}
        </div>
      </div>
    </Card>
  );
}
