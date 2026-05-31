/**
 * ============================================================
 * WhatsAppSection.jsx — WhatsApp Automation Dashboard
 * ============================================================
 *
 * Displays the full WhatsApp automation system status:
 *   1. Cron job status cards (4 automated jobs)
 *   2. Message template editor (view + edit button)
 *   3. Today's message log table (from whatsapp_logs table)
 *
 * BACKEND INTEGRATION:
 *
 *   Cron Status  → GET /api/whatsapp/cron-status
 *   Response: [{ label, time, count, ok, nextRun }]
 *
 *   Templates    → GET  /api/whatsapp/templates
 *   Update       → PATCH /api/whatsapp/templates/:type
 *   Request body: { message: string }
 *
 *   Daily Logs   → GET /api/gyms/:gymId/whatsapp-logs?date=today
 *   Maps to: whatsapp_logs table
 *   Response per log:
 *   {
 *     id:               number,
 *     recipient:        string,  // whatsapp_logs.recipient_number
 *     member:           string,  // users.name (joined)
 *     type:             string,  // whatsapp_logs.message_type ENUM
 *     status:           string,  // whatsapp_logs.status
 *     time:             string,  // whatsapp_logs.sent_at
 *   }
 *
 * CRON SCHEDULE (from schema section 8):
 *   fee_reminder  → daily at 06:00 AM  → send_fee_reminders.php
 *   workout_plan  → daily at 07:00 AM  → send_workout_plans.php
 *   diet_plan     → daily at 08:00 AM  → send_diet_plans.php
 *   sub_warning   → daily at 09:00 AM  → send_sub_warnings.php
 *
 * WHATSAPP API:
 *   Twilio API or Meta Cloud API (see section 5.5 of schema doc)
 *   Failed messages retry up to 3 times automatically.
 * ============================================================
 */

