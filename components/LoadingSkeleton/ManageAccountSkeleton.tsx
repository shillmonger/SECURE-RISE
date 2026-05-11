export default function ManageAccountSkeleton() {
  return (
    <main className="flex-1 overflow-y-auto">
          {/* Page Header Skeleton */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="h-10 w-48 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-40 bg-muted rounded animate-pulse"></div>
            </div>

            {/* Search and Dropdown Skeleton */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="h-10 w-64 bg-muted rounded-xl animate-pulse"></div>
              </div>
              <div className="h-10 w-32 bg-muted rounded-xl animate-pulse"></div>
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card px-5 py-3 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-muted rounded-xl animate-pulse"></div>
                  <div className="h-3 w-8 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="h-3 w-24 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-6 w-12 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">
                      <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
                    </th>
                    <th className="px-6 py-4">
                      <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
                    </th>
                    <th className="px-6 py-4">
                      <div className="h-3 w-28 bg-muted rounded animate-pulse"></div>
                    </th>
                    <th className="px-6 py-4">
                      <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                    </th>
                    <th className="px-6 py-4">
                      <div className="h-3 w-28 bg-muted rounded animate-pulse"></div>
                    </th>
                    <th className="px-6 py-4 text-right">
                      <div className="h-3 w-20 bg-muted rounded animate-pulse ml-auto"></div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border text-sm">
                  {[...Array(20)].map((_, index) => (
                    <tr key={index} className="group hover:bg-muted/50">
                      {/* User Skeleton */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-lg animate-pulse"></div>
                          <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
                          <div className="flex flex-col gap-1">
                            <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-muted rounded animate-pulse"></div>
                              <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status Skeleton */}
                      <td className="px-6 py-4">
                        <div className="h-6 w-16 bg-muted rounded-full animate-pulse"></div>
                      </td>

                      {/* Balance Input Skeleton */}
                      <td className="px-6 py-4">
                        <div className="w-32 h-8 bg-muted border border-border rounded-lg animate-pulse"></div>
                      </td>

                      {/* Profit Input Skeleton */}
                      <td className="px-6 py-4">
                        <div className="w-32 h-8 bg-muted border border-border rounded-lg animate-pulse"></div>
                      </td>

                      {/* Total Deposits Input Skeleton */}
                      <td className="px-6 py-4">
                        <div className="w-32 h-8 bg-muted border border-border rounded-lg animate-pulse"></div>
                      </td>

                      {/* Save Button Skeleton */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center justify-end">
                          <div className="h-8 w-20 bg-muted rounded-lg animate-pulse"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
  );
}
