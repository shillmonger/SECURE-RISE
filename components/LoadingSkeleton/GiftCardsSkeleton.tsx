import React from "react";
import { Gift } from "lucide-react";

const GiftCardsSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 bg-muted rounded-lg w-32 animate-pulse"></div>
        <div className="h-8 bg-muted rounded-lg w-48 animate-pulse"></div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="h-6 bg-muted rounded-lg w-40 animate-pulse"></div>
          <div className="h-6 bg-muted rounded-lg w-20 animate-pulse"></div>
        </div>

        {/* Table Headers */}
        <div className="p-4">
          <div className="grid grid-cols-9 gap-4 mb-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Table Rows */}
        <div className="space-y-2 p-4">
          {Array.from({ length: 20 }).map((_, rowIndex) => (
            <div key={rowIndex} className="bg-card border border-border rounded-lg p-4">
              <div className="grid grid-cols-9 gap-4">
                {Array.from({ length: 9 }).map((_, colIndex) => (
                  <div key={colIndex} className="h-4 bg-muted rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GiftCardsSkeleton;
