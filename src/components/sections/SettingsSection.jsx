/**
 * ============================================================
 * SettingsSection.jsx — Gym Profile & System Configuration
 * ============================================================
 *
 * Allows the gym owner/admin to configure:
 *   1. Gym Profile   — name, address, phone (maps to gyms table)
 *   2. Plan & Billing — current plan, upgrade option
 *   3. WhatsApp API  — Twilio/Meta API key configuration
 *   4. Notifications — toggle which alerts are enabled
 *   5. Danger Zone   — suspend or delete account
 *
 * BACKEND INTEGRATION:
 *
 *   Gym Profile  → GET   /api/gyms/:gymId
 *                  PATCH /api/gyms/:gymId  { name, address, phone }
 *   Maps to: gyms table (id, name, email, phone, address, plan, status)
 *
 *   Plan Upgrade → POST /api/subscriptions/upgrade  { plan: 'premium' }
 *   Maps to: subscriptions table
 *
 *   WhatsApp API → PATCH /api/gyms/:gymId/settings  { whatsapp_api_key, whatsapp_provider }
 *   (Add a gym_settings table if needed for sensitive keys)
 *
 *   Suspend Gym  → PATCH /api/gyms/:gymId  { status: 'suspended' }
 *
 * SCHEMA NOTE:
 *   gyms.status ENUM: 'active' | 'expired' | 'suspended'
 *   gyms.plan   ENUM: 'basic'  | 'premium'
 * ============================================================
 */

import { useState } from "react";
import {
  Save, Shield, MessageSquare, Bell,
  AlertTriangle, ChevronRight, CheckCircle2, Zap,
} from "lucide-react";
import Card from "../ui/Card";
import T from "../../theme";

// ── Notification toggle settings ──────────────────────────
// Each maps to a WhatsApp cron job (see schema section 5)
const NOTIFICATION_SETTINGS = [
  { key: "feeReminder",  label: "Member Fee Expiry Reminders", desc: "Send 3 days before membership expires",      default: true  },
  { key: "subWarning",   label: "Subscription Expiry Warnings", desc: "Alert you 7, 3, 1 days before renewal",     default: true  },
  { key: "workoutPlan",  label: "Daily Workout Plan Messages",  desc: "Send workout plans to members every morning", default: true  },
  { key: "dietPlan",     label: "Daily Diet Plan Messages",     desc: "Send diet plans to members every morning",    default: false },
];

