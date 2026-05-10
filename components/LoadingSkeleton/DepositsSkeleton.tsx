export default function DepositsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-muted rounded-full animate-pulse"></div>
            <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-64 bg-muted rounded-lg animate-pulse"></div>
          <div className="h-10 w-32 bg-muted rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="h-4 w-40 bg-muted rounded animate-pulse"></div>
          <div className="w-5 h-5 bg-muted rounded animate-pulse"></div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Payment Method</th>
                <th className="px-6 py-4">Proof</th>
                <th className="px-6 py-4">Submission Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...Array(20)].map((_, index) => (
                <tr key={index} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 w-40 bg-muted rounded animate-pulse"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-24 bg-muted rounded-md animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-16 bg-muted rounded-full animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <div className="w-10 h-10 bg-muted rounded-lg animate-pulse"></div>
                      <div className="w-10 h-10 bg-muted rounded-lg animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
