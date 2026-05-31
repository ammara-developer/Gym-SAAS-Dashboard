/**
 * ============================================================
 * Sidebar.jsx — Main Navigation Sidebar
 * ============================================================
 *
 * Left-side navigation panel containing:
 *   - Gym logo & name
 *   - Navigation menu (all sections)
 *   - Current subscription plan info card
 *   - Logged-in user info + logout button
 *
 * RESPONSIVE BEHAVIOR:
 *   - Desktop (≥900px): Sticky, always visible on the left
 *   - Mobile  (<900px): Fixed overlay, slides in/out via `isOpen`
 *     The parent (Layout.jsx) controls open/close state.
 *
 * PROPS:
 *   active      (string)   — Currently active section ID (e.g. "dashboard")
 *   onNavigate  (function) — Called with section ID when a nav item is clicked
 *   isOpen      (boolean)  — Whether sidebar is visible on mobile
 *   isMobile    (boolean)  — True when viewport width < 900px
 *
 * BACKEND NOTE:
 *   The gym name "FitZone" and plan "PRO PLAN" should come from:
 *     GET /api/gyms/:gymId  → { name, plan, subscription.end_date }
 *   The logged-in user "Owais Siddiqui" should come from:
 *     GET /api/auth/me      → { name, role }
 *
 * USAGE:
 *   <Sidebar
 *     active={activeSection}
 *     onNavigate={setActiveSection}
 *     isOpen={sidebarOpen}
 *     isMobile={isMobile}
 *   />
 * ============================================================
 */

import {
  LayoutDashboard, Users, Dumbbell, CreditCard, CalendarCheck,
  MessageSquare, TrendingUp, Settings, Shield, Clock, LogOut,
} from "lucide-react";
import Avatar from "../ui/Avatar";
import T from "../../theme";

// ── Navigation Items Config ────────────────────────────────
// Each item maps to a section rendered in the main content area.
// `id` must match the keys used in App.jsx's section router.
const NAV_ITEMS = [
  { id: "dashboard",  icon: LayoutDashboard, label: "Dashboard"            },
  { id: "members",    icon: Users,           label: "Members"              },
  { id: "trainers",   icon: Dumbbell,        label: "Trainers"             },
  { id: "payments",   icon: CreditCard,      label: "Payments"             },
  { id: "attendance", icon: CalendarCheck,   label: "Attendance"           },
  { id: "whatsapp",   icon: MessageSquare,   label: "WhatsApp Automation"  },
  { id: "expenses",   icon: TrendingUp,      label: "Expenses"             },
  { id: "settings",   icon: Settings,        label: "Settings"             },
];

const SIDEBAR_WIDTH = 240; // px

export default function Sidebar({ active, onNavigate, isOpen, isMobile }) {

  // Handle nav item click — navigate + close sidebar on mobile
  function handleNav(id) {
    onNavigate(id);
    if (isMobile) onNavigate(id); // parent will also close the sidebar
  }

  return (
    <aside
      style={{
        width:         SIDEBAR_WIDTH,
        background:    T.bgSecondary,
        borderRight:   `1px solid ${T.border}`,
        display:       "flex",
        flexDirection: "column",
        // Sticky on desktop, fixed overlay on mobile
        position:      isMobile ? "fixed" : "sticky",
        top:           0,
        height:        "100vh",
        zIndex:        50,
        // Slide in/out animation for mobile
        transform:     isMobile
          ? (isOpen ? "translateX(0)" : `translateX(-${SIDEBAR_WIDTH}px)`)
          : "none",
        transition:    "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        overflowY:     "auto",
      }}
    >
      {/* ── Logo & Gym Name ───────────────────────────── */}
      <div
        style={{
          padding:      "24px 20px 20px",
          borderBottom: `1px solid ${T.border}`,
          flexShrink:   0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Brand icon box */}
          <div
            style={{
              width:          38,
              height:         38,
              borderRadius:   12,
              background:     `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
            }}
          >
            <Dumbbell size={20} color="#07090F" />
          </div>

          <div>
            {/* TODO: Replace with gym.name from API */}
            <div style={{ fontSize: 16, fontWeight: 800, color: T.text, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
              FitZone
            </div>
            {/* TODO: Replace with gym.plan from API (uppercased) */}
            <div style={{ fontSize: 11, color: T.gold, fontWeight: 600, letterSpacing: "0.06em" }}>
              PRO PLAN
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation Menu ───────────────────────────── */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        {/* Section heading */}
        <div
          style={{
            fontSize:      10,
            color:         T.textDim,
            fontWeight:    700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding:       "0 8px",
            marginBottom:  8,
          }}
        >
          Main Menu
        </div>

        {NAV_ITEMS.map(item => {
          const Icon     = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = T.border; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          12,
                width:        "100%",
                padding:      "10px 12px",
                borderRadius: 10,
                marginBottom: 2,
                border:       "none",
                // Gold left accent border on active item
                borderLeft:   isActive ? `3px solid ${T.gold}` : "3px solid transparent",
                background:   isActive ? T.goldBg : "transparent",
                color:        isActive ? T.goldBright : T.textMuted,
                cursor:       "pointer",
                fontFamily:   "'DM Sans', sans-serif",
                fontSize:     14,
                fontWeight:   isActive ? 600 : 400,
                textAlign:    "left",
                transition:   "all 0.15s",
              }}
            >
              <Icon size={17} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* ── Subscription Info Card ────────────────────── */}
      {/* TODO: Replace static date with subscription.end_date from API */}
      <div style={{ padding: 12, flexShrink: 0 }}>
        <div
          style={{
            background:   `linear-gradient(135deg, ${T.goldGlow}, rgba(201,151,58,0.05))`,
            border:       `1px solid ${T.goldBorder}`,
            borderRadius: 14,
            padding:      "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Shield size={14} color={T.gold} />
            <span style={{ fontSize: 12, fontWeight: 700, color: T.gold }}>Premium Plan</span>
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.6 }}>
            Unlimited members · Online payments · Priority support
          </div>
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={11} color={T.textDim} />
            {/* TODO: Format subscription.end_date from API */}
            <span style={{ fontSize: 11, color: T.textDim }}>Renews: Jul 30, 2025</span>
          </div>
        </div>

        {/* ── Logged-in User Row ─────────────────────── */}
        {/* TODO: Replace with auth user data from context or API */}
        <div
          style={{
            display:     "flex",
            alignItems:  "center",
            gap:         10,
            padding:     "14px 4px 6px",
            borderTop:   `1px solid ${T.border}`,
            marginTop:   10,
          }}
        >
          <Avatar name="Owais Siddiqui" size={34} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>Owais Siddiqui</div>
            <div style={{ fontSize: 11, color: T.textMuted }}>Admin · Owner</div>
          </div>
          {/* TODO: Wire up logout → POST /api/auth/logout */}
          <button
            style={{ background: "none", border: "none", cursor: "pointer", color: T.textDim }}
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
