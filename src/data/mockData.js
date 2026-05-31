/**
 * ============================================================
 * mockData.js — Static Demo Data
 * ============================================================
 *
 * This file contains all the fake/demo data used across the
 * dashboard during UI development.
 *
 * FOR BACKEND DEVELOPERS:
 *   Replace each export with an API call (axios / fetch).
 *   Suggested endpoints based on the database schema:
 *
 *   revenueData    → GET /api/reports/revenue?range=monthly
 *   attendanceData → GET /api/attendance/weekly-summary
 *   planData       → GET /api/gyms/:gymId/plan-distribution
 *   members        → GET /api/gyms/:gymId/members
 *   payments       → GET /api/gyms/:gymId/payments
 *   whatsappLogs   → GET /api/gyms/:gymId/whatsapp-logs?date=today
 *   trainers       → GET /api/gyms/:gymId/trainers
 *
 * All data shapes below match the database schema defined
 * in the GYM SAAS MANAGEMENT SYSTEM document.
 * ============================================================
 */

// ── Revenue Chart Data ─────────────────────────────────────
// Maps to: payments table (SUM amount grouped by month)
//          expenses table (SUM amount grouped by month)
export const revenueData = [
  { month: "Jan", revenue: 42000, expenses: 18000 },
  { month: "Feb", revenue: 51000, expenses: 20000 },
  { month: "Mar", revenue: 47000, expenses: 17500 },
  { month: "Apr", revenue: 63000, expenses: 22000 },
  { month: "May", revenue: 58000, expenses: 19800 },
  { month: "Jun", revenue: 71000, expenses: 24000 },
  { month: "Jul", revenue: 79000, expenses: 26500 },
];

// ── Attendance Chart Data ──────────────────────────────────
// Maps to: attendance table (COUNT check_in grouped by day of week)
export const attendanceData = [
  { day: "Mon", checkins: 82  },
  { day: "Tue", checkins: 67  },
  { day: "Wed", checkins: 95  },
  { day: "Thu", checkins: 78  },
  { day: "Fri", checkins: 103 },
  { day: "Sat", checkins: 124 },
  { day: "Sun", checkins: 56  },
];

// ── Plan Distribution (Pie Chart) ─────────────────────────
// Maps to: members table (COUNT grouped by plan via gyms.plan)
export const planData = [
  { name: "Premium", value: 63, color: "#C9973A" },
  { name: "Basic",   value: 37, color: "#4A5168" },
];

// ── Members List ───────────────────────────────────────────
// Maps to: members JOIN users (on members.user_id = users.id)
// Fields: id, name (users.name), phone (users.phone),
//         plan (gyms.plan), status (members.status),
//         expiry (members.end_date), fees (payments.amount)
export const members = [
  { id: 1, name: "Ahmed Raza",    phone: "+92-300-1234567", plan: "Premium", status: "active",   expiry: "2025-08-12", fees: "PKR 8,500" },
  { id: 2, name: "Sara Khan",     phone: "+92-321-9876543", plan: "Basic",   status: "expiring", expiry: "2025-06-02", fees: "PKR 5,000" },
  { id: 3, name: "Bilal Qureshi", phone: "+92-333-5557890", plan: "Premium", status: "active",   expiry: "2025-09-01", fees: "PKR 8,500" },
  { id: 4, name: "Fatima Malik",  phone: "+92-345-6543210", plan: "Basic",   status: "expired",  expiry: "2025-05-28", fees: "PKR 5,000" },
  { id: 5, name: "Usman Tariq",   phone: "+92-312-3334444", plan: "Premium", status: "active",   expiry: "2025-10-15", fees: "PKR 8,500" },
  { id: 6, name: "Zara Siddiqui", phone: "+92-302-7778888", plan: "Basic",   status: "expiring", expiry: "2025-06-01", fees: "PKR 5,000" },
  { id: 7, name: "Hassan Ali",    phone: "+92-315-1112222", plan: "Premium", status: "active",   expiry: "2025-11-20", fees: "PKR 8,500" },
];

// ── Payments List ──────────────────────────────────────────
// Maps to: payments table JOIN members JOIN users
// Fields: id, member (users.name), amount (payments.amount),
//         method (payments.method), status (payments.status),
//         date (payments.created_at), txn (payments.transaction_id)
export const payments = [
  { id: 1, member: "Ahmed Raza",    amount: "PKR 8,500", method: "Online", status: "success", date: "2025-06-01", txn: "TXN-2891" },
  { id: 2, member: "Sara Khan",     amount: "PKR 5,000", method: "Cash",   status: "success", date: "2025-05-30", txn: "TXN-2890" },
  { id: 3, member: "Bilal Qureshi", amount: "PKR 8,500", method: "Online", status: "pending", date: "2025-05-29", txn: "TXN-2889" },
  { id: 4, member: "Fatima Malik",  amount: "PKR 5,000", method: "Cash",   status: "failed",  date: "2025-05-28", txn: "TXN-2888" },
  { id: 5, member: "Usman Tariq",   amount: "PKR 8,500", method: "Online", status: "success", date: "2025-05-27", txn: "TXN-2887" },
];

// ── WhatsApp Automation Logs ───────────────────────────────
// Maps to: whatsapp_logs table
// Fields: id, recipient (whatsapp_logs.recipient_number),
//         type (whatsapp_logs.message_type),
//         status (whatsapp_logs.status), time (whatsapp_logs.sent_at)
export const whatsappLogs = [
  { id: 1, recipient: "+92-321-9876543", type: "fee_reminder",  status: "sent",    time: "06:00 AM", member: "Sara Khan"    },
  { id: 2, recipient: "+92-302-7778888", type: "fee_reminder",  status: "sent",    time: "06:00 AM", member: "Zara Siddiqui"},
  { id: 3, recipient: "+92-300-1234567", type: "workout_plan",  status: "sent",    time: "07:00 AM", member: "Ahmed Raza"   },
  { id: 4, recipient: "+92-333-5557890", type: "diet_plan",     status: "sent",    time: "08:00 AM", member: "Bilal Qureshi"},
  { id: 5, recipient: "+92-Owner-Num",   type: "sub_warning",   status: "failed",  time: "09:00 AM", member: "Owner"        },
  { id: 6, recipient: "+92-315-1112222", type: "workout_plan",  status: "pending", time: "07:00 AM", member: "Hassan Ali"   },
];

// ── Trainers List ──────────────────────────────────────────
// Maps to: trainers table
// Fields: id, name (trainers.name), specialization,
//         phone (trainers.phone), members (COUNT from workout_plans)
export const trainers = [
  { id: 1, name: "Kamran Hussain", specialization: "Bodybuilding",   members: 12, phone: "+92-300-1110000", rating: 4.9 },
  { id: 2, name: "Nadia Iqbal",    specialization: "Yoga & Pilates", members: 8,  phone: "+92-321-2220000", rating: 4.7 },
  { id: 3, name: "Tariq Mehmood",  specialization: "Weight Loss",    members: 15, phone: "+92-333-3330000", rating: 4.8 },
];