import { Bell, Dumbbell, Utensils, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import Avatar      from "../ui/Avatar";
import StatusBadge from "../ui/StatusBadge";
import Card        from "../ui/Card";
import { whatsappLogs } from "../../data/mockData";
import T from "../../theme";

// ── Cron Job Config ────────────────────────────────────────
// TODO: Replace with live data from GET /api/whatsapp/cron-status
const CRON_JOBS = [
  {
    label: "Fee Reminders",
    time:  "06:00 AM",
    icon:  Bell,
    ok:    true,
    next:  "Tomorrow 6AM",
    // Condition from schema: members.end_date - TODAY <= 3 days AND status = 'active'
    note:  "Triggers 3 days before expiry",
  },
  {
    label: "Workout Plans",
    time:  "07:00 AM",
    icon:  Dumbbell,
    ok:    true,
    next:  "Tomorrow 7AM",
    // Condition: workout_plans record exists for member
    note:  "Sends if plan assigned",
  },
  {
    label: "Diet Plans",
    time:  "08:00 AM",
    icon:  Utensils,
    ok:    true,
    next:  "Tomorrow 8AM",
    // Condition: diet_plans record exists for member
    note:  "Sends if plan assigned",
  },
  {
    label: "Sub Warnings",
    time:  "09:00 AM",
    icon:  AlertTriangle,
    ok:    false,
    next:  "Retry pending",
    // Condition: subscriptions.end_date within 7, 3, or 1 days
    note:  "7 / 3 / 1 day warnings",
  },
];

// ── Message Templates ──────────────────────────────────────
// Maps to: whatsapp_logs.message_type ENUM values
// TODO: Load from GET /api/whatsapp/templates
const MESSAGE_TEMPLATES = [
  {
    type:    "Fee Reminder",
    // Full message from schema section 5.1
    message: "Dear [member_name], your membership fee expires on [end_date]. Please renew to continue access. — [Gym Name]",
  },
  {
    type:    "Sub Warning (7 days)",
    message: "Dear Owner, your gym subscription expires in 7 days. Renew to avoid service interruption.",
  },
  {
    type:    "Workout Plan",
    // Full message from schema section 5.3
    message: "Your workout plan for today: [workout_plans.title]. Details: [workout_plans.description]. Stay strong! 💪",
  },
  {
    type:    "Diet Plan",
    // Full message from schema section 5.4
    message: "Your diet plan: [diet_plans.title]. Details: [diet_plans.description]. Eat healthy! 🥗",
  },
];

// ── Message Type Badge Config ──────────────────────────────
// Maps whatsapp_logs.message_type ENUM to display colors
const MSG_TYPE_STYLE = {
  fee_reminder: { label: "Fee Reminder",  color: T.amber, bg: T.amberBg },
  sub_warning:  { label: "Sub Warning",   color: T.red,   bg: T.redBg   },
  workout_plan: { label: "Workout Plan",  color: T.blue,  bg: T.blueBg  },
  diet_plan:    { label: "Diet Plan",     color: T.green, bg: T.greenBg },
};

// Table column headers
const LOG_TABLE_HEADERS = ["Recipient", "Member", "Type", "Time", "Status"];

export default function WhatsAppSection() {
  return (
    <div>

      {/* ── Section Header ──────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: T.text, fontSize: 22, fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: 0 }}>
          WhatsApp Automation
        </h2>
        <p style={{ color: T.textMuted, fontSize: 14, margin: "4px 0 0" }}>
          Automated messaging cron jobs, templates & logs
        </p>
      </div>

      {/* ── Cron Job Status Cards ────────────────────── */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap:                 16,
        marginBottom:        24,
      }}>
        {CRON_JOBS.map((cron, i) => {
          const Icon = cron.icon;
          return (
            <Card
              key={i}
              // Glow red if cron is failing
              style={{ border: `1px solid ${cron.ok ? T.border : T.red + "40"}` }}
            >
              {/* Top row: icon + status indicator */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{
                  width:          36,
                  height:         36,
                  borderRadius:   10,
                  background:     cron.ok ? T.goldBg : T.redBg,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                }}>
                  <Icon size={18} color={cron.ok ? T.gold : T.red} />
                </div>

                {/* Online / Error status */}
                <div style={{
                  display:    "flex",
                  alignItems: "center",
                  gap:        6,
                  fontSize:   12,
                  color:      cron.ok ? T.green : T.red,
                  fontWeight: 600,
                }}>
                  {cron.ok ? <Wifi size={13} /> : <WifiOff size={13} />}
                  {cron.ok ? "Online" : "Error"}
                </div>
              </div>

              {/* Cron label + schedule */}
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'Syne', sans-serif" }}>
                {cron.label}
              </div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>
                Runs daily at {cron.time}
              </div>

              {/* Trigger condition note */}
              <div style={{ fontSize: 11, color: T.textDim, marginTop: 4 }}>
                {cron.note}
              </div>

              {/* Next run info */}
              <div style={{
                marginTop:    8,
                padding:      "6px 10px",
                background:   cron.ok ? T.goldBg : T.redBg,
                borderRadius: 8,
                fontSize:     11,
                color:        cron.ok ? T.gold : T.red,
                fontWeight:   600,
              }}>
                Next: {cron.next}
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── Message Templates ────────────────────────── */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{
          fontSize:   15,
          fontWeight: 700,
          color:      T.text,
          fontFamily: "'Syne', sans-serif",
          marginBottom: 4,
        }}>
          Message Templates
        </div>
        <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>
          Variables in [brackets] are replaced dynamically from the database
        </div>

        {MESSAGE_TEMPLATES.map((template, i) => (
          <div
            key={i}
            style={{
              padding:      "14px 0",
              borderBottom: i < MESSAGE_TEMPLATES.length - 1 ? `1px solid ${T.border}` : "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1 }}>
                {/* Template type label */}
                <div style={{
                  fontSize:      12,
                  color:         T.gold,
                  fontWeight:    700,
                  marginBottom:  6,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}>
                  {template.type}
                </div>

                {/* Template message body */}
                <div style={{
                  fontSize:   13,
                  color:      T.textMuted,
                  lineHeight: 1.7,
                  background: T.bgSecondary,
                  padding:    "10px 14px",
                  borderRadius: 10,
                  border:     `1px solid ${T.border}`,
                  fontFamily: "monospace",
                }}>
                  {template.message}
                </div>
              </div>

              {/* Edit button — TODO: open inline editor or modal */}
              <button style={{
                background:   T.goldBg,
                border:       `1px solid ${T.goldBorder}`,
                color:        T.gold,
                borderRadius: 8,
                padding:      "8px 16px",
                fontSize:     12,
                cursor:       "pointer",
                fontWeight:   600,
                flexShrink:   0,
                fontFamily:   "'DM Sans', sans-serif",
              }}>
                Edit
              </button>
            </div>
          </div>
        ))}
      </Card>

      {/* ── Today's WhatsApp Logs ────────────────────── */}
      {/* Maps to: whatsapp_logs table WHERE DATE(sent_at) = CURDATE() */}
      <Card>
        <div style={{
          fontSize:   15,
          fontWeight: 700,
          color:      T.text,
          fontFamily: "'Syne', sans-serif",
          marginBottom: 16,
        }}>
          Today's Message Logs
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {LOG_TABLE_HEADERS.map(header => (
                  <th key={header} style={{
                    padding:       "8px 14px",
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
              {whatsappLogs.map((log, index) => {
                const typeStyle = MSG_TYPE_STYLE[log.type] || MSG_TYPE_STYLE.fee_reminder;

                return (
                  <tr
                    key={log.id}
                    style={{ borderBottom: index < whatsappLogs.length - 1 ? `1px solid ${T.border}` : "none" }}
                    onMouseEnter={e => e.currentTarget.style.background = T.bgCardHover}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Recipient phone (whatsapp_logs.recipient_number) */}
                    <td style={{ padding: "11px 14px", fontSize: 13, color: T.textMuted, fontFamily: "monospace" }}>
                      {log.recipient}
                    </td>

                    {/* Member name (joined from users table) */}
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Avatar name={log.member} size={28} />
                        <span style={{ fontSize: 13, color: T.text }}>{log.member}</span>
                      </div>
                    </td>

                    {/* Message type (whatsapp_logs.message_type) */}
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{
                        fontSize:     11,
                        fontWeight:   600,
                        padding:      "3px 10px",
                        borderRadius: 20,
                        background:   typeStyle.bg,
                        color:        typeStyle.color,
                        border:       `1px solid ${typeStyle.color}33`,
                        textTransform: "capitalize",
                      }}>
                        {typeStyle.label}
                      </span>
                    </td>

                    {/* Sent time (whatsapp_logs.sent_at) */}
                    <td style={{ padding: "11px 14px", fontSize: 13, color: T.textMuted }}>
                      {log.time}
                    </td>

                    {/* Delivery status (whatsapp_logs.status) */}
                    <td style={{ padding: "11px 14px" }}>
                      <StatusBadge status={log.status} />
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
