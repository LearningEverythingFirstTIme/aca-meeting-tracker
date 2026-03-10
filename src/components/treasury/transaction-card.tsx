"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Edit2, Trash2 } from "lucide-react";
import { formatCurrency, formatDate, getCategoryLabel } from "@/lib/treasury-utils";
import type { TreasuryTransaction } from "@/types";

interface TransactionCardProps {
  transaction: TreasuryTransaction;
  onEdit: () => void;
  onDelete: () => void;
}

export const TransactionCard = ({ transaction, onEdit, onDelete }: TransactionCardProps) => {
  const isContribution = transaction.type === 'contribution';
  const categoryLabel = getCategoryLabel(transaction.type, transaction.category);
  const amount = Number(transaction.amount) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={`p-4 rounded-2xl border transition-all hover:shadow-md ${
        isContribution 
          ? 'bg-[var(--mint-cool)]/20 border-[var(--mint)]' 
          : 'bg-[var(--coral-pale)]/20 border-[var(--coral)]'
      }`}
      whileHover={{ scale: 1.01, y: -1 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {isContribution ? (
              <TrendingUp size={16} className="text-[var(--forest-mid)]" />
            ) : (
              <TrendingDown size={16} className="text-[var(--coral)]" />
            )}
            <span className="font-medium text-sm uppercase text-[var(--forest-deep)]">{categoryLabel}</span>
          </div>
          
          <p className={`text-lg font-bold text-[var(--forest-deep)]`}>
            {isContribution ? '+' : '-'}{formatCurrency(amount)}
          </p>

          {transaction.note && (
            <p className="text-xs text-[var(--earth-wood)] truncate mt-1">
              {transaction.note}
            </p>
          )}

          <p className="text-[10px] text-[var(--earth-wood)]/70 mt-1">
            {formatDate(transaction.date)}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={onEdit}
            className="p-2 bg-white rounded-xl border border-[var(--earth-sand)] hover:bg-[var(--butter)] hover:border-[var(--butter-warm)] transition-colors"
          >
            <Edit2 size={12} className="text-[var(--forest-deep)]" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={onDelete}
            className="p-2 bg-white rounded-xl border border-[var(--earth-sand)] hover:bg-[var(--coral)] hover:border-[var(--coral)] hover:text-white transition-colors"
          >
            <Trash2 size={12} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
