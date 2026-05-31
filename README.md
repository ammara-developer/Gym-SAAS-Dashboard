# 🏋️ GYM SaaS Management Dashboard

A premium dark-themed React dashboard for the GYM SaaS Management System.
Built for: **Multi-tenant SaaS Gym Management** with WhatsApp Automation.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

---

## 📦 NPM Packages Required

| Package        | Version  | Purpose                        |
|---------------|----------|--------------------------------|
| react          | ^18.2.0  | Core UI framework              |
| react-dom      | ^18.2.0  | DOM renderer                   |
| recharts       | ^2.12.7  | Charts (Area, Bar, Pie)        |
| lucide-react   | ^0.383.0 | Icons throughout the UI        |
| vite           | ^5.2.0   | Dev server & build tool        |

Install all at once:
```bash
npm install react react-dom recharts lucide-react
npm install -D vite @vitejs/plugin-react
```

---

## 📁 Folder Structure

```
gym-dashboard/
├── index.html                          # Vite entry HTML
├── package.json                        # Dependencies
├── vite.config.js                      # Vite config
└── src/
    ├── main.jsx                        # React root mount
    ├── App.jsx                         # Root component + section routing
    ├── theme.js                        # All colors & design tokens
    ├── data/
    │   └── mockData.js                 # Demo data (replace with API calls)
    └── components/
        ├── layout/
        │   ├── Layout.jsx              # Page shell (Sidebar + Header + Main)
        │   ├── Sidebar.jsx             # Left navigation panel
        │   └── Header.jsx             # Top sticky bar
        ├── ui/
        │   ├── Avatar.jsx              # Initials-based circle avatar
        │   ├── Card.jsx                # Base card surface
        │   ├── StatCard.jsx            # KPI metric card
        │   └── StatusBadge.jsx         # Color-coded status pill
        ├── charts/
        │   └── CustomTooltip.jsx       # Dark-themed Recharts tooltip
        └── sections/
            ├── DashboardSection.jsx    # Overview / home screen
            ├── MembersSection.jsx      # Members table with search/filter
            ├── TrainersSection.jsx     # Trainer card grid
            ├── PaymentsSection.jsx     # Transactions table
            ├── AttendanceSection.jsx   # Check-in/out log
            ├── WhatsAppSection.jsx     # Automation status + logs
            ├── ExpensesSection.jsx     # Expense tracker + chart
            └── SettingsSection.jsx     # Gym profile + API config
```

---

## 🗄️ Database Mapping

Each section maps to these database tables (from the schema doc):

| Section      | Primary Table(s)                          |
|-------------|-------------------------------------------|
| Dashboard    | members, payments, attendance, whatsapp_logs |
| Members      | members JOIN users                        |
| Trainers     | trainers                                  |
| Payments     | payments JOIN members JOIN users          |
| Attendance   | attendance JOIN members JOIN users        |
| WhatsApp     | whatsapp_logs                             |
| Expenses     | expenses                                  |
| Settings     | gyms, subscriptions                       |

---

## 🔌 Replacing Mock Data with Real API

Every component has `// TODO:` comments marking where to add API calls.

Example (MembersSection.jsx):
```js
// BEFORE (mock data):
import { members } from "../../data/mockData";

// AFTER (real API with axios):
const [members, setMembers] = useState([]);
useEffect(() => {
  axios.get(`/api/gyms/${gymId}/members`).then(r => setMembers(r.data));
}, [gymId]);
```

---

## 🎨 Customizing Colors

All colors are in `src/theme.js`. Change `T.gold` to switch the brand accent:

```js
// Current: Gold (#C9973A)
gold: "#C9973A",

// Example: Blue theme
gold: "#4B9EFF",
```

---

## 📱 Responsive Breakpoint

- **Desktop** (≥900px): Sidebar always visible
- **Mobile**  (<900px): Sidebar slides in via hamburger menu

The breakpoint is defined in `src/components/layout/Layout.jsx`:
```js
const MOBILE_BREAKPOINT = 900; // px
```

---

## 💬 WhatsApp Automation (Schema Section 5)

Cron jobs mapped in `WhatsAppSection.jsx`:

| Job                  | Time     | PHP Script              |
|---------------------|----------|-------------------------|
| Fee Reminders        | 06:00 AM | send_fee_reminders.php  |
| Workout Plans        | 07:00 AM | send_workout_plans.php  |
| Diet Plans           | 08:00 AM | send_diet_plans.php     |
| Subscription Warning | 09:00 AM | send_sub_warnings.php   |

API options: **Twilio** or **Meta Cloud API** (configured in Settings).

---

## 🛠️ Tech Stack

- **React 18** — UI
- **Recharts** — Charts & graphs
- **Lucide React** — Icons
- **Vite** — Dev server & build
- **Inline styles** — No CSS framework needed (theme.js controls everything)
