"use client";

import React, { useState, useEffect } from "react";
import { LineChart } from "lucide-react";

export default function TrafficOverview() {
  const [metrics, setMetrics] = useState({
    onlineUsers: 0,
    totalEvents: 0,
    totalPageVisits: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/activity');
        if (response.ok) {
          const data = await response.json();
          const users = data.users || [];

          const onlineUsers = users.filter((u: any) => u.status === 'online').length;
          const totalEvents = users.reduce((sum: number, u: any) => sum + (u.activityFeed?.length || 0), 0);
          const totalPageVisits = users.reduce((sum: number, u: any) => sum + (u.pagesVisited?.length || 0), 0);

          setMetrics({
            onlineUsers,
            totalEvents,
            totalPageVisits,
          });
        }
      } catch (error) {
        console.error('Error fetching traffic data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 50000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-[1rem] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
            <LineChart className="w-4 h-4 text-blue-400" />
            Traffic Overview — Live
          </h3>
        </div>
        <div className="p-5 text-center text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  const charts = [
    { label: "Users Online", value: metrics.onlineUsers, color: "#10b981", sub: "currently active" },
    { label: "Activity Events", value: metrics.totalEvents, color: "#6366f1", sub: "total tracked" },
    { label: "Page Visits", value: metrics.totalPageVisits, color: "#f59e0b", sub: "total sessions" },
  ];

  return (
    <div className="bg-card border border-border rounded-[1rem] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
          <LineChart className="w-4 h-4 text-blue-400" />
          Traffic Overview — Live
        </h3>
      </div>
      <div className="grid grid-cols-3 divide-x divide-border">
        {charts.map(({ label, value, color, sub }) => (
          <div key={label} className="p-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
            <p className="text-xl font-black tracking-tighter" style={{ color }}>{value}</p>
            <p className="text-[8px] text-muted-foreground/60 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
