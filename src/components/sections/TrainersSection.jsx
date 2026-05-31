/**
 * ============================================================
 * TrainersSection.jsx — Trainers Management View
 * ============================================================
 *
 * Displays all gym trainers in a responsive card grid.
 * Each card shows:
 *   - Trainer avatar (initials-based)
 *   - Name, specialization, star rating
 *   - Assigned member count
 *   - Phone number (WhatsApp)
 *   - "View Plans" and "Edit" action buttons
 *
 * BACKEND INTEGRATION:
 *   Data source → GET /api/gyms/:gymId/trainers
 *   Expected response shape (per trainer):
 *   {
 *     id:             number,   // trainers.id
 *     name:           string,   // trainers.name
 *     specialization: string,   // trainers.specialization
 *     phone:          string,   // trainers.phone (WhatsApp)
 *     members:        number,   // COUNT of active members assigned
 *     rating:         number,   // e.g. 4.9 (if you add a ratings table)
 *   }
 *
 *   Add Trainer  → POST   /api/trainers
 *   Edit Trainer → PATCH  /api/trainers/:id
 *   View Plans   → GET    /api/trainers/:id/workout-plans
 *                  GET    /api/trainers/:id/diet-plans
 *
 * SCHEMA NOTE:
 *   trainers table has: id, gym_id, name, phone, specialization
 *   "rating" is not in the schema — add a trainer_ratings table if needed.
 * ============================================================
 */

import { useState } from "react";
import { Plus, Star, Phone, Users } from "lucide-react";
import Avatar from "../ui/Avatar";
import Card   from "../ui/Card";
import { trainers } from "../../data/mockData";
import T from "../../theme";

export default function TrainersSection() {
  // TODO: Replace with data from GET /api/gyms/:gymId/trainers
  const [trainerList] = useState(trainers);

  return (
    <div>

      {/* ── Section Header ──────────────────────────── */}
      <div style={{
        display:        "flex",
        justifyContent: "space-between",
        alignItems:     "center",
        marginBottom:   24,
        flexWrap:       "wrap",
        gap:            12,
      }}>
        <div>
          <h2 style={{
            color:      T.text,
            fontSize:   22,
            fontWeight: 700,
            fontFamily: "'Syne', sans-serif",
            margin:     0,
          }}>
            Trainers
          </h2>
          <p style={{ color: T.textMuted, fontSize: 14, margin: "4px 0 0" }}>
            {trainerList.length} certified trainers on staff
          </p>
        </div>

        {/* Add Trainer CTA — TODO: open modal or navigate to add-trainer form */}
        <button style={{
          background:   `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
          color:        "#07090F",
          border:       "none",
          borderRadius: 10,
          padding:      "10px 20px",
          fontSize:     14,
          fontWeight:   700,
          cursor:       "pointer",
          display:      "flex",
          alignItems:   "center",
          gap:          8,
          fontFamily:   "'DM Sans', sans-serif",
        }}>
          <Plus size={16} /> Add Trainer
        </button>
      </div>

      {/* ── Trainer Cards Grid ───────────────────────── */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap:                 20,
      }}>
        {trainerList.map(trainer => (
          <TrainerCard key={trainer.id} trainer={trainer} />
        ))}
      </div>
    </div>
  );
}

/**
 * TrainerCard — Individual trainer card sub-component.
 *
 * PROPS:
 *   trainer (object) — Single trainer record from API/mock data
 */
function TrainerCard({ trainer }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      glow
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        transform:  hovered ? "translateY(-4px)" : "translateY(0)",
        cursor:     "default",
      }}
    >
      {/* ── Top Row: Avatar + Name + Rating ─────────── */}
      <div style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        marginBottom:   16,
      }}>
        {/* Avatar + Name + Specialization */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={trainer.name} size={48} />
          <div>
            <div style={{
              fontSize:   16,
              fontWeight: 700,
              color:      T.text,
              fontFamily: "'Syne', sans-serif",
            }}>
              {trainer.name}
            </div>
            <div style={{ fontSize: 13, color: T.textMuted }}>
              {trainer.specialization}
            </div>
          </div>
        </div>

        {/* Star rating — TODO: fetch from trainer_ratings if added */}
        <div style={{
          display:    "flex",
          alignItems: "center",
          gap:        4,
          fontSize:   14,
          fontWeight: 700,
          color:      T.gold,
        }}>
          <Star size={14} fill={T.gold} />
          {trainer.rating}
        </div>
      </div>

      {/* ── Stats Row: Members + Phone ───────────────── */}
      <div style={{
        borderTop:           `1px solid ${T.border}`,
        paddingTop:          12,
        display:             "grid",
        gridTemplateColumns: "1fr 1fr",
        gap:                 12,
        marginBottom:        16,
      }}>
        {/* Assigned members count */}
        {/* Maps to: COUNT(workout_plans.member_id) WHERE trainer_id = trainer.id */}
        <div>
          <div style={{
            display:    "flex",
            alignItems: "center",
            gap:        5,
            fontSize:   11,
            color:      T.textDim,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 4,
          }}>
            <Users size={11} /> Members
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.text, fontFamily: "'Syne', sans-serif" }}>
            {trainer.members}
          </div>
        </div>

        {/* Trainer phone (trainers.phone — WhatsApp) */}
        <div>
          <div style={{
            display:    "flex",
            alignItems: "center",
            gap:        5,
            fontSize:   11,
            color:      T.textDim,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 4,
          }}>
            <Phone size={11} /> WhatsApp
          </div>
          <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>
            {trainer.phone}
          </div>
        </div>
      </div>

      {/* ── Action Buttons ───────────────────────────── */}
      <div style={{ display: "flex", gap: 8 }}>
        {/* View Plans — TODO: navigate to trainer's workout + diet plans */}
        <button style={{
          flex:         1,
          background:   T.goldBg,
          border:       `1px solid ${T.goldBorder}`,
          color:        T.gold,
          borderRadius: 10,
          padding:      "9px",
          fontSize:     13,
          cursor:       "pointer",
          fontWeight:   600,
          fontFamily:   "'DM Sans', sans-serif",
          transition:   "background 0.15s",
        }}>
          View Plans
        </button>

        {/* Edit — TODO: open edit modal with trainer data pre-filled */}
        <button style={{
          flex:         1,
          background:   T.bgSecondary,
          border:       `1px solid ${T.border}`,
          color:        T.textMuted,
          borderRadius: 10,
          padding:      "9px",
          fontSize:     13,
          cursor:       "pointer",
          fontFamily:   "'DM Sans', sans-serif",
          transition:   "background 0.15s",
        }}>
          Edit
        </button>
      </div>
    </Card>
  );
}
