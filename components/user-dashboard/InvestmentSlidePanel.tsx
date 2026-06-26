import React from 'react';
import { X, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react';

interface ProfitHistory {
  date: string;
  rate: number;
  amount: number;
}

interface Investment {
  id: string;
  planName: string;
  roiRate: number;
  investmentAmount: number;
  durationDays: number;
  daysPassed: number;
  profitEarned: number;
  completionPercentage: number;
  status: 'active' | 'completed' | 'expired';
  profitHistory: ProfitHistory[];
  endDate: string | Date;
  lastProfitDate?: string | Date;
}

interface InvestmentSlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  investments: Investment[];
}

export const InvestmentSlidePanel: React.FC<InvestmentSlidePanelProps> = ({
  isOpen,
  onClose,
  investments
}) => {
  if (!isOpen) return null;

  // Sort investments: active first, then completed, then expired
  const sortedInvestments = [...investments].sort((a, b) => {
    const statusOrder = { active: 0, completed: 1, expired: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[400]"
        onClick={onClose}
      />

      {/* Slide Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-background border-l border-border shadow-2xl z-[400] transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          w-full lg:w-[30%]
        `}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tighter">
              All Investments
            </h2>
            <p className="text-xs text-muted-foreground">
              {sortedInvestments.length} investment{sortedInvestments.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-full pb-20">
          {sortedInvestments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No investments found</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {sortedInvestments.map((inv) => (
                <div key={inv.id} className="p-4 space-y-4">
                  {/* Investment Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-wider">
                        {inv.planName}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider ${
                          inv.status === 'active'
                            ? 'bg-green-500/10 text-green-500'
                            : inv.status === 'completed'
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>

                    <div className="text-2xl font-black">
                      ${inv.investmentAmount.toLocaleString()}
                    </div>
                  </div>

                  {/* Investment Details */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{inv.durationDays} days</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{inv.daysPassed}/{inv.durationDays} days</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      <span>{inv.roiRate}% daily</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500 font-bold">
                      <DollarSign className="w-3 h-3" />
                      <span>${inv.profitEarned.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-[9px] uppercase tracking-wider text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{inv.completionPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-foreground rounded-full transition-all"
                        style={{ width: `${inv.completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Profit History */}
                  <div className="space-y-2">
                    <h4 className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                      Profit History ({inv.profitHistory.length})
                    </h4>
                    {inv.profitHistory.length > 0 ? (
                      <div className="space-y-1">
                        {inv.profitHistory.map((log, idx) => (
                          <div
                            key={`${inv.id}-log-${idx}`}
                            className="flex items-center justify-between text-xs py-2 px-3 bg-muted/30 rounded"
                          >
                            <span className="text-muted-foreground">{log.date}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-emerald-500 font-bold">+{log.rate}%</span>
                              <span className="text-cyan-500 font-bold">+${log.amount.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        No profit history yet
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
