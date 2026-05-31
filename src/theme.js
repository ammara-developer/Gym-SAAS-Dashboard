/**
 * ============================================================
 * theme.js — Global Design Tokens & Color Palette
 * ============================================================
 *
 * All colors, spacing, and visual constants live here.
 * Import `T` into any component that needs styling.
 *
 * HOW TO CUSTOMIZE:
 *   - Change T.gold / T.goldLight to switch the accent color
 *   - Change T.bgPrimary / T.bgSecondary for background tones
 *   - Semantic colors (green = success, red = error, etc.)
 * ============================================================
 */

const T = {
  // ── Backgrounds ───────────────────────────────────────────
  bgPrimary:   "#07090F",   // Page / outermost background
  bgSecondary: "#0C0F1A",   // Sidebar & header background
  bgCard:      "#101524",   // Default card surface
  bgCardHover: "#141929",   // Card surface on hover

  // ── Gold Accent (Primary Brand Color) ─────────────────────
  gold:        "#C9973A",
  goldLight:   "#DEB96A",
  goldBright:  "#F0CB7A",
  goldGlow:    "rgba(201,151,58,0.18)",   // Soft glow for shadows
  goldBorder:  "rgba(201,151,58,0.22)",   // Subtle gold border
  goldBg:      "rgba(201,151,58,0.08)",   // Very light gold fill

  // ── Text ──────────────────────────────────────────────────
  text:        "#EEF1FA",   // Primary text (headings, values)
  textMuted:   "#7B85A0",   // Secondary text (labels, hints)
  textDim:     "#4A5168",   // Tertiary text (timestamps, disabled)

  // ── Borders ───────────────────────────────────────────────
  border:      "rgba(255,255,255,0.06)",  // Default subtle border
  borderMid:   "rgba(255,255,255,0.10)",  // Slightly stronger border

  // ── Semantic / Status Colors ──────────────────────────────
  green:       "#27C47A",
  greenBg:     "rgba(39,196,122,0.1)",

  red:         "#E85858",
  redBg:       "rgba(232,88,88,0.1)",

  blue:        "#4B9EFF",
  blueBg:      "rgba(75,158,255,0.1)",

  amber:       "#F0A030",
  amberBg:     "rgba(240,160,48,0.1)",
};

export default T;
