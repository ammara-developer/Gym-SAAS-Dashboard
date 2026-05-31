/**
 * ============================================================
 * AttendanceSection.jsx — Member Check-in / Check-out Log
 * ============================================================
 *
 * Displays daily attendance records for gym members.
 * Features:
 *   - Today's summary stats (total checked in, still in gym, checked out)
 *   - Date picker to browse past attendance
 *   - Sortable table with check-in and check-out times
 *   - Duration calculation (check_out - check_in)
 *   - Live "In Gym" badge if check_out is NULL
 *
 * BACKEND INTEGRATION:
 *   Data source → GET /api/gyms/:gymId/attendance?date=2025-06-01
 *   Maps to: attendance table JOIN members JOIN users
 *   Expected response shape:
 *   {
 *     id:        number,         // attendance.id
 *     member:    string,         // users.name
 *     phone:     string,         // users.phone
 *     checkIn:   string,         // attendance.check_in (HH:mm)
 *     checkOut:  string | null,  // attendance.check_out (null = still inside)
 *     duration:  string,         // computed: e.g. "1h 20m"
 *     date:      string,         // attendance.date
 *   }
 *
 *   Mark Check-in  → POST /api/attendance  { gym_id, member_id }
 *   Mark Check-out → PATCH /api/attendance/:id  { check_out: timestamp }
 *
 * SCHEMA NOTE:
 *   attendance table: id, gym_id, member_id, check_in (DATETIME),
 *                     check_out (DATETIME — NULL if still in gym), date (DATE)
 *
 * SAMPLE QUERY (section 7 of schema doc):
 *   SELECT m.*, u.name, u.phone FROM members m
 *   JOIN users u ON m.user_id = u.id
 *   WHERE m.end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)
 *   AND m.status = 'active';
 * ============================================================
 */

import { useState } from "react";
import { CalendarCheck, Clock, UserCheck, Users, LogIn, LogOut } from "lucide-react";
import Avatar from "../ui/Avatar";
import Card   from "../ui/Card";
import T from "../../theme";

// ── Mock attendance records for today ─────────────────────
// TODO: Replace with API data from GET /api/attendance?date=today
const MOCK_ATTENDANCE = [
  { id: 1, member: "Ahmed Raza",    phone: "+92-300-1234567", checkIn: "06:12 AM", checkOut: "07:45 AM", duration: "1h 33m", status: "out"  },
  { id: 2, member: "Sara Khan",     phone: "+92-321-9876543", checkIn: "07:05 AM", checkOut: null,        duration: "Active", status: "in"   },
  { id: 3, member: "Bilal Qureshi", phone: "+92-333-5557890", checkIn: "07:30 AM", checkOut: "09:00 AM", duration: "1h 30m", status: "out"  },
  { id: 4, member: "Fatima Malik",  phone: "+92-345-6543210", checkIn: "08:00 AM", checkOut: null,        duration: "Active", status: "in"   },
  { id: 5, member: "Usman Tariq",   phone: "+92-312-3334444", checkIn: "09:15 AM", checkOut: "10:45 AM", duration: "1h 30m", status: "out"  },
  { id: 6, member: "Hassan Ali",    phone: "+92-315-1112222", checkIn: "10:00 AM", checkOut: null,        duration: "Active", status: "in"   },
  { id: 7, member: "Zara Siddiqui", phone: "+92-302-7778888", checkIn: "11:20 AM", checkOut: "12:50 PM", duration: "1h 30m", status: "out"  },
];

// ── Today's summary stats ──────────────────────────────────
// TODO: Compute dynamically from API totals
const todayStats = {
  total:      MOCK_ATTENDANCE.length,
  inGym:      MOCK_ATTENDANCE.filter(r => r.status === "in").length,
  checkedOut: MOCK_ATTENDANCE.filter(r => r.status === "out").length,
};

const TABLE_HEADERS = ["Member", "Phone", "Check In", "Check Out", "Duration", "Status"];

