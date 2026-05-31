/**
 * ============================================================
 * App.jsx — Root Application Component
 * ============================================================
 *
 * The top-level component that:
 *   1. Holds the active section state (client-side routing)
 *   2. Renders the Layout shell (Sidebar + Header)
 *   3. Dynamically renders the active section component
 *
 * SECTION ROUTING:
 *   This uses simple useState-based routing (no React Router).
 *   If you add React Router later, replace `activeSection` state
 *   with `useParams()` or `useLocation()` and update Layout
 *   to use <Link> components instead of onClick handlers.
 *
 * GLOBAL STYLES:
 *   - Google Fonts (Syne + DM Sans) loaded via <style> tag
 *   - Custom scrollbar styling applied globally
 *   - Box-sizing reset
 *   - These could be moved to index.css if preferred
 *
 * ADD A NEW SECTION:
 *   1. Create a new file in src/components/sections/
 *   2. Import it here
 *   3. Add a case to SECTION_MAP below
 *   4. Add the nav item in src/components/layout/Sidebar.jsx
 * ============================================================
 */

import Layout from "./components/layout/Layout";

// ── Section imports ────────────────────────────────────────
import DashboardSection from "./components/sections/DashboardSection";
import MembersSection   from "./components/sections/MembersSection";
import TrainersSection  from "./components/sections/TrainersSection";
import PaymentsSection  from "./components/sections/PaymentsSection";
import AttendanceSection from "./components/sections/AttendanceSection";
import WhatsAppSection  from "./components/sections/WhatsAppSection";
import ExpensesSection  from "./components/sections/ExpensesSection";
import SettingsSection  from "./components/sections/SettingsSection";

import { useState } from "react";

// ── Section map: section ID → component ───────────────────
// Add new sections here as the app grows
const SECTION_MAP = {
  dashboard:  <DashboardSection  />,
  members:    <MembersSection    />,
  trainers:   <TrainersSection   />,
  payments:   <PaymentsSection   />,
  attendance: <AttendanceSection />,
  whatsapp:   <WhatsAppSection   />,
  expenses:   <ExpensesSection   />,
  settings:   <SettingsSection   />,
};

export default function App() {
  // Active section — controls which component is rendered in main
  // TODO: If using React Router, replace with useNavigate() + route params
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <>
      {/* ── Global Styles ─────────────────────────────── */}
      {/* Google Fonts + scrollbar + box-sizing reset      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin:     0;
          padding:    0;
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background:  #07090F;
        }

        /* Custom scrollbar — thin gold-tinted style */
        ::-webkit-scrollbar       { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(201,151,58,0.3); }

        /* Placeholder text color */
        input::placeholder { color: #4A5168; }

        /* Remove default input number arrows */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
      `}</style>

      {/* ── App Shell ─────────────────────────────────── */}
      <Layout
        activeSection={activeSection}
        onNavigate={setActiveSection}
      >
        {/* Render the active section — falls back to Dashboard */}
        {SECTION_MAP[activeSection] || SECTION_MAP.dashboard}
      </Layout>
    </>
  );
}
