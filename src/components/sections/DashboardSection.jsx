/**
 * ============================================================
 * DashboardSection.jsx — Main Overview / Home Screen
 * ============================================================
 *
 * The default landing page of the dashboard. Shows:
 *   1. KPI stat cards (4 key metrics)
 *   2. Revenue vs Expenses area chart (monthly)
 *   3. Plan distribution donut chart (Basic vs Premium)
 *   4. Weekly attendance bar chart
 *   5. WhatsApp automation daily summary
 *
 * BACKEND INTEGRATION POINTS:
 *   - Stat card values  → GET /api/gyms/:gymId/stats
 *       Response: { totalMembers, monthlyRevenue, activeToday, expiringSoon }
 *
 *   - Revenue chart     → GET /api/reports/revenue?range=monthly&year=2025
 *       Response: [{ month, revenue, expenses }]
 *
 *   - Plan distribution → GET /api/gyms/:gymId/plan-distribution
 *       Response: [{ name, value }]
 *
 *   - Attendance chart  → GET /api/attendance/weekly-summary?gym_id=:gymId
 *       Response: [{ day, checkins }]
 *
 *   - WhatsApp summary  → GET /api/whatsapp-logs/daily-summary?date=today
 *       Response: [{ label, time, count, ok }]
 *
 * CHARTS LIBRARY: recharts (npm install recharts)
 * ============================================================
 */

import {
  Users, CreditCard, UserCheck, AlertTriangle,
  CheckCircle2, XCircle,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

import StatCard      from "../ui/StatCard";
import Card          from "../ui/Card";
import CustomTooltip from "../charts/CustomTooltip";
import { revenueData, attendanceData, planData } from "../../data/mockData";
import T from "../../theme";

export default function DashboardSection() {
  return (
    <div>

      {/* ── Section Heading ─────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: T.text, fontSize: 22, fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: 0 }}>
          Overview
        </h2>
        {/* TODO: Replace "June 2025" with dynamic month/year */}
        <p style={{ color: T.textMuted, fontSize: 14, margin: "4px 0 0" }}>
          FitZone Pro — June 2025
        </p>
      </div>

      {/* ── Row 1: KPI Stat Cards ────────────────────── */}
      {/* TODO: Replace hardcoded values with API response from /api/gyms/:id/stats */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap:                 16,
        marginBottom:        24,
      }}>
        <StatCard icon={Users}         label="Total Members"   value="247"      change="12%"  changeType="up"   accent={T.gold}  />
        <StatCard icon={CreditCard}    label="Monthly Revenue" value="PKR 1.2M" change="8.3%" changeType="up"   accent={T.blue}  />
        <StatCard icon={UserCheck}     label="Active Today"    value="103"      change="5%"   changeType="up"   accent={T.green} />
        <StatCard icon={AlertTriangle} label="Expiring Soon"   value="14"       change="3"    changeType="down" accent={T.amber} />
      </div>

      {/* ── Row 2: Revenue Chart + Plan Donut ────────── */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "2fr 1fr",
        gap:                 16,
        marginBottom:        24,
      }}>

        {/* Revenue vs Expenses Area Chart */}
        <Card glow>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'Syne', sans-serif" }}>
                Revenue vs Expenses
              </div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>Jan – Jul 2025</div>
            </div>

            {/* Chart legend */}
            <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: T.textMuted }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: T.gold }} />
                Revenue
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: T.textMuted }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: T.textDim }} />
                Expenses
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={revenueData}>
              <defs>
                {/* Gold gradient fill under revenue line */}
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.gold}    stopOpacity={0.3} />
                  <stop offset="95%" stopColor={T.gold}    stopOpacity={0}   />
                </linearGradient>
                {/* Gray gradient fill under expenses line */}
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.textDim} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={T.textDim} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="month" tick={{ fill: T.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.textMuted, fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue"  name="Revenue"  stroke={T.gold}    strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill: T.gold,    r: 3 }} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke={T.textDim} strokeWidth={2}   fill="url(#expGrad)" dot={{ fill: T.textDim, r: 3 }} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Plan Distribution Donut */}
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>
            Plan Distribution
          </div>
          <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Active memberships</div>

          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={planData}
                cx="50%" cy="50%"
                innerRadius={48} outerRadius={72}
                dataKey="value"
                startAngle={90} endAngle={-270}
                paddingAngle={4}
              >
                {planData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={v => `${v}%`}
                contentStyle={{
                  background: "#1A1F2E", border: `1px solid ${T.goldBorder}`,
                  borderRadius: 8, fontSize: 13,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Plan legend rows */}
          {planData.map((entry, i) => (
            <div
              key={i}
              style={{
                display:        "flex",
                justifyContent: "space-between",
                alignItems:     "center",
                padding:        "8px 0",
                borderTop:      `1px solid ${T.border}`,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.textMuted }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: entry.color }} />
                {entry.name}
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{entry.value}%</span>
            </div>
          ))}
        </Card>
      </div>

      {/* ── Row 3: Weekly Attendance + WhatsApp Summary ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Weekly Check-ins Bar Chart */}
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>
            Weekly Check-ins
          </div>
          <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 20 }}>This week's attendance</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={attendanceData} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
              <XAxis dataKey="day" tick={{ fill: T.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="checkins" name="Check-ins" fill={T.gold} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* WhatsApp Cron Job Summary */}
        {/* TODO: Replace with GET /api/whatsapp-logs/daily-summary */}
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'Syne', sans-serif", marginBottom: 16 }}>
            WhatsApp Automation
          </div>

          {[
            { label: "Fee Reminders Sent",  time: "06:00 AM", count: 2, ok: true  },
            { label: "Workout Plans Sent",  time: "07:00 AM", count: 5, ok: true  },
            { label: "Diet Plans Sent",     time: "08:00 AM", count: 5, ok: true  },
            { label: "Sub Warnings Sent",   time: "09:00 AM", count: 1, ok: false },
          ].map((item, i, arr) => (
            <div
              key={i}
              style={{
                display:       "flex",
                alignItems:    "center",
                justifyContent:"space-between",
                padding:       "10px 0",
                borderBottom:  i < arr.length - 1 ? `1px solid ${T.border}` : "none",
              }}
            >
              {/* Left: icon + label */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width:          32,
                  height:         32,
                  borderRadius:   10,
                  background:     item.ok ? T.greenBg : T.redBg,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                }}>
                  {item.ok
                    ? <CheckCircle2 size={16} color={T.green} />
                    : <XCircle      size={16} color={T.red}   />}
                </div>
                <div>
                  <div style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: T.textMuted }}>{item.time}</div>
                </div>
              </div>

              {/* Right: sent count badge */}
              <span style={{
                fontSize:   12,
                fontWeight: 700,
                color:      item.ok ? T.green : T.red,
                background: item.ok ? T.greenBg : T.redBg,
                padding:    "3px 10px",
                borderRadius: 20,
              }}>
                {item.count} sent
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
