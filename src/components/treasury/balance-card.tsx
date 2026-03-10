"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { calculateSummary, formatCurrency } from "@/lib/treasury-utils";
import type { TreasuryTransaction } from "@/types";

interface BalanceCardProps {
  transactions: TreasuryTransaction[];
  showBreakdown?: boolean;
}

export const BalanceCard = ({ transactions, showBreakdown = true }: BalanceCardProps) => {
  const summary = calculateSummary(transactions);
  const isPositive = summary.net >= 0;

  return (
    <div className="forest-card p-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isPositive ? "bg-[var(--mint-cool)]" : "bg-[var(--coral-pale)]"}`}>
            <DollarSign size={18} className={isPositive ? "text-[var(--forest-mid)]" : "text-[var(--coral)]"} />
          </div>
          <span className="text-sm font-medium text-[var(--earth-wood)]">Treasury Balance</span>
        </div>
        <motion.p 
          className={`text-5xl font-bold ${isPositive ? "text-[var(--forest-mid)]" : "text-[var(--coral)]"}`}
          key={summary.net}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {formatCurrency(summary.net)}
        </motion.p>
      </div>

      {showBreakdown && (
        <div className="border-t border-[var(--earth-sand)] pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-[var(--mint)]" />
              <span className="text-xs text-[var(--earth-wood)]">Contributions</span>
            </div>
            <span className="text-sm font-bold text-[var(--forest-mid)]">
              {formatCurrency(summary.contributions)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown size={14} className="text-[var(--coral)]" />
              <span className="text-xs text-[var(--earth-wood)]">Expenses</span>
            </div>
            <span className="text-sm font-bold text-[var(--coral)]">
              -{formatCurrency(summary.expenses)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-dashed border-[var(--earth-sand)]">
            <span className="text-xs font-medium text-[var(--forest-deep)]">Net</span>
            <span className={`text-sm font-bold ${isPositive ? "text-[var(--forest-mid)]" : "text-[var(--coral)]"}`}>
              {formatCurrency(summary.net)}
            </span>
          </div>

          <div className="text-center pt-2">
            <span className="text-[10px] text-[var(--earth-wood)]">
              {summary.transactionCount} transaction{summary.transactionCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
