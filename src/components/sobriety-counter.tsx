"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit3, Award, Calendar } from "lucide-react";
import {
  calculateDaysSober,
  getCurrentMilestone,
  getNextMilestone,
  getMilestoneProgress,
  formatSobrietyDate,
  getAnniversaryText,
  SOBRIETY_MILESTONES,
} from "@/lib/sobriety-utils";

interface SobrietyCounterProps {
  sobrietyDate: string | null;
  onEdit: () => void;
}

const chipGlowByColor: Record<string, string> = {
  "#FFFFFF": "0 0 20px rgba(255,255,255,0.8)",
  "#C0C0C0": "0 0 20px rgba(192,192,192,0.6)",
  "#FF0000": "0 0 20px rgba(255,0,0,0.5)",
  "#4169E1": "0 0 20px rgba(65,105,225,0.5)",
  "#FFD700": "0 0 25px rgba(255,215,0,0.7)",
  "#228B22": "0 0 20px rgba(34,139,34,0.5)",
  "#CD7F32": "0 0 20px rgba(205,127,50,0.5)",
  "#A9A9A9": "0 0 20px rgba(169,169,169,0.5)",
  "#8B4513": "0 0 20px rgba(139,69,19,0.5)",
  "#B8860B": "0 0 20px rgba(184,134,11,0.5)",
  "#000000": "0 0 20px rgba(100,100,100,0.5)",
};

