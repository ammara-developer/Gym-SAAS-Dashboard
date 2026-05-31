/**
 * ============================================================
 * StatusBadge.jsx — Colored Status Pill Component
 * ============================================================
 *
 * Renders a small pill/badge with color-coded status text.
 * Used in: Members table, Payments table, WhatsApp logs table.
 *
 * PROPS:
 *   status (string) — one of:
 *     "active"   → green   (members.status = 'active')
 *     "expiring" → amber   (members.end_date within 3 days)
 *     "expired"  → red     (members.status = 'expired')
 *     "success"  → green   (payments.status = 'success')
 *     "pending"  → amber   (payments.status = 'pending')
 *     "failed"   → red     (payments.status = 'failed')
 *     "sent"     → green   (whatsapp_logs.status = 'sent')
 *
 * USAGE:
 *   <StatusBadge status="active" />
 *   <StatusBadge status={member.status} />
 * ============================================================
 */

import T from "../../theme";

const STATUS_CONFIG = {
  active:   { bg: T.greenBg, color: T.green, label: "Active"   },
  expiring: { bg: T.amberBg, color: T.amber, label: "Expiring" },
  expired:  { bg: T.redBg,   color: T.red,   label: "Expired"  },
  success:  { bg: T.greenBg, color: T.green, label: "Success"  },
  pending:  { bg: T.amberBg, color: T.amber, label: "Pending"  },
  failed:   { bg: T.redBg,   color: T.red,   label: "Failed"   },
  sent:     { bg: T.greenBg, color: T.green, label: "Sent"     },
};

export default function StatusBadge({ status }) {
  // Fall back to "active" style if an unknown status is passed
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.active;

  return (
    <span
      style={{
        background:     config.bg,
        color:          config.color,
        border:         `1px solid ${config.color}33`,
        fontSize:       11,
        fontWeight:     600,
        letterSpacing:  "0.04em",
        padding:        "3px 10px",
        borderRadius:   20,
        textTransform:  "uppercase",
        display:        "inline-block",
      }}
    >
      {config.label}
    </span>
  );
}
