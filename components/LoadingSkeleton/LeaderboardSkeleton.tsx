export default function LeaderboardSkeleton() {
  return (
    <div className="space-y-14">
      {/* Page Header skeleton */}
      <section className="text-center space-y-3 pt-2">
        <div className="flex items-center justify-center gap-4">
          <div className="h-10 w-32 bg-muted/30 rounded animate-pulse"></div>
        </div>
        <div className="w-20 h-px bg-muted/30 rounded mx-auto"></div>
        <div className="h-3 w-64 bg-muted/30 rounded animate-pulse mx-auto"></div>
      </section>

      {/* Desktop Podium skeleton */}
      <section className="hidden lg:flex items-end mx-auto px-25 justify-center gap-5 pt-10">
        {[1, 2, 3].map((rank) => (
          <div
            key={rank}
            className={[
              "relative flex flex-col items-center text-center rounded-[1.5rem] p-5 px-5 border-2 border-border/20",
              rank === 1 ? "flex-[1.15]" : "flex-1"
            ].join(" ")}
          >
            <div className="absolute left-1/2 -translate-x-1/2 w-20 h-20 bg-muted/30 rounded-full animate-pulse" />
            <div className={[
              "rounded-[1rem] border-2 border-border/20 p-1 mt-10 bg-muted/30 animate-pulse",
              rank === 1 ? "w-25 h-25" : "w-20 h-20"
            ].join(" ")} />
            <div className="h-5 w-32 bg-muted/30 rounded animate-pulse mt-4 mb-5" />
            <div className="w-full rounded-xl bg-muted/30 animate-pulse py-4 px-6 mt-auto h-20" />
          </div>
        ))}
      </section>

      {/* Mobile Slider skeleton */}
      <section className="relative flex lg:hidden items-center justify-center pb-12 px-5 mt-8 rounded-[1.5rem] bg-card border border-border overflow-hidden">
        <div className="w-full flex flex-col items-center gap-5 text-center w-full max-w-xs mx-auto">
          <div className="w-20 h-20 bg-muted/30 rounded-full animate-pulse" />
          <div className="w-24 h-24 rounded-[1.5rem] bg-muted/30 animate-pulse" />
          <div className="h-6 w-40 bg-muted/30 rounded animate-pulse" />
          <div className="border border-border/20 bg-muted/30 animate-pulse px-10 py-5 rounded-xl w-full h-20" />
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-1.5 h-1.5 bg-muted/30 rounded-full animate-pulse" />
          ))}
        </div>
      </section>

      {/* Leaderboard Table skeleton */}
      <section className="bg-card border border-border rounded-[1rem] overflow-hidden">
        <div className="flex items-center justify-between gap-4 p-6 md:p-5 border-b border-border flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted/30 rounded-2xl animate-pulse"></div>
            <div className="h-3 w-48 bg-muted/30 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-black uppercase tracking-tight">
            <thead>
              <tr className="border-b border-border/50">
                {["Rank", "Player", "Email", "Account Balance", "Total Withdrawals", "Total Deposits"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {[...Array(10)].map((_, index) => (
                <tr key={index} className="group transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-muted/30 rounded animate-pulse" />
                      <div className="h-5 w-8 bg-muted/30 rounded animate-pulse" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-sm bg-muted/30 animate-pulse" />
                      <div className="h-4 w-24 bg-muted/30 rounded animate-pulse" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-3 w-32 bg-muted/30 rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <div className="w-3.5 h-3.5 bg-muted/30 rounded animate-pulse" />
                      <div className="h-4 w-20 bg-muted/30 rounded animate-pulse" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <div className="w-3.5 h-3.5 bg-muted/30 rounded animate-pulse" />
                      <div className="h-4 w-16 bg-muted/30 rounded animate-pulse" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <div className="w-3.5 h-3.5 bg-muted/30 rounded animate-pulse" />
                      <div className="h-4 w-20 bg-muted/30 rounded animate-pulse" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