export const SobrietyCounter = ({ sobrietyDate, onEdit }: SobrietyCounterProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!sobrietyDate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="forest-card p-6 border-2 border-dashed border-[var(--coral)] bg-gradient-to-br from-white to-[var(--coral-pale)]/30"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            className="inline-block mb-4"
          >
            <div className="h-16 w-16 bg-gradient-to-br from-[var(--coral)] to-[var(--coral-warm)] rounded-full mx-auto flex items-center justify-center shadow-lg">
              <Award size={32} className="text-white" />
            </div>
          </motion.div>
          <h3 className="font-semibold text-xl mb-2 text-[var(--forest-deep)]">Track Your Recovery</h3>
          <p className="text-xs mb-4 text-[var(--earth-wood)]">
            Set your sobriety date to track progress and celebrate milestones.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEdit}
            className="w-full py-3 rounded-full forest-button"
          >
            <Calendar size={14} className="inline mr-2" />
            Set Sobriety Date
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const daysSober = calculateDaysSober(sobrietyDate);
  const currentMilestone = getCurrentMilestone(daysSober);
  const nextMilestone = getNextMilestone(daysSober);
  const progress = getMilestoneProgress(daysSober);
  const anniversaryText = getAnniversaryText(daysSober);

  // Calculate years, months, days breakdown
  const years = Math.floor(daysSober / 365);
  const remainingAfterYears = daysSober % 365;
  const months = Math.floor(remainingAfterYears / 30);
  const days = remainingAfterYears % 30;

  if (!mounted) {
    return (
      <div className="forest-card p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-[var(--earth-sand)] rounded-xl w-32 mb-4"></div>
          <div className="h-16 bg-[var(--earth-sand)] rounded-xl w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="forest-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ 
              boxShadow: currentMilestone 
                ? [chipGlowByColor[currentMilestone.chipColor] || 'none', 'none', chipGlowByColor[currentMilestone.chipColor] || 'none']
                : 'none'
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-10 w-10 rounded-full flex items-center justify-center border-2 border-white shadow-md"
            style={{ 
              backgroundColor: currentMilestone?.chipColor || 'var(--butter)',
            }}
          >
            <Award 
              size={20} 
              className={currentMilestone?.chipColor === '#000000' ? 'text-white' : 'text-[var(--forest-deep)]'} 
            />
          </motion.div>
          <span className="font-semibold text-sm text-[var(--forest-deep)]">Sobriety Counter</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={onEdit}
          className="p-2 rounded-xl border border-[var(--earth-sand)] bg-white hover:bg-[var(--butter)] transition-colors"
        >
          <Edit3 size={14} className="text-[var(--forest-deep)]" />
        </motion.button>
      </div>

      {/* Main Counter */}
      <div className="text-center mb-6">
        <motion.div
          key={daysSober}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <p className="text-6xl md:text-7xl font-bold text-[var(--forest-deep)] leading-none">
            {daysSober}
          </p>
          <p className="text-sm text-[var(--earth-wood)] mt-1">Days in Recovery</p>
        </motion.div>
        
        <motion.p 
          className="text-lg mt-3 text-[var(--forest-mid)] font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {anniversaryText}
        </motion.p>
      </div>

      {/* Breakdown */}
      {(years > 0 || months > 0) && (
        <motion.div 
          className="flex justify-center gap-4 mb-6 pb-4 border-b border-dashed border-[var(--earth-sand)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {years > 0 && (
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--forest-deep)]">{years}</p>
              <p className="text-[10px] text-[var(--earth-wood)]">Year{years !== 1 ? 's' : ''}</p>
            </div>
          )}
          {months > 0 && (
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--forest-deep)]">{months}</p>
              <p className="text-[10px] text-[var(--earth-wood)]">Month{months !== 1 ? 's' : ''}</p>
            </div>
          )}
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--forest-deep)]">{days}</p>
            <p className="text-[10px] text-[var(--earth-wood)]">Day{days !== 1 ? 's' : ''}</p>
          </div>
        </motion.div>
      )}

      {/* Sobriety Date */}
      <div className="flex items-center justify-center gap-2 mb-4 text-[var(--earth-wood)]">
        <Calendar size={12} />
        <span className="text-xs">Since {formatSobrietyDate(sobrietyDate)}</span>
      </div>

      {/* Current Milestone */}
      {currentMilestone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[var(--butter)] to-[var(--butter-warm)]/50 rounded-2xl p-4 mb-4 border border-[var(--earth-sand)]"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  chipGlowByColor[currentMilestone.chipColor] || 'none',
                  `${chipGlowByColor[currentMilestone.chipColor] || 'none'} inset 0 0 10px`,
                  chipGlowByColor[currentMilestone.chipColor] || 'none'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-12 w-12 rounded-full border-2 border-white flex-shrink-0 shadow-md"
              style={{ backgroundColor: currentMilestone.chipColor }}
            />
            <div>
              <p className="text-[10px] text-[var(--earth-wood)]">Current Chip</p>
              <p className="text-lg font-bold" style={{ color: currentMilestone.chipColor === '#000000' ? 'var(--forest-deep)' : currentMilestone.chipColor }}>
                {currentMilestone.label}
              </p>
              <p className="text-[10px] text-[var(--earth-wood)]">{currentMilestone.description}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress to Next Milestone */}
      {nextMilestone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[var(--earth-wood)]">Progress to {nextMilestone.label}</span>
            <span className="text-[10px] text-[var(--forest-deep)]">{Math.round(progress.percent)}%</span>
          </div>
          <div className="h-3 bg-[var(--earth-sand)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.percent}%` }}
              transition={{ duration: 1, delay: 0.4, type: "spring" }}
              className="h-full bg-gradient-to-r from-[var(--mint)] to-[var(--forest-light)] rounded-full"
            />
          </div>
          <p className="text-[10px] text-center text-[var(--earth-wood)]">
            {nextMilestone.days - daysSober} days to go
          </p>
        </motion.div>
      )}

      {/* Milestone Grid */}
      <div className="mt-6 pt-4 border-t border-dashed border-[var(--earth-sand)]">
        <p className="text-[10px] text-[var(--earth-wood)] mb-3">Milestone Chips</p>
        <div className="flex flex-wrap gap-2">
          {SOBRIETY_MILESTONES.slice(0, 8).map((milestone, index) => {
            const isAchieved = daysSober >= milestone.days;
            const isNext = nextMilestone?.days === milestone.days;
            
            return (
              <motion.div
                key={milestone.days}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className={`h-6 w-6 rounded-full border-2 border-white shadow-sm ${isAchieved ? '' : 'grayscale opacity-40'}`}
                style={{ 
                  backgroundColor: milestone.chipColor,
                  boxShadow: isNext ? chipGlowByColor[milestone.chipColor] : 'none'
                }}
                title={`${milestone.label}: ${milestone.description}`}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
