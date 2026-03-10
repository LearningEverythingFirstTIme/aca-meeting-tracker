"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { meetingSchema, type MeetingInput } from "@/lib/validators";

interface MeetingFormProps {
  initialValues?: MeetingInput;
  submitLabel: string;
  onSubmit: (values: MeetingInput) => Promise<void>;
  onCancel?: () => void;
}

const inputVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  },
};

const errorVariants = {
  hidden: { height: 0, opacity: 0 },
  show: { 
    height: "auto", 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    height: 0, 
    opacity: 0,
    transition: { duration: 0.15 }
  },
};

export const MeetingForm = ({
  initialValues = { name: "", location: "", time: "" },
  submitLabel,
  onSubmit,
  onCancel,
}: MeetingFormProps) => {
  const [values, setValues] = useState<MeetingInput>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsed = meetingSchema.safeParse(values);
    if (!parsed.success) {
      const errMsg = parsed.error.issues[0]?.message ?? "Input validation failed";
      setError(errMsg);
      setShakeKey(k => k + 1);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(parsed.data);
      if (!initialValues.name) {
        setValues({ name: "", location: "", time: "" });
      }
    } catch {
      setError("Could not save meeting");
      setShakeKey(k => k + 1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      key={shakeKey}
      initial={{ opacity: 0, y: -10 }}
      animate={shakeKey > 0 ? { x: [-4, 4, -4, 4, 0] } : { opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: shakeKey > 0 ? 0.3 : 0.3 }}
      onSubmit={handleSubmit}
      className="forest-card p-6"
    >
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[var(--earth-sand)]">
        <motion.div 
          className="h-3 w-3 rounded-full bg-[var(--butter)]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="font-semibold text-sm text-[var(--forest-deep)]">Meeting Data</span>
      </div>

      <motion.div variants={inputVariants} initial="hidden" animate="show" transition={{ delay: 0.05 }}>
        <label className="block text-sm font-medium text-[var(--forest-deep)] mb-2">
          Meeting Name
        </label>
        <input
          value={values.name}
          onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Morning Serenity"
          className="forest-input w-full mb-4"
          required
        />
      </motion.div>

      <motion.div variants={inputVariants} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
        <label className="block text-sm font-medium text-[var(--forest-deep)] mb-2">
          Location
        </label>
        <input
          value={values.location}
          onChange={(e) => setValues((prev) => ({ ...prev, location: e.target.value }))}
          placeholder="Community Center - Room 2"
          className="forest-input w-full mb-4"
          required
        />
      </motion.div>

      <motion.div variants={inputVariants} initial="hidden" animate="show" transition={{ delay: 0.15 }}>
        <label className="block text-sm font-medium text-[var(--forest-deep)] mb-2">
          Time
        </label>
        <input
          type="time"
          value={values.time}
          onChange={(e) => setValues((prev) => ({ ...prev, time: e.target.value }))}
          className="forest-input w-full mb-4"
          required
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            variants={errorVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="bg-[var(--coral)] rounded-xl p-4 mb-4"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-white rounded-full" />
              <span className="text-xs text-white">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 pt-2">
        <motion.button
          whileHover={!submitting ? { scale: 1.02 } : {}}
          whileTap={!submitting ? { scale: 0.98 } : {}}
          type="submit"
          disabled={submitting}
          className="flex-1 py-3 rounded-full forest-button"
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
            submitLabel
          )}
        </motion.button>
        
        {onCancel ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-full border border-[var(--earth-sand)] bg-white text-[var(--forest-deep)] font-medium hover:bg-[var(--leaf-dew)] transition-colors"
          >
            Cancel
          </motion.button>
        ) : null}
      </div>
    </motion.form>
  );
};
