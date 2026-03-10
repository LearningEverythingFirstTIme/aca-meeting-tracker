"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import { transactionSchema, type TransactionInput } from "@/lib/validators";
import { CONTRIBUTION_CATEGORIES, EXPENSE_CATEGORIES, getTodayDate } from "@/lib/treasury-utils";
import type { TreasuryTransaction, TransactionType, ContributionCategory, ExpenseCategory } from "@/types";

interface TransactionFormProps {
  transaction?: TreasuryTransaction;
  onSubmit: (data: TransactionInput) => Promise<void>;
  onCancel: () => void;
  onClose: () => void;
}

export const TransactionForm = ({ transaction, onSubmit, onCancel, onClose }: TransactionFormProps) => {
  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'contribution');
  const [amount, setAmount] = useState(transaction?.amount?.toString() ?? '');
  const [category, setCategory] = useState(transaction?.category ?? 'seventh_tradition');
  const [date, setDate] = useState(transaction?.date ?? getTodayDate());
  const [note, setNote] = useState(transaction?.note ?? '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = type === 'contribution' ? CONTRIBUTION_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'contribution' ? 'seventh_tradition' : 'rent');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = transactionSchema.safeParse({
      date,
      amount: parseFloat(amount),
      type,
      category,
      note: note || (type === 'contribution' ? 'Contribution' : 'Expense'),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(parsed.data);
      onClose();
    } catch {
      setError('Failed to save transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md forest-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--earth-sand)]">
          <h2 className="font-semibold text-xl text-[var(--forest-deep)]">
            {transaction ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--coral)] hover:text-white transition-colors"
          >
            <X size={16} />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--forest-deep)] mb-2">Type</label>
            <div className="flex gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTypeChange('contribution')}
                className={`flex-1 py-3 rounded-full font-medium text-sm flex items-center justify-center gap-2 border transition-all ${
                  type === 'contribution'
                    ? 'bg-[var(--mint)] text-[var(--forest-deep)] border-[var(--mint)]'
                    : 'bg-white text-[var(--forest-deep)] border-[var(--earth-sand)] hover:border-[var(--forest-pale)]'
                }`}
              >
                <Plus size={14} /> Contribution
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTypeChange('expense')}
                className={`flex-1 py-3 rounded-full font-medium text-sm flex items-center justify-center gap-2 border transition-all ${
                  type === 'expense'
                    ? 'bg-[var(--coral)] text-white border-[var(--coral)]'
                    : 'bg-white text-[var(--forest-deep)] border-[var(--earth-sand)] hover:border-[var(--forest-pale)]'
                }`}
              >
                <Minus size={14} /> Expense
              </motion.button>
            </div>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-[var(--forest-deep)] mb-2">Amount ($)</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="forest-input w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[var(--forest-deep)] mb-2">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ContributionCategory | ExpenseCategory)}
              className="forest-input w-full"
              required
            >
              {Object.entries(categories).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-[var(--forest-deep)] mb-2">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={getTodayDate()}
              className="forest-input w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="note" className="block text-sm font-medium text-[var(--forest-deep)] mb-2">Note (Optional)</label>
            <input
              id="note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              maxLength={200}
              className="forest-input w-full"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-[var(--coral)] rounded-xl p-3"
              >
                <span className="text-xs text-white">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 pt-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="flex-1 py-3 rounded-full border border-[var(--earth-sand)] bg-white text-[var(--forest-deep)] font-medium hover:bg-[var(--leaf-dew)] transition-colors"
              disabled={submitting}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={submitting}
              className="flex-1 py-3 rounded-full forest-button disabled:opacity-50"
            >
              {submitting ? 'Saving...' : transaction ? 'Update' : 'Add'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
