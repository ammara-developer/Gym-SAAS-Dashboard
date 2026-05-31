/**
 * ============================================================
 * Header.jsx — Top Navigation Bar
 * ============================================================
 *
 * Sticky top bar containing:
 *   - Hamburger menu button (mobile only)
 *   - Current section title + today's date
 *   - Global search input
 *   - Notification bell (with unread indicator)
 *   - User avatar + dropdown trigger
 *
 * PROPS:
 *   activeSection (string)   — ID of current section (e.g. "members")
 *   onMenuToggle  (function) — Toggles sidebar open/close on mobile
 *   isMobile      (boolean)  — True when viewport width < 900px
 *
 * BACKEND NOTE:
 *   - Notification count (red dot) should come from:
 *       GET /api/notifications/unread-count → { count }
 *   - Search input should call:
 *       GET /api/search?q={query}&gym_id={gymId}
 *   - Today's date is rendered client-side; for server-side
 *     consistency use the server's timezone if needed.
 *
 * USAGE:
 *   <Header
 *     activeSection="members"
 *     onMenuToggle={() => setSidebarOpen(prev => !prev)}
 *     isMobile={isMobile}
 *   />
 * ============================================================
 */

import { Bell, Menu, Search, ChevronDown } from "lucide-react";
import Avatar from "../ui/Avatar";
import T from "../../theme";

// Maps section ID → display label (must match NAV_ITEMS in Sidebar.jsx)
const SECTION_LABELS = {
  dashboard:  "Dashboard",
  members:    "Members",
  trainers:   "Trainers",
  payments:   "Payments",
  attendance: "Attendance",
  whatsapp:   "WhatsApp Automation",
  expenses:   "Expenses",
  settings:   "Settings",
};

// Format today's date as "Saturday, June 1, 2025"
function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year:    "numeric",
    month:   "long",
    day:     "numeric",
  });
}

export default function Header({ activeSection, onMenuToggle, isMobile }) {
  return (
    <header
      style={{
        background:    T.bgSecondary,
        borderBottom:  `1px solid ${T.border}`,
        padding:       "14px 24px",
        display:       "flex",
        alignItems:    "center",
        justifyContent:"space-between",
        position:      "sticky",
        top:           0,
        zIndex:        30,
        flexShrink:    0,
      }}
    >
      {/* ── Left: Hamburger (mobile) + Section Title ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

        {/* Hamburger — visible only on mobile */}
        {isMobile && (
          <button
            onClick={onMenuToggle}
            style={{
              background:   T.bgCard,
              border:       `1px solid ${T.border}`,
              borderRadius: 10,
              padding:      8,
              cursor:       "pointer",
              color:        T.text,
              display:      "flex",
            }}
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>
        )}

        {/* Section title + current date */}
        <div>
          <div
            style={{
              fontSize:   15,
              fontWeight: 700,
              color:      T.text,
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {SECTION_LABELS[activeSection] || "Dashboard"}
          </div>
          <div style={{ fontSize: 12, color: T.textMuted }}>
            {getFormattedDate()}
          </div>
        </div>
      </div>

      {/* ── Right: Search + Bell + Avatar ─────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

        {/* Global search input */}
        {/* TODO: Debounce and call GET /api/search?q=... */}
        <div
          style={{
            display:      "flex",
            alignItems:   "center",
            gap:          8,
            background:   T.bgCard,
            border:       `1px solid ${T.border}`,
            borderRadius: 10,
            padding:      "8px 14px",
          }}
        >
          <Search size={14} color={T.textMuted} />
          <input
            placeholder="Quick search…"
            style={{
              background: "none",
              border:     "none",
              outline:    "none",
              color:      T.text,
              fontSize:   13,
              // Narrower on mobile to save space
              width:      isMobile ? 80 : 160,
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>

        {/* Notification bell */}
        {/* TODO: Replace red dot with real unread count from API */}
        <button
          style={{
            position:     "relative",
            background:   T.bgCard,
            border:       `1px solid ${T.border}`,
            borderRadius: 10,
            padding:      9,
            cursor:       "pointer",
            color:        T.textMuted,
            display:      "flex",
          }}
          aria-label="Notifications"
        >
          <Bell size={18} />
          {/* Unread indicator dot */}
          <span
            style={{
              position:     "absolute",
              top:          6,
              right:        6,
              width:        8,
              height:       8,
              background:   T.red,
              borderRadius: "50%",
              border:       `2px solid ${T.bgSecondary}`,
            }}
          />
        </button>

        {/* User avatar + dropdown trigger */}
        {/* TODO: Replace with auth user from context */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <Avatar name="Owais Siddiqui" size={34} />
          {/* Hide chevron on mobile to save space */}
          {!isMobile && <ChevronDown size={14} color={T.textMuted} />}
        </div>
      </div>
    </header>
  );
}
