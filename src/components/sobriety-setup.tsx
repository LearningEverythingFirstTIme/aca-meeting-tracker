"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Award, AlertTriangle } from "lucide-react";
import { sobrietyDateSchema } from "@/lib/validators";
import type { SobrietyDateInput } from "@/lib/validators";
import { getTodayDate } from "@/lib/treasury-utils";

interface SobrietySetupProps {
  currentDate: string | null;
  onSubmit: (data: SobrietyDateInput) => Promise<void>;
  onClose: () => void;
}

export const SobrietySetup = ({ currentDate, onSubmit, onClose }: SobrietySetupProps) => {
  const [date, setDate] = useState(currentDate || "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = sobrietyDateSchema.safeParse({ sobrietyDate: date });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid date");
      return;
    }

    // Check if date is in the future
    const selectedDate = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      setError("Sobriety date cannot be in the future");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(parsed.data);
      onClose();
    } catch {
      setError("Failed to save sobriety date");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = async () => {
    setSubmitting(true);
    try {
      await onSubmit({ sobrietyDate: "" });
      onClose();
    } catch {
      setError("Failed to clear sobriety date");
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--earth-sand)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-[var(--butter)] to-[var(--butter-warm)] rounded-full flex items-center justify-center shadow-sm">
              <Award size={20} className="text-[var(--forest-deep)]" />
            </div>
            <div>
              <h2 className="font-semibold text-xl text-[var(--forest-deep)]">
                {currentDate ? "Edit" : "Set"} Sobriety Date
              </h2>
              <p className="text-[10px] text-[var(--earth-wood)]">
                {currentDate ? "Update your clean date" : "Track your recovery journey"}
              </p>
            </div>
          </div>
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

        <AnimatePresence mode="wait">
          {showConfirmReset ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-[var(--coral)]/20 rounded-2xl border border-[var(--coral)] p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={24} className="text-[var(--coral)]" />
                <h3 className="font-semibold text-lg text-[var(--forest-deep)]">Reset Sobriety Date?</h3>
              </div>
              <p className="text-sm text-[var(--forest-deep)] mb-6">
                This will clear your current sobriety date and reset your counter. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 py-3 rounded-full border border-[var(--earth-sand)] bg-white text-[var(--forest-deep)] font-medium hover:bg-[var(--leaf-dew)] transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClear}
                  disabled={submitting}
                  className="flex-1 py-3 rounded-full bg-[var(--coral)] text-white font-medium hover:bg-[var(--coral-warm)] transition-colors"
                >
                  {submitting ? 'Clearing...' : 'Clear Date'}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label htmlFor="sobrietyDate" className="flex items-center gap-2 text-sm font-medium text-[var(--forest-deep)] mb-2">
                  <Calendar size={14} />
                  Sobriety Date
                </label>
                <input
                  id="sobrietyDate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={getTodayDate()}
                  className="forest-input w-full"
                  required
                />
                <p className="text-[10px] text-[var(--earth-wood)] mt-2">
                  Enter the date of your last drink/drug use.
                </p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-[var(--coral)] rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} className="text-white" />
                      <span className="text-xs text-white">{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3 pt-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 py-3 rounded-full border border-[var(--earth-sand)] bg-white text-[var(--forest-deep)] font-medium hover:bg-[var(--leaf-dew)] transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </motion.button>
                {currentDate && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowConfirmReset(true)}
                    disabled={submitting}
                    className="py-3 px-4 rounded-full bg-[var(--coral)] text-white font-medium hover:bg-[var(--coral-warm)] transition-colors"
                  >
                    Clear
                  </motion.button>
                )}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={submitting || !date}
                  className="flex-1 py-3 rounded-full forest-button disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block h-3 w-3 border-2 border-white border-t-transparent rounded-full"
                      />
                      Saving...
                    </span>
                  ) : (
                    currentDate ? "Update" : "Set Date"
                  )}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
