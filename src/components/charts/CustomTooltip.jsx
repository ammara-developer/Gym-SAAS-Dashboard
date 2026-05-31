/**
 * ============================================================
 * CustomTooltip.jsx — Recharts Custom Tooltip
 * ============================================================
 *
 * Replaces Recharts' default tooltip with a dark-themed one
 * that matches the dashboard's color palette.
 *
 * Recharts automatically passes these props when the tooltip
 * is hovered over on a chart:
 *
 * PROPS (injected by Recharts):
 *   active  (boolean)  — True when hovering over a data point
 *   payload (array)    — Array of { name, value, color } objects
 *   label   (string)   — X-axis label at the hovered position
 *
 * NUMBER FORMATTING:
 *   Values > 999 are formatted as "PKR XXK" (e.g., 42000 → "PKR 42K")
 *   to keep tooltips compact on revenue/expense charts.
 *   For attendance counts, the raw number is shown as-is.
 *
 * USAGE (inside a Recharts chart):
 *   import CustomTooltip from "../charts/CustomTooltip";
 *   <Tooltip content={<CustomTooltip />} />
 * ============================================================
 */

import T from "../../theme";

export default function CustomTooltip({ active, payload, label }) {
  // Recharts passes active=false when not hovering — render nothing
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background:   "#1A1F2E",
        border:       `1px solid ${T.goldBorder}`,
        borderRadius: 10,
        padding:      "10px 14px",
        fontSize:     13,
      }}
    >
      {/* X-axis label (month name, day name, etc.) */}
      <div style={{ color: T.textMuted, marginBottom: 6 }}>{label}</div>

      {/* One row per data series */}
      {payload.map((entry, i) => (
        <div key={i} style={{ color: entry.color, fontWeight: 600 }}>
          {entry.name}:{" "}
          {/* Format large numbers as "PKR XXK", keep small numbers raw */}
          {typeof entry.value === "number" && entry.value > 999
            ? `PKR ${(entry.value / 1000).toFixed(0)}K`
            : entry.value}
        </div>
      ))}
    </div>
  );
}