export default function SettingsSection() {

  // ── Gym profile form state ─────────────────────────────
  // TODO: Pre-fill from GET /api/gyms/:gymId
  const [gymForm, setGymForm] = useState({
    name:    "FitZone Pro",
    email:   "owner@fitzone.com",
    phone:   "+92-300-1234567",
    address: "Plot 14, Block B, DHA Phase 5, Karachi",
  });

  // ── WhatsApp API config state ──────────────────────────
  // TODO: Pre-fill from GET /api/gyms/:gymId/settings
  const [apiForm, setApiForm] = useState({
    provider: "twilio",   // "twilio" or "meta"
    apiKey:   "",         // Twilio Account SID or Meta Token
    apiSecret:"",         // Twilio Auth Token
    fromNumber: "",       // Registered WhatsApp number
  });

  // ── Notification toggles state ─────────────────────────
  const [notifications, setNotifications] = useState(
    Object.fromEntries(NOTIFICATION_SETTINGS.map(n => [n.key, n.default]))
  );

  // ── Save handler ───────────────────────────────────────
  // TODO: Call PATCH /api/gyms/:gymId with updated gymForm
  function handleSaveGym(e) {
    e.preventDefault();
    console.log("Save gym profile:", gymForm);
    // axios.patch(`/api/gyms/${gymId}`, gymForm)
  }

  // ── Toggle notification setting ────────────────────────
  // TODO: Call PATCH /api/gyms/:gymId/settings with updated flag
  function toggleNotification(key) {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div>

      {/* ── Section Header ──────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: T.text, fontSize: 22, fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: 0 }}>
          Settings
        </h2>
        <p style={{ color: T.textMuted, fontSize: 14, margin: "4px 0 0" }}>
          Gym profile, plan, and system configuration
        </p>
      </div>

      {/* ── 1. Gym Profile Form ──────────────────────── */}
      <Card style={{ marginBottom: 20 }}>
        <SectionTitle icon={Shield} label="Gym Profile" />
        <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 20 }}>
          This information is used in all WhatsApp messages and member-facing communications.
        </p>

        {/* Form grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          <FormField
            label="Gym Name"
            hint="gyms.name"
            value={gymForm.name}
            onChange={v => setGymForm(p => ({ ...p, name: v }))}
          />
          <FormField
            label="Owner Email"
            hint="gyms.email"
            value={gymForm.email}
            onChange={v => setGymForm(p => ({ ...p, email: v }))}
          />
          <FormField
            label="WhatsApp Phone"
            hint="gyms.phone — Used as sender number"
            value={gymForm.phone}
            onChange={v => setGymForm(p => ({ ...p, phone: v }))}
          />
          <FormField
            label="Address"
            hint="gyms.address"
            value={gymForm.address}
            onChange={v => setGymForm(p => ({ ...p, address: v }))}
          />
        </div>

        {/* Save button */}
        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
          <SaveButton onClick={handleSaveGym} />
        </div>
      </Card>

      {/* ── 2. Plan & Billing ────────────────────────── */}
      <Card style={{ marginBottom: 20 }}>
        <SectionTitle icon={Zap} label="Plan & Billing" />

        {/* Current plan info */}
        <div style={{
          background:   T.goldBg,
          border:       `1px solid ${T.goldBorder}`,
          borderRadius: 12,
          padding:      "16px 20px",
          display:      "flex",
          justifyContent: "space-between",
          alignItems:   "center",
          flexWrap:     "wrap",
          gap:          12,
          marginBottom: 16,
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.gold, fontFamily: "'Syne', sans-serif" }}>
              Premium Plan — Active
            </div>
            {/* TODO: Load from subscriptions.end_date */}
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>
              Renews on July 30, 2025 · PKR 8,500 / month
            </div>
          </div>
          <span style={{
            background:   T.goldBg,
            border:       `1px solid ${T.gold}`,
            color:        T.gold,
            borderRadius: 20,
            padding:      "4px 14px",
            fontSize:     12,
            fontWeight:   700,
          }}>
            ACTIVE
          </span>
        </div>

        {/* Plan comparison table */}
        {[
          { feature: "Max Members",        basic: "100",             premium: "Unlimited"        },
          { feature: "Cash Payments",      basic: "✓",               premium: "✓"                },
          { feature: "Online Payments",    basic: "✗",               premium: "✓"                },
          { feature: "WhatsApp Automation",basic: "✓ All features",  premium: "✓ All features"  },
          { feature: "Support Level",      basic: "Standard",        premium: "Priority"         },
        ].map((row, i) => (
          <div key={i} style={{
            display:       "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            padding:       "10px 0",
            borderBottom:  `1px solid ${T.border}`,
            alignItems:    "center",
          }}>
            <span style={{ fontSize: 13, color: T.textMuted }}>{row.feature}</span>
            <span style={{ fontSize: 13, color: T.textDim,   textAlign: "center" }}>{row.basic}</span>
            <span style={{ fontSize: 13, color: T.gold,      textAlign: "center", fontWeight: 600 }}>{row.premium}</span>
          </div>
        ))}
      </Card>

      {/* ── 3. WhatsApp API Configuration ───────────── */}
      <Card style={{ marginBottom: 20 }}>
        <SectionTitle icon={MessageSquare} label="WhatsApp API Configuration" />
        <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 20 }}>
          Configure Twilio or Meta Cloud API credentials for automated messaging.
          See schema section 5.5 for full details.
        </p>

        {/* Provider selector */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            API Provider
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {["twilio", "meta"].map(provider => (
              <button
                key={provider}
                onClick={() => setApiForm(p => ({ ...p, provider }))}
                style={{
                  background:   apiForm.provider === provider ? T.goldBg : T.bgSecondary,
                  border:       `1px solid ${apiForm.provider === provider ? T.goldBorder : T.border}`,
                  color:        apiForm.provider === provider ? T.gold : T.textMuted,
                  borderRadius: 10,
                  padding:      "9px 20px",
                  fontSize:     14,
                  fontWeight:   600,
                  cursor:       "pointer",
                  textTransform:"capitalize",
                  fontFamily:   "'DM Sans', sans-serif",
                }}
              >
                {provider === "twilio" ? "Twilio" : "Meta Cloud API"}
              </button>
            ))}
          </div>
        </div>

        {/* API credentials */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          <FormField
            label={apiForm.provider === "twilio" ? "Account SID" : "Access Token"}
            hint="Keep this secret — never expose in frontend"
            value={apiForm.apiKey}
            onChange={v => setApiForm(p => ({ ...p, apiKey: v }))}
            type="password"
            placeholder="••••••••••••••••"
          />
          {apiForm.provider === "twilio" && (
            <FormField
              label="Auth Token"
              hint="Twilio Auth Token from console"
              value={apiForm.apiSecret}
              onChange={v => setApiForm(p => ({ ...p, apiSecret: v }))}
              type="password"
              placeholder="••••••••••••••••"
            />
          )}
          <FormField
            label="From WhatsApp Number"
            hint="Registered sender number (e.g. +14155238886)"
            value={apiForm.fromNumber}
            onChange={v => setApiForm(p => ({ ...p, fromNumber: v }))}
            placeholder="+1 415 523 8886"
          />
        </div>

        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
          <SaveButton onClick={() => console.log("Save API config:", apiForm)} label="Save API Config" />
        </div>
      </Card>

      {/* ── 4. Notification Toggles ──────────────────── */}
      <Card style={{ marginBottom: 20 }}>
        <SectionTitle icon={Bell} label="Automated Notifications" />
        <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 20 }}>
          Toggle which automated WhatsApp messages are sent.
          All are enabled by default on both Basic and Premium plans.
        </p>

        {NOTIFICATION_SETTINGS.map((setting, i) => (
          <div
            key={setting.key}
            style={{
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "center",
              padding:        "14px 0",
              borderBottom:   i < NOTIFICATION_SETTINGS.length - 1 ? `1px solid ${T.border}` : "none",
              gap:            12,
            }}
          >
            <div>
              <div style={{ fontSize: 14, color: T.text, fontWeight: 500 }}>{setting.label}</div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>{setting.desc}</div>
            </div>

            {/* Toggle switch — TODO: PATCH /api/gyms/:gymId/settings on change */}
            <div
              onClick={() => toggleNotification(setting.key)}
              style={{
                width:        44,
                height:       24,
                borderRadius: 12,
                background:   notifications[setting.key] ? T.gold : T.bgSecondary,
                border:       `1px solid ${notifications[setting.key] ? T.gold : T.border}`,
                cursor:       "pointer",
                position:     "relative",
                transition:   "background 0.2s, border 0.2s",
                flexShrink:   0,
              }}
            >
              <div style={{
                width:      18,
                height:     18,
                borderRadius: "50%",
                background:  "#fff",
                position:    "absolute",
                top:         2,
                left:        notifications[setting.key] ? 22 : 2,
                transition:  "left 0.2s",
                boxShadow:   "0 1px 4px rgba(0,0,0,0.4)",
              }} />
            </div>
          </div>
        ))}
      </Card>

      {/* ── 5. Danger Zone ───────────────────────────── */}
      <Card style={{ border: `1px solid ${T.red}30` }}>
        <SectionTitle icon={AlertTriangle} label="Danger Zone" color={T.red} />
        <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 20 }}>
          These actions are irreversible. Please proceed with caution.
        </p>

        {[
          { label: "Suspend Gym Account",  desc: "Temporarily disable all gym operations. Members cannot log in.", action: "Suspend", color: T.amber },
          { label: "Delete Gym Account",   desc: "Permanently delete all gym data including members, payments, and logs.", action: "Delete",  color: T.red   },
        ].map((item, i) => (
          <div key={i} style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "center",
            padding:        "14px 0",
            borderBottom:   i === 0 ? `1px solid ${T.border}` : "none",
            gap:            12,
            flexWrap:       "wrap",
          }}>
            <div>
              <div style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>{item.desc}</div>
            </div>
            {/* TODO: Add confirmation dialog before calling PATCH/DELETE API */}
            <button style={{
              background:   "transparent",
              border:       `1px solid ${item.color}50`,
              color:        item.color,
              borderRadius: 10,
              padding:      "9px 18px",
              fontSize:     13,
              fontWeight:   600,
              cursor:       "pointer",
              fontFamily:   "'DM Sans', sans-serif",
            }}>
              {item.action}
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
 * SUB-COMPONENTS (used only inside SettingsSection)
 * ────────────────────────────────────────────────────────── */

/**
 * SectionTitle — Settings card heading row with icon
 */
function SectionTitle({ icon: Icon, label, color = T.gold }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{
        width:          34,
        height:         34,
        borderRadius:   10,
        background:     `${color}15`,
        border:         `1px solid ${color}30`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
      }}>
        <Icon size={16} color={color} />
      </div>
      <span style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'Syne', sans-serif" }}>
        {label}
      </span>
    </div>
  );
}

