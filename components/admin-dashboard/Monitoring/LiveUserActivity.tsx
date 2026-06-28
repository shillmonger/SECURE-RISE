"use client";

import React from "react";
import { Users, Clock, Globe, Smartphone, Laptop, Eye, BarChart2, ArrowDownToLine, Activity, Share2, User, ShieldCheck, Bell, Wallet, HeadphonesIcon, LogIn, CreditCard } from "lucide-react";
import { UserStatusBadge } from "./MonitoringShared";

const PAGE_ICONS: Record<string, React.ElementType> = {
  Dashboard: BarChart2, Deposit: ArrowDownToLine, Withdraw: CreditCard,
  Trading: Activity, Referrals: Share2, Profile: User, Verification: ShieldCheck,
  Notifications: Bell, Wallet: Wallet, Support: HeadphonesIcon, "Login Page": LogIn,
};

type UserStatus = "online" | "offline" | "away";
type DeviceType = "desktop" | "mobile" | "tablet";

interface ActivityEvent {
  time: string;
  action: string;
  icon: React.ElementType;
  category: "navigation" | "action" | "form" | "scroll" | "deposit" | "auth";
}

interface LiveUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: "user" | "admin" | "vip";
  status: UserStatus;
  currentPage: string;
  currentUrl: string;
  lastActivity: string;
  device: DeviceType;
  browser: string;
  os: string;
  sessionDuration: string;
  country: string;
  city: string;
  ipAddress: string;
  loginTime: string;
  avatar: string;
  mouseActivity: "moving" | "idle" | "clicking";
  keyboardActivity: "typing" | "idle";
  connection: "excellent" | "good" | "poor";
  timeOnPage: string;
  activityFeed: ActivityEvent[];
  pageVisitsToday: number;
  buttonsClicked: number;
  formsSubmitted: number;
  scrollProgress: number;
  navigationCount: number;
  activityScore: number;
  pagesVisited: string[];
  vpnDetected: boolean;
  newDevice: boolean;
}

const MOCK_ACTIVITY_FEED: ActivityEvent[] = [
  { time: "08:32:12", action: "Opened Notifications", icon: Bell, category: "navigation" },
  { time: "08:31:55", action: "Returned to Dashboard", icon: BarChart2, category: "navigation" },
  { time: "08:31:20", action: "Opened Referral Page", icon: Share2, category: "navigation" },
  { time: "08:31:10", action: "Viewed Wallet", icon: Wallet, category: "navigation" },
  { time: "08:30:37", action: "Redirected to Payment", icon: Activity, category: "action" },
  { time: "08:30:35", action: "Submitted Deposit $500", icon: Activity, category: "form" },
  { time: "08:30:31", action: "Entered Amount: $500", icon: Activity, category: "form" },
  { time: "08:30:28", action: "Opened Deposit Modal", icon: Activity, category: "action" },
  { time: "08:30:24", action: "Scrolled to 65%", icon: Activity, category: "scroll" },
  { time: "08:30:20", action: "Clicked Deposit", icon: Activity, category: "action" },
  { time: "08:30:15", action: "Opened Dashboard", icon: BarChart2, category: "navigation" },
];

