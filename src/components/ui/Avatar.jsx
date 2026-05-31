/**
 * ============================================================
 * Avatar.jsx — Initials-Based Circular Avatar
 * ============================================================
 *
 * Generates a colored circular avatar from a person's name.
 * No image upload required — uses initials + deterministic color.
 *
 * PROPS:
 *   name (string) — Full name, e.g. "Ahmed Raza" → shows "AR"
 *   size (number) — Diameter in px. Default: 36
 *
 * COLOR LOGIC:
 *   Color is picked by name's first character code, so the same
 *   name always gets the same color (deterministic, no state needed).
 *
 * USAGE:
 *   <Avatar name="Ahmed Raza" />
 *   <Avatar name={user.name} size={48} />
 * ============================================================
 */

// Palette of accent colors that work on the dark background
const AVATAR_COLORS = [
  "#C9973A", // gold
  "#4B9EFF", // blue
  "#27C47A", // green
  "#E85858", // red
  "#9B6AE8", // purple
  "#F0A030", // amber
];

export default function Avatar({ name = "?", size = 36 }) {
  // Extract up to 2 initials from the name
  const initials = name
    .split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Deterministic color: same name → same color every render
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

  return (
    <div
      style={{
        width:          size,
        height:         size,
        borderRadius:   "50%",
        background:     `${color}25`,          // Translucent fill
        border:         `1.5px solid ${color}50`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        fontSize:       size * 0.33,           // Scale text with size
        fontWeight:     700,
        color:          color,
        flexShrink:     0,                     // Don't compress in flex rows
        fontFamily:     "'Syne', sans-serif",
        userSelect:     "none",
      }}
    >
      {initials}
    </div>
  );
}
