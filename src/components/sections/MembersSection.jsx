/**
 * ============================================================
 * MembersSection.jsx — Members Management Table
 * ============================================================
 *
 * Displays a searchable, filterable table of all gym members.
 * Features:
 *   - Text search by member name (client-side filtering)
 *   - Status filter tabs: All / Active / Expiring / Expired
 *   - Row hover highlight
 *   - Plan badge (Premium = gold, Basic = gray)
 *   - "Add Member" button (wire to POST /api/members)
 *
 * BACKEND INTEGRATION:
 *   Data source → GET /api/gyms/:gymId/members
 *   Expected response shape (per member):
 *   {
 *     id:     number,           // members.id
 *     name:   string,           // users.name
 *     phone:  string,           // users.phone (WhatsApp number)
 *     plan:   "Basic"|"Premium",// gyms.plan
 *     status: "active"|"expiring"|"expired", // members.status
 *     expiry: string (date),    // members.end_date
 *     fees:   string,           // last payment amount
 *   }
 *
 *   Add Member   → POST   /api/members
 *   Edit Member  → PATCH  /api/members/:id
 *   Delete Member→ DELETE /api/members/:id
 *
 * SEARCH NOTE:
 *   Currently filtered client-side. For large datasets (>500),
 *   move to server-side: GET /api/members?search=ahmed&status=active
 * ============================================================
 */

import { useState } from "react";
import { Plus, Search, MoreVertical } from "lucide-react";
import Avatar      from "../ui/Avatar";
import StatusBadge from "../ui/StatusBadge";
import Card        from "../ui/Card";
import { members } from "../../data/mockData";
import T from "../../theme";

// Status filter options for the tab row
const FILTER_OPTIONS = ["all", "active", "expiring", "expired"];

// Table column headers
const TABLE_HEADERS = ["Member", "Phone", "Plan", "Expiry", "Fees", "Status", ""];

export default function MembersSection() {
  // Local state for search input and active status filter
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Client-side filter: matches name (case-insensitive) + status tab
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || member.status === filter;
    return matchesSearch && matchesFilter;
  });

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
          <h2 style={{ color: T.text, fontSize: 22, fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: 0 }}>
            Members
          </h2>
          {/* TODO: Replace with dynamic count from API */}
          <p style={{ color: T.textMuted, fontSize: 14, margin: "4px 0 0" }}>
            {members.length} total registered members
          </p>
        </div>

        {/* Add Member CTA — TODO: open modal or navigate to add-member form */}
        <button
          style={{
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
          }}
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* ── Search + Filter Bar ──────────────────────── */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>

          {/* Search input */}
          <div style={{
            flex:         1,
            minWidth:     200,
            display:      "flex",
            alignItems:   "center",
            gap:          10,
            background:   T.bgSecondary,
            border:       `1px solid ${T.border}`,
            borderRadius: 10,
            padding:      "9px 14px",
          }}>
            <Search size={16} color={T.textMuted} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search members..."
              style={{
                background: "none",
                border:     "none",
                outline:    "none",
                color:      T.text,
                fontSize:   14,
                width:      "100%",
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
          </div>

          {/* Status filter tabs */}
          {FILTER_OPTIONS.map(option => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              style={{
                background:    filter === option ? T.goldBg : "transparent",
                border:        `1px solid ${filter === option ? T.goldBorder : T.border}`,
                color:         filter === option ? T.gold : T.textMuted,
                borderRadius:  10,
                padding:       "9px 16px",
                fontSize:      13,
                fontWeight:    600,
                cursor:        "pointer",
                textTransform: "capitalize",
                fontFamily:    "'DM Sans', sans-serif",
                transition:    "all 0.15s",
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </Card>

      {/* ── Members Table ────────────────────────────── */}
      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>

            {/* Table header row */}
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {TABLE_HEADERS.map(header => (
                  <th
                    key={header}
                    style={{
                      padding:       "10px 14px",
                      textAlign:     "left",
                      fontSize:      11,
                      color:         T.textMuted,
                      fontWeight:    600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table body rows */}
            <tbody>
              {filteredMembers.map((member, index) => (
                <tr
                  key={member.id}
                  style={{ borderBottom: index < filteredMembers.length - 1 ? `1px solid ${T.border}` : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.bgCardHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Member name + avatar */}
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={member.name} size={34} />
                      <span style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>{member.name}</span>
                    </div>
                  </td>

                  {/* Phone (WhatsApp number — users.phone) */}
                  <td style={{ padding: "12px 14px", fontSize: 13, color: T.textMuted }}>{member.phone}</td>

                  {/* Plan badge */}
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{
                      fontSize:   12,
                      fontWeight: 600,
                      padding:    "3px 10px",
                      borderRadius: 20,
                      background: member.plan === "Premium" ? T.goldBg : T.bgSecondary,
                      color:      member.plan === "Premium" ? T.gold : T.textMuted,
                      border:     `1px solid ${member.plan === "Premium" ? T.goldBorder : T.border}`,
                    }}>
                      {member.plan}
                    </span>
                  </td>

                  {/* Expiry date (members.end_date) */}
                  <td style={{ padding: "12px 14px", fontSize: 13, color: T.textMuted }}>{member.expiry}</td>

                  {/* Last paid amount */}
                  <td style={{ padding: "12px 14px", fontSize: 13, color: T.text, fontWeight: 600 }}>{member.fees}</td>

                  {/* Status badge */}
                  <td style={{ padding: "12px 14px" }}>
                    <StatusBadge status={member.status} />
                  </td>

                  {/* Actions menu — TODO: dropdown with View / Edit / Delete */}
                  <td style={{ padding: "12px 14px" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: T.textMuted }}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