function generateUser(id: number): LiveUser {
  const names = [
    ["Alexis Morgan", "alexism"], ["Darius Kane", "dkane99"], ["Sofia Reyes", "sofiar"],
    ["Marcus Bell", "marcusb"], ["Yuna Park", "yunapark"], ["Ethan Cole", "ethancole"],
    ["Priya Sharma", "priya_s"], ["Luca Ferri", "lucaferri"], ["Amara Diallo", "amarad"],
    ["Noah Chen", "noahchen"], ["Isla Stewart", "islast"], ["Jamal Okafor", "jamalo"],
    ["Mia Johansson", "mia_j"], ["Riku Tanaka", "riketanaka"], ["Chloe Martin", "chloem"],
    ["Finn Walsh", "finnw"], ["Zara Ali", "zara_ali"], ["Oscar Pham", "oscarp"],
    ["Nia Jackson", "niajax"], ["Leo Russo", "leor"], ["Hana Kim", "hanakm"],
    ["Dante Cruz", "dantecruz"], ["Vera Popov", "verapop"], ["Kwame Asante", "kwamea"],
    ["Aria Nguyen", "ariangn"], ["Felix Bauer", "felixb"], ["Sienna Moore", "sienna_m"],
    ["Tariq Hassan", "tariqh"], ["Luna Castillo", "lunac"], ["Ben O'Brien", "benob"],
  ];
  const pages = ["Dashboard", "Deposit", "Withdraw", "Trading", "Referrals", "Profile", "Verification", "Notifications", "Wallet", "Support"];
  const statuses: UserStatus[] = ["online", "online", "online", "away", "offline"];
  const devices: DeviceType[] = ["desktop", "mobile", "tablet"];
  const browsers = ["Chrome 124", "Firefox 125", "Safari 17", "Edge 124", "Brave 1.65"];
  const oss = ["Windows 11", "macOS 14", "Ubuntu 22.04", "iOS 17", "Android 14"];
  const countries = ["Nigeria", "United States", "United Kingdom", "Germany", "Japan", "Brazil", "France", "Canada", "Australia", "UAE"];
  const cities = ["Lagos", "New York", "London", "Berlin", "Tokyo", "São Paulo", "Paris", "Toronto", "Sydney", "Dubai"];
  const durations = ["35s", "2m 14s", "4m 18s", "8m 05s", "12m 33s", "25m", "38m 12s", "1h 05m", "1h 42m", "2h 11m"];
  const lastActivities = ["Just now", "4 seconds ago", "12 seconds ago", "30 seconds ago", "1 minute ago", "2 minutes ago", "5 minutes ago", "12 minutes ago"];

  const [fullName, username] = names[id % names.length];
  const status = statuses[id % statuses.length];

  return {
    id: `user_${id}`,
    fullName,
    username,
    email: `${username}@riseplatform.io`,
    role: id % 7 === 0 ? "vip" : id % 11 === 0 ? "admin" : "user",
    status,
    currentPage: pages[id % pages.length],
    currentUrl: `/dashboard/${pages[id % pages.length].toLowerCase()}`,
    lastActivity: lastActivities[id % lastActivities.length],
    device: devices[id % devices.length],
    browser: browsers[id % browsers.length],
    os: oss[id % oss.length],
    sessionDuration: durations[id % durations.length],
    country: countries[id % countries.length],
    city: cities[id % cities.length],
    ipAddress: `${192 + (id % 3)}.${168}.${id % 255}.${(id * 7) % 255}`,
    loginTime: `${String(8 + (id % 4)).padStart(2, "0")}:${String(id % 60).padStart(2, "0")}:${String((id * 3) % 60).padStart(2, "0")}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    mouseActivity: status === "online" ? (id % 3 === 0 ? "clicking" : "moving") : "idle",
    keyboardActivity: status === "online" && id % 4 === 0 ? "typing" : "idle",
    connection: id % 5 === 0 ? "poor" : id % 3 === 0 ? "good" : "excellent",
    timeOnPage: durations[(id + 2) % durations.length],
    activityFeed: MOCK_ACTIVITY_FEED,
    pageVisitsToday: 3 + (id % 18),
    buttonsClicked: 5 + (id % 40),
    formsSubmitted: id % 5,
    scrollProgress: 20 + (id % 80),
    navigationCount: 2 + (id % 15),
    activityScore: 40 + (id % 60),
    pagesVisited: pages.slice(0, 3 + (id % 5)),
    vpnDetected: id % 8 === 0,
    newDevice: id % 6 === 0,
  };
}

const MOCK_USERS: LiveUser[] = Array.from({ length: 30 }, (_, i) => generateUser(i));

interface LiveUserActivityProps {
  users?: LiveUser[];
  filterStatus: "all" | UserStatus;
  setFilterStatus: (status: "all" | UserStatus) => void;
  onMonitor: (user: LiveUser) => void;
}

export default function LiveUserActivity({ users, filterStatus, setFilterStatus, onMonitor }: LiveUserActivityProps) {
  const usersToUse = users || MOCK_USERS;
  const filteredUsers = filterStatus === "all" ? usersToUse : usersToUse.filter(u => u.status === filterStatus);

  return (
    <div className="bg-card border border-border rounded-[1rem] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Live User Activity
        </h3>
        <div className="flex gap-1">
          {(["all", "online", "away", "offline"] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 cursor-pointer rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                filterStatus === status ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-muted-foreground text-[10px] uppercase tracking-[0.15em] font-black border-b border-border">
              <th className="px-4 py-5 w-10">Status</th>
              <th className="px-4 py-5">User</th>
              <th className="px-4 py-5">Role</th>
              <th className="px-4 py-5">Current Page</th>
              <th className="px-4 py-5">Last Activity</th>
              <th className="px-4 py-5">Device</th>
              <th className="px-4 py-5">Session</th>
              <th className="px-4 py-5">Flags</th>
              <th className="px-4 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredUsers.map((user) => {
              const PageIcon = PAGE_ICONS[user.currentPage] || Globe;
              const DeviceIcon = user.device === "mobile" ? Smartphone : Laptop;
              const roleColors: Record<string, string> = {
                vip: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                admin: "bg-violet-500/10 text-violet-400 border-violet-500/20",
                user: "bg-muted/40 text-muted-foreground border-border",
              };
              return (
                <tr key={user.id} className="group hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-4"><div className="flex justify-center"><UserStatusBadge status={user.status} /></div></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <img src={user.avatar} alt={user.fullName} className="w-9 h-9 rounded-lg border border-border object-cover bg-muted" />
                      </div>
                      <div>
                        <p className="text-sm font-black italic tracking-tight text-foreground leading-none mb-0.5">{user.fullName}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4"><span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${roleColors[user.role]}`}>{user.role}</span></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 bg-primary/10 rounded-md"><PageIcon className="w-3 h-3 text-primary" /></div>
                      <span className="text-[10px] font-black uppercase tracking-tight text-foreground">{user.currentPage}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span className="text-[10px] font-black uppercase">{user.lastActivity}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <DeviceIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-[10px] font-black uppercase text-muted-foreground">{user.device}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4"><span className="text-[10px] font-black font-mono text-foreground">{user.sessionDuration}</span></td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1">
                      {user.vpnDetected && <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-black rounded">VPN</span>}
                      {user.newDevice && <span className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black rounded">NEW</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end">
                      <button onClick={() => onMonitor(user)} className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary transition-all cursor-pointer">
                        <Eye className="w-3.5 h-3.5" />Monitor
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filteredUsers.length === 0 && (
        <div className="p-20 text-center">
          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-black uppercase italic text-muted-foreground">No matching users found</h3>
        </div>
      )}
    </div>
  );
}

export { MOCK_USERS };