export default function AttendanceSection() {
  // Date filter — defaults to today
  // TODO: Wire to API: GET /api/attendance?date={selectedDate}
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  return (
    <div>

      {/* ── Section Header ──────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ color: T.text, fontSize: 22, fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: 0 }}>
            Attendance
          </h2>
          <p style={{ color: T.textMuted, fontSize: 14, margin: "4px 0 0" }}>
            Member check-in / check-out tracking
          </p>
        </div>

        {/* Date Picker — TODO: refetch data on change */}
        <div style={{
          display:      "flex",
          alignItems:   "center",
          gap:          10,
          background:   T.bgCard,
          border:       `1px solid ${T.border}`,
          borderRadius: 10,
          padding:      "9px 14px",
        }}>
          <CalendarCheck size={15} color={T.gold} />
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            style={{
              background: "none",
              border:     "none",
              outline:    "none",
              color:      T.text,
              fontSize:   14,
              fontFamily: "'DM Sans', sans-serif",
              cursor:     "pointer",
            }}
          />
        </div>
      </div>

      {/* ── Summary Stat Cards ───────────────────────── */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap:                 16,
        marginBottom:        24,
      }}>
        {/* Total check-ins today */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: T.goldBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={18} color={T.gold} />
            </div>
            <span style={{ fontSize: 12, color: T.textMuted }}>Total Today</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: T.text, fontFamily: "'Syne', sans-serif" }}>
            {todayStats.total}
          </div>
          <div style={{ fontSize: 12, color: T.textDim, marginTop: 4 }}>Members visited</div>
        </Card>

        {/* Currently in gym (check_out IS NULL) */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: T.greenBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UserCheck size={18} color={T.green} />
            </div>
            <span style={{ fontSize: 12, color: T.textMuted }}>In Gym Now</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: T.green, fontFamily: "'Syne', sans-serif" }}>
            {todayStats.inGym}
          </div>
          <div style={{ fontSize: 12, color: T.textDim, marginTop: 4 }}>Active sessions</div>
        </Card>

        {/* Checked out (check_out NOT NULL) */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: T.blueBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={18} color={T.blue} />
            </div>
            <span style={{ fontSize: 12, color: T.textMuted }}>Checked Out</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: T.blue, fontFamily: "'Syne', sans-serif" }}>
            {todayStats.checkedOut}
          </div>
          <div style={{ fontSize: 12, color: T.textDim, marginTop: 4 }}>Sessions completed</div>
        </Card>
      </div>

      {/* ── Attendance Table ─────────────────────────── */}
      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {TABLE_HEADERS.map(header => (
                  <th key={header} style={{
                    padding:       "10px 14px",
                    textAlign:     "left",
                    fontSize:      11,
                    color:         T.textMuted,
                    fontWeight:    600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {MOCK_ATTENDANCE.map((record, index) => (
                <tr
                  key={record.id}
                  style={{ borderBottom: index < MOCK_ATTENDANCE.length - 1 ? `1px solid ${T.border}` : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.bgCardHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Member name + avatar */}
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={record.member} size={34} />
                      <span style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>{record.member}</span>
                    </div>
                  </td>

                  {/* Phone */}
                  <td style={{ padding: "12px 14px", fontSize: 13, color: T.textMuted }}>{record.phone}</td>

                  {/* Check-in time (attendance.check_in) */}
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <LogIn size={13} color={T.green} />
                      <span style={{ fontSize: 13, color: T.text }}>{record.checkIn}</span>
                    </div>
                  </td>

                  {/* Check-out time (attendance.check_out — NULL if still in gym) */}
                  <td style={{ padding: "12px 14px" }}>
                    {record.checkOut ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <LogOut size={13} color={T.textMuted} />
                        <span style={{ fontSize: 13, color: T.textMuted }}>{record.checkOut}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: T.textDim, fontStyle: "italic" }}>Not yet</span>
                    )}
                  </td>

                  {/* Session duration (computed from check_in and check_out) */}
                  <td style={{ padding: "12px 14px", fontSize: 13, color: T.text, fontWeight: 500 }}>
                    {record.duration}
                  </td>

                  {/* In gym / checked out status */}
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{
                      fontSize:     11,
                      fontWeight:   600,
                      padding:      "3px 10px",
                      borderRadius: 20,
                      textTransform:"uppercase",
                      background:   record.status === "in" ? T.greenBg : T.bgSecondary,
                      color:        record.status === "in" ? T.green   : T.textMuted,
                      border:       `1px solid ${record.status === "in" ? T.green + "40" : T.border}`,
                    }}>
                      {record.status === "in" ? "In Gym" : "Checked Out"}
                    </span>
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
