/**
 * ============================================================
 * Card.jsx — Base Surface / Container Card
 * ============================================================
 *
 * The standard dark card used throughout the dashboard.
 * Wraps any content in a styled rounded surface.
 *
 * PROPS:
 *   children  (ReactNode) — Content to render inside the card
 *   style     (object)    — Optional extra inline styles (merged)
 *   glow      (boolean)   — If true, adds a gold border + glow shadow
 *                           Use for featured/highlighted cards
 *
 * USAGE:
 *   <Card>
 *     <p>Normal card content</p>
 *   </Card>
 *
 *   <Card glow>
 *     <p>Highlighted card (gold border)</p>
 *   </Card>
 *
 *   <Card style={{ minHeight: 300 }}>
 *     <p>Card with extra styles</p>
 *   </Card>
 * ============================================================
 */

import T from "../../theme";

export default function Card({ children, style = {}, glow = false, ...rest }) {
  return (
    <div
      style={{
        background:   T.bgCard,
        // Gold border when glow=true, subtle default border otherwise
        border:       glow
          ? `1px solid ${T.goldBorder}`
          : `1px solid ${T.border}`,
        borderRadius: 16,
        padding:      "1.25rem",
        // Soft gold glow for featured cards
        boxShadow:    glow ? `0 0 32px ${T.goldGlow}` : "none",
        ...style,
      }}
      {...rest}  // Passes through onClick, onMouseEnter, etc.
    >
      {children}
    </div>
  );
}