/**
 * FormField — Labeled input field for settings forms
 *
 * PROPS:
 *   label       (string) — Field label text
 *   hint        (string) — Small hint below the label (e.g. DB column name)
 *   value       (string) — Controlled value
 *   onChange    (fn)     — Called with new string value
 *   type        (string) — Input type (text/password). Default: "text"
 *   placeholder (string) — Input placeholder text
 */
function FormField({ label, hint, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 4, fontWeight: 500 }}>
        {label}
      </div>
      {hint && (
        <div style={{ fontSize: 10, color: T.textDim, marginBottom: 6, fontFamily: "monospace" }}>
          {hint}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width:        "100%",
          background:   T.bgSecondary,
          border:       `1px solid ${T.border}`,
          borderRadius: 10,
          padding:      "10px 14px",
          fontSize:     14,
          color:        T.text,
          outline:      "none",
          fontFamily:   "'DM Sans', sans-serif",
          boxSizing:    "border-box",
          transition:   "border 0.15s",
        }}
        onFocus={e  => e.target.style.border = `1px solid ${T.goldBorder}`}
        onBlur={e   => e.target.style.border = `1px solid ${T.border}`}
      />
    </div>
  );
}

/**
 * SaveButton — Gold primary save/submit button
 */
function SaveButton({ onClick, label = "Save Changes" }) {
  return (
    <button
      onClick={onClick}
      style={{
        background:   `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
        color:        "#07090F",
        border:       "none",
        borderRadius: 10,
        padding:      "10px 24px",
        fontSize:     14,
        fontWeight:   700,
        cursor:       "pointer",
        display:      "flex",
        alignItems:   "center",
        gap:          8,
        fontFamily:   "'DM Sans', sans-serif",
      }}
    >
      <Save size={15} />
      {label}
    </button>
  );
}
