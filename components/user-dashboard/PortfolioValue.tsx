"use client";
import React, { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

type Range = "1W" | "1M" | "3M";

interface PortfolioValueProps {
  userInvestments: any[];
  giftHistory: any[];
  recentWithdrawals: any[];
  xpRedemptions: any[];
  loading: boolean;
}

export default function PortfolioValue({
  userInvestments,
  giftHistory,
  recentWithdrawals,
  xpRedemptions,
  loading,
}: PortfolioValueProps) {
  const [activeRange, setActiveRange] = useState<Range>("3M");

  const portfolioData = useMemo(() => {
    const transactions: { date: Date; amount: number; type: string }[] = [];

    userInvestments.forEach((investment) => {
      // Add initial investment amount
      transactions.push({
        date: new Date(investment.startDate),
        amount: investment.investmentAmount,
        type: "investment",
      });

      // Add ROI profits from investments
      if (investment.profitHistory && investment.profitHistory.length > 0) {
        investment.profitHistory.forEach((profit: any) => {
          transactions.push({
            date: new Date(profit.timestamp),
            amount: profit.amount,
            type: "profit",
          });
        });
      }
    });

    giftHistory.forEach((gift) => {
      if (!gift.isSender && gift.status === "completed") {
        transactions.push({
          date: new Date(gift.createdAt),
          amount: gift.amount,
          type: "gift",
        });
      }
    });

    xpRedemptions.forEach((redemption) => {
      if (redemption.status === "completed") {
        transactions.push({
          date: new Date(redemption.createdAt),
          amount: redemption.usdtAmount,
          type: "xp",
        });
      }
    });

    recentWithdrawals.forEach((withdrawal) => {
      if (withdrawal.status === "approved") {
        transactions.push({
          date: new Date(withdrawal.approvedAt || withdrawal.createdAt),
          amount: -withdrawal.amount,
          type: "withdrawal",
        });
      }
    });

    transactions.sort((a, b) => a.date.getTime() - b.date.getTime());

    let cumulative = 0;
    return transactions.map((t) => {
      cumulative += t.amount;
      return { date: t.date, value: cumulative, type: t.type };
    });
  }, [userInvestments, giftHistory, recentWithdrawals, xpRedemptions]);

  const filteredData = useMemo(() => {
    const now = new Date();
    const ranges = {
      "1W": 7 * 24 * 60 * 60 * 1000,
      "1M": 30 * 24 * 60 * 60 * 1000,
      "3M": 90 * 24 * 60 * 60 * 1000,
    };
    const cutoff = new Date(now.getTime() - ranges[activeRange]);
    return portfolioData.filter((d) => d.date >= cutoff);
  }, [portfolioData, activeRange]);

  // ── clean label helper ──────────────────────────────────────────────────────
  const formatLabel = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const chartData = useMemo(() => {
    if (filteredData.length === 0) {
      const now = new Date();
      return [
        { label: formatLabel(now), value: 0 },
        { label: formatLabel(now), value: 0 },
      ];
    }

    // Always sample to exactly 6 evenly-spaced points
    const TARGET = 6;
    const len = filteredData.length;
    const indices = Array.from({ length: TARGET }, (_, i) =>
      Math.round((i / (TARGET - 1)) * (len - 1))
    );
    // deduplicate indices
    const unique = [...new Set(indices)];

    return unique.map((idx) => ({
      label: formatLabel(filteredData[idx].date),
      value: filteredData[idx].value,
    }));
  }, [filteredData]);

  // Use filtered data range for chart scaling
  const chartMinValue = Math.min(...chartData.map((d) => d.value), 0);
  const chartMaxValue = Math.max(...chartData.map((d) => d.value), 100);
  const chartValueRange = chartMaxValue - chartMinValue || 1;

  const W = 100;
  const H = 100;
  const PAD = { top: 8, bottom: 8, left: 4, right: 4 };

  const toXY = (index: number, value: number) => {
    const x =
      PAD.left +
      (index / (chartData.length - 1)) * (W - PAD.left - PAD.right);
    const y =
      H -
      PAD.bottom -
      ((value - chartMinValue) / chartValueRange) * (H - PAD.top - PAD.bottom);
    return { x, y };
  };

  const points = chartData.map((d, i) => toXY(i, d.value));

  const linePath = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[i - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 3;
    const cp2x = prev.x + (2 * (pt.x - prev.x)) / 3;
    return `${acc} C ${cp1x},${prev.y} ${cp2x},${pt.y} ${pt.x},${pt.y}`;
  }, "");

  const first = points[0];
  const last = points[points.length - 1];
  const fillPath = `${linePath} L ${last.x},${H - PAD.bottom} L ${first.x},${H - PAD.bottom} Z`;

  const peakIndex = chartData.reduce(
    (best, d, i) => (d.value > chartData[best].value ? i : best),
    0
  );
  const peakPt = points[peakIndex];
  const peakData = chartData[peakIndex];

  const formatValue = (v: number) =>
    v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${Math.round(v)}`;

  const ranges: Range[] = ["1W", "1M", "3M"];

  // Y-axis: evenly-spaced ticks based on filtered data range
  const yTicks = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) =>
      formatValue(chartMinValue + (i / 4) * chartValueRange)
    );
  }, [chartMinValue, chartValueRange]);

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-end">
        <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
          Portfolio Value
        </h2>
        <Link
          href="/user-dashboard/analytics"
          className="text-[10px] font-black uppercase tracking-widest hover:underline cursor-pointer"
          style={{ color: "#229ED9" }}
        >
          Full Report
        </Link>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
              Performance
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-black text-green-500">LIVE</span>
            </span>
          </div>

          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRange(r)}
                className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                  activeRange === r
                    ? "text-white shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={activeRange === r ? { backgroundColor: "#229ED9" } : {}}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="p-5 space-y-4">
            <div className="flex gap-2">
              <div className="flex flex-col justify-between space-y-2" style={{ minWidth: "34px" }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-3 bg-muted rounded animate-pulse" style={{ width: "30px" }} />
                ))}
              </div>
              <div className="flex-1 h-44 bg-muted/50 rounded-lg animate-pulse" />
            </div>
            <div className="flex justify-between pl-10 pr-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 bg-muted rounded animate-pulse" style={{ width: "28px" }} />
              ))}
            </div>
            <div className="grid grid-cols-3 divide-x divide-border border-t border-border pt-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="px-4 py-3 space-y-2">
                  <div className="h-2 bg-muted rounded animate-pulse" style={{ width: "40px" }} />
                  <div className="h-4 bg-muted rounded animate-pulse" style={{ width: "60px" }} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Chart */}
            <div className="px-5 pt-4 pb-2 relative">
              <div className="flex gap-2">
                {/* Y-axis */}
                <div
                  className="flex flex-col justify-between text-[8px] font-mono text-muted-foreground pr-1 py-1"
                  style={{ minWidth: "36px" }}
                >
                  {yTicks.map((tick) => (
                    <span key={tick} className="leading-none text-right">
                      {tick}
                    </span>
                  ))}
                </div>

                {/* Chart area */}
                <div className="relative flex-1 h-44">
                  <svg
                    viewBox={`0 0 ${W} ${H}`}
                    preserveAspectRatio="none"
                    className="w-full h-full"
                  >
                    <defs>
                      <linearGradient id="pvGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#229ED9" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#229ED9" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {[0.2, 0.4, 0.6, 0.8].map((t) => (
                      <line
                        key={t}
                        x1={PAD.left}
                        x2={W - PAD.right}
                        y1={PAD.top + t * (H - PAD.top - PAD.bottom)}
                        y2={PAD.top + t * (H - PAD.top - PAD.bottom)}
                        stroke="hsl(var(--border))"
                        strokeWidth="0.5"
                        strokeDasharray="2,2"
                      />
                    ))}

                    <path d={fillPath} fill="url(#pvGradient)" />

                    <path
                      d={linePath}
                      fill="none"
                      stroke="#229ED9"
                      strokeWidth="1"
                      strokeLinecap="round"
                    />

                    <circle cx={peakPt.x} cy={peakPt.y} r="2.5" fill="#229ED9" />
                    <circle cx={peakPt.x} cy={peakPt.y} r="1.2" fill="hsl(var(--card))" />
                  </svg>

                  {/* Tooltip at peak */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: `${(peakPt.x / W) * 100}%`,
                      top: `${(peakPt.y / H) * 100}%`,
                      transform: "translate(-50%, -120%)",
                    }}
                  >
                    <div className="bg-card border border-border rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap">
                      <p className="text-sm font-black text-foreground tracking-tighter">
                        {formatValue(peakData.value)}
                      </p>
                      <p className="text-[8px] uppercase tracking-wider text-muted-foreground">
                        {peakData.label}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* X-axis labels — clean, single line, max 6 */}
              <div className="flex justify-between mt-2 pl-10 pr-1">
                {chartData.map((pt, i) => (
                  <span
                    key={i}
                    className="text-[8px] font-mono text-muted-foreground whitespace-nowrap"
                  >
                    {pt.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer stats */}
            <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
              <div className="px-4 py-3">
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">
                  Start
                </p>
                <p className="text-sm font-black tracking-tighter">
                  {formatValue(chartData[0].value)}
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">
                  Current
                </p>
                <p className="text-sm font-black tracking-tighter">
                  {formatValue(chartData[chartData.length - 1].value)}
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">
                  Growth
                </p>
                <p className="text-sm font-black tracking-tighter text-green-500">
                  {chartData[0].value > 0 ? (
                    <>
                      +
                      {(
                        ((chartData[chartData.length - 1].value - chartData[0].value) /
                          chartData[0].value) *
                        100
                      ).toFixed(1)}
                      %
                    </>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}