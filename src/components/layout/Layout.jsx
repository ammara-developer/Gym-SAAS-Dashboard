/**
 * ============================================================
 * Layout.jsx — Master Page Layout Wrapper
 * ============================================================
 *
 * Composes the full page shell:
 *   [Sidebar] + [Header + Main Content]
 *
 * Manages:
 *   - Sidebar open/close state (for mobile)
 *   - Window resize listener to detect mobile breakpoint
 *   - Mobile overlay (dark backdrop behind open sidebar)
 *
 * PROPS:
 *   children        (ReactNode) — The active section component
 *   activeSection   (string)    — Current section ID
 *   onNavigate      (function)  — Section change handler
 *
 * BREAKPOINT:
 *   Mobile = viewport width < 900px
 *   At mobile, the sidebar becomes a slide-in overlay.
 *
 * USAGE (in App.jsx):
 *   <Layout activeSection={active} onNavigate={setActive}>
 *     <DashboardSection />
 *   </Layout>
 * ============================================================
 */

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header  from "./Header";
import T from "../../theme";

const MOBILE_BREAKPOINT = 900; // px

export default function Layout({ children, activeSection, onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile,    setIsMobile]    = useState(false);

  // Listen for window resize and update mobile flag
  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    }
    checkMobile(); // Run once on mount
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar when navigating on mobile
  function handleNavigate(sectionId) {
    onNavigate(sectionId);
    if (isMobile) setSidebarOpen(false);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bgPrimary }}>

      {/* ── Mobile Backdrop Overlay ───────────────────── */}
      {/* Shown behind the sidebar on mobile when open.
          Clicking it closes the sidebar. */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position:   "fixed",
            inset:      0,
            background: "rgba(0,0,0,0.7)",
            zIndex:     40,
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────── */}
      <Sidebar
        active={activeSection}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        isMobile={isMobile}
      />

      {/* ── Main Content Area ─────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Sticky top bar */}
        <Header
          activeSection={activeSection}
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
          isMobile={isMobile}
        />

        {/* Page content — scrollable */}
        <main
          style={{
            flex:      1,
            padding:   isMobile ? "20px 16px" : "28px 28px",
            overflowY: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
