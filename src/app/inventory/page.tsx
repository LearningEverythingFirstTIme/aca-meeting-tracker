"use client";

import { useEffect, useState } from "react";
import { getClientDb } from "@/lib/firebase/client";
import { motion, AnimatePresence } from "framer-motion";
import { collection, doc, onSnapshot, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { ClipboardList, Save, CheckCircle, Calendar, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, History, Edit2, X, Sparkles } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/components/auth-provider";
import { toLocalDayKey } from "@/lib/date";
import { dailyInventorySchema, type DailyInventoryInput } from "@/lib/validators";
import type { DailyInventory } from "@/types";

const INVENTORY_PROMPTS = [
  {
    key: "resentments" as const,
    label: "Resentments",
    question: "Where was I resentful today?",
    placeholder: "e.g., at work, my neighbor...",
    color: "var(--coral-warm)",
    icon: "💭",
  },
  {
    key: "fears" as const,
    label: "Fears",
    question: "Where was I afraid?",
    placeholder: "e.g., money, health, rejection...",
    color: "var(--butter-warm)",
    icon: "🌤️",
  },
  {
    key: "dishonesty" as const,
    label: "Selfish / Dishonest",
    question: "Where was I selfish or dishonest?",
    placeholder: "e.g., white lie, hid my feelings...",
    color: "var(--lavender-soft)",
    icon: "🪞",
  },
  {
    key: "amends" as const,
    label: "Amends",
    question: "Do I owe anyone an amends?",
    placeholder: "e.g., said something harsh to...",
    color: "var(--sky-soft)",
    icon: "🤝",
  },
  {
    key: "gratitude" as const,
    label: "Gratitude",
    question: "What am I grateful for today?",
    placeholder: "e.g., my health, a friend, a meeting...",
    color: "var(--mint-cool)",
    icon: "✨",
  },
];

export default function InventoryPage() {
  const { user } = useAuth();
  const [db, setDb] = useState<ReturnType<typeof getClientDb> | null>(null);
  const todayKey = toLocalDayKey();
  
  const [todayInventory, setTodayInventory] = useState<DailyInventory | null>(null);
  const [pastInventory, setPastInventory] = useState<DailyInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  
  // Date browser state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'today' | 'browse'>('today');
  const [editMode, setEditMode] = useState(false);
  
  // Form state
  const [values, setValues] = useState<DailyInventoryInput>({
    resentments: "",
    fears: "",
    dishonesty: "",
    amends: "",
    gratitude: "",
  });

  // Initialize Firebase DB on client side
  useEffect(() => {
    try {
      setDb(getClientDb());
    } catch {
      // Firebase not configured
    }
  }, []);

  // Subscribe to user's inventory entries
  useEffect(() => {
    if (!user || !db) return;

    const inventoryQuery = query(
      collection(db, "dailyInventory"),
      where("userId", "==", user.uid),
    );

    const unsub = onSnapshot(
      inventoryQuery,
      (snapshot) => {
        const entries = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            userId: data.userId,
            date: data.date,
            resentments: data.resentments,
            fears: data.fears,
            dishonesty: data.dishonesty,
            amends: data.amends,
            gratitude: data.gratitude,
            createdAt: data.createdAt?.toDate?.(),
            updatedAt: data.updatedAt?.toDate?.(),
          } satisfies DailyInventory;
        });

        // Sort by date descending
        entries.sort((a, b) => b.date.localeCompare(a.date));

        // Find today's entry
        const today = entries.find((e) => e.date === todayKey);
        setTodayInventory(today || null);
        
        // Set past entries (excluding today)
        setPastInventory(entries.filter((e) => e.date !== todayKey));

        // Pre-fill form if today's entry exists
        if (today) {
          setValues({
            resentments: today.resentments || "",
            fears: today.fears || "",
            dishonesty: today.dishonesty || "",
            amends: today.amends || "",
            gratitude: today.gratitude || "",
          });
        }

        setLoading(false);
      },
      () => {
        setError("Unable to load inventory.");
        setLoading(false);
      },
    );

    return () => unsub();
  }, [db, user, todayKey]);

  const handleSave = async () => {
    if (!user || !db) return;

    setSaving(true);
    setError(null);

    const parsed = dailyInventorySchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid input");
      setSaving(false);
      return;
    }

    // Determine which date we're saving for
    const targetDate = isViewingToday ? todayKey : (selectedDate || todayKey);

    try {
      const docId = `${user.uid}_${targetDate}`;
      const docRef = doc(db, "dailyInventory", docId);

      await setDoc(docRef, {
        userId: user.uid,
        date: targetDate,
        ...parsed.data,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      }, { merge: true });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setEditMode(false);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    // Load the current viewing entry's values into the form
    const entryToEdit = viewingEntry;
    if (entryToEdit) {
      setValues({
        resentments: entryToEdit.resentments || "",
        fears: entryToEdit.fears || "",
        dishonesty: entryToEdit.dishonesty || "",
        amends: entryToEdit.amends || "",
        gratitude: entryToEdit.gratitude || "",
      });
    } else {
      // Start fresh if no entry exists
      setValues({
        resentments: "",
        fears: "",
        dishonesty: "",
        amends: "",
        gratitude: "",
      });
    }
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    // Reset to current entry's values
    const entryToEdit = viewingEntry;
    if (entryToEdit) {
      setValues({
        resentments: entryToEdit.resentments || "",
        fears: entryToEdit.fears || "",
        dishonesty: entryToEdit.dishonesty || "",
        amends: entryToEdit.amends || "",
        gratitude: entryToEdit.gratitude || "",
      });
    }
  };

  const hasChanges = () => {
    const compareEntry = isViewingToday ? todayInventory : viewingEntry;
    if (!compareEntry) {
      return Object.values(values).some(v => v && v.trim() !== "");
    }
    return (
      values.resentments !== (compareEntry.resentments || "") ||
      values.fears !== (compareEntry.fears || "") ||
      values.dishonesty !== (compareEntry.dishonesty || "") ||
      values.amends !== (compareEntry.amends || "") ||
      values.gratitude !== (compareEntry.gratitude || "")
    );
  };

  // Get all inventory entries sorted by date (including today)
  const allEntries = [todayInventory, ...pastInventory].filter(Boolean) as DailyInventory[];
  
  // Get current viewing entry
  const getViewingEntry = (): DailyInventory | null => {
    if (viewMode === 'today') return todayInventory;
    if (selectedDate) {
      return allEntries.find(e => e.date === selectedDate) || null;
    }
    return null;
  };

  const viewingEntry = getViewingEntry();
  const isViewingToday = viewMode === 'today' || selectedDate === todayKey;

  // Navigate to previous/next entry
  const navigateToEntry = (direction: 'prev' | 'next') => {
    const sortedEntries = [...allEntries].sort((a, b) => b.date.localeCompare(a.date));
    const currentIndex = selectedDate 
      ? sortedEntries.findIndex(e => e.date === selectedDate)
      : viewMode === 'today' ? 0 : -1;
    
    if (direction === 'prev' && currentIndex < sortedEntries.length - 1) {
      const nextEntry = sortedEntries[currentIndex + 1];
      setSelectedDate(nextEntry.date);
      setViewMode('browse');
      setEditMode(false);
    } else if (direction === 'next' && currentIndex > 0) {
      const prevEntry = sortedEntries[currentIndex - 1];
      setSelectedDate(prevEntry.date);
      setViewMode('browse');
      setEditMode(false);
    } else if (direction === 'next' && currentIndex === 0) {
      // Going forward from most recent goes to today
      setSelectedDate(null);
      setViewMode('today');
      setEditMode(false);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get days ago text
  const getDaysAgo = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--leaf-dew)] to-[var(--earth-cream)]">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="forest-card p-12 text-center">
            <ClipboardList size={48} className="mx-auto mb-4 text-[var(--forest-light)]" />
            <h1 className="font-semibold text-2xl mb-2 text-[var(--forest-deep)]">Sign In Required</h1>
            <p className="text-sm text-[var(--earth-wood)]">Please sign in to keep your daily inventory.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--lavender-soft)]/30 via-[var(--leaf-dew)] to-[var(--earth-cream)]">
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="forest-card p-6 mb-6 bg-gradient-to-r from-[var(--forest-mid)] to-[var(--forest-light)]"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <ClipboardList size={20} className="text-[var(--forest-mid)]" />
            </div>
            <h1 className="font-semibold text-2xl text-white">
              Step 10: Daily Inventory
            </h1>
          </div>
          <p className="text-sm text-white/90 ml-13 pl-1 italic">
            &ldquo;Continued to take personal inventory and when we were wrong promptly admitted it.&rdquo;
          </p>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="forest-card p-4 mb-6 bg-gradient-to-r from-[var(--coral)] to-[var(--coral-warm)] border-[var(--coral)]"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-white rounded-full" />
                <span className="font-medium text-sm text-white">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Date Browser Navigation */}
        {allEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="forest-card p-4 mb-6 bg-white"
          >
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateToEntry('prev')}
                disabled={selectedDate === allEntries[allEntries.length - 1]?.date && viewMode === 'browse'}
                className="p-2 rounded-xl bg-[var(--leaf-dew)] hover:bg-[var(--forest-pale)]/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} className="text-[var(--forest-deep)]" />
              </button>
              
              <div className="text-center">
                <p className="font-semibold text-sm text-[var(--forest-deep)]">
                  {isViewingToday ? "Today" : formatDate(selectedDate || todayKey)}
                </p>
                {!isViewingToday && (
                  <p className="text-xs text-[var(--earth-wood)]">
                    {getDaysAgo(selectedDate || '')}
                  </p>
                )}
              </div>
              
              <button
                onClick={() => navigateToEntry('next')}
                disabled={isViewingToday}
                className="p-2 rounded-xl bg-[var(--leaf-dew)] hover:bg-[var(--forest-pale)]/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} className="text-[var(--forest-deep)]" />
              </button>
            </div>

            {/* Date Quick Select */}
            <div className="mt-4 pt-4 border-t border-[var(--earth-sand)]">
              <p className="text-xs mb-3 text-[var(--earth-wood)] font-medium">Jump to:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setViewMode('today'); setSelectedDate(null); setEditMode(false); }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    isViewingToday 
                      ? 'bg-[var(--forest-mid)] text-white border-[var(--forest-mid)]' 
                      : 'bg-white text-[var(--forest-deep)] border-[var(--earth-sand)] hover:border-[var(--forest-pale)]'
                  }`}
                >
                  Today
                </button>
                {pastInventory.slice(0, 6).map((entry) => (
                  <button
                    key={entry.date}
                    onClick={() => { setSelectedDate(entry.date); setViewMode('browse'); setEditMode(false); }}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      selectedDate === entry.date 
                        ? 'bg-[var(--forest-mid)] text-white border-[var(--forest-mid)]' 
                        : 'bg-white text-[var(--forest-deep)] border-[var(--earth-sand)] hover:border-[var(--forest-pale)]'
                    }`}
                  >
                    {getDaysAgo(entry.date)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Inventory Display (View or Edit) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="forest-card p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[var(--earth-sand)]">
            <Calendar size={18} className="text-[var(--forest-light)]" />
            <span className="font-semibold text-lg text-[var(--forest-deep)]">
              {isViewingToday ? "Today" : formatDate(selectedDate || todayKey)}
            </span>
            {viewingEntry && (
              <span className="ml-auto flex items-center gap-1 text-xs text-[var(--mint)] font-medium">
                <CheckCircle size={14} /> Saved
              </span>
            )}
            {!isViewingToday && !viewingEntry && (
              <span className="ml-auto text-xs text-[var(--earth-wood)]">
                No entry
              </span>
            )}
          </div>

          {isViewingToday || editMode ? (
            /* Edit Form (for Today or Past Entries in Edit Mode) */
            <>
              <div className="space-y-5">
                {INVENTORY_PROMPTS.map((prompt, index) => (
                  <motion.div
                    key={prompt.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <label className="block mb-2">
                      <span 
                        className="text-xs px-3 py-1 rounded-full font-medium inline-flex items-center gap-1.5 mb-2"
                        style={{ background: prompt.color, color: 'var(--forest-deep)' }}
                      >
                        <span>{prompt.icon}</span>
                        {prompt.label}
                      </span>
                      <span className="block text-sm text-[var(--forest-deep)] font-medium">{prompt.question}</span>
                    </label>
                    <input
                      type="text"
                      value={values[prompt.key] || ""}
                      onChange={(e) => setValues(prev => ({ ...prev, [prompt.key]: e.target.value }))}
                      placeholder={prompt.placeholder}
                      maxLength={200}
                      className="forest-input w-full text-sm"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Save/Cancel Buttons */}
              <div className="mt-6 pt-4 border-t border-[var(--earth-sand)] flex gap-3">
                <motion.button
                  whileHover={!saving ? { scale: 1.02 } : {}}
                  whileTap={!saving ? { scale: 0.98 } : {}}
                  onClick={handleSave}
                  disabled={saving || !hasChanges()}
                  className={`flex-1 py-3 px-6 rounded-full font-medium flex items-center justify-center gap-2 transition-all ${
                    saved 
                      ? "bg-[var(--mint)] text-[var(--forest-deep)]" 
                      : hasChanges()
                        ? "forest-button"
                        : "bg-[var(--earth-sand)] text-[var(--earth-wood)] cursor-not-allowed"
                  }`}
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block h-4 w-4 border-2 border-[var(--forest-deep)] border-t-transparent rounded-full"
                      />
                      Saving...
                    </span>
                  ) : saved ? (
                    <>
                      <CheckCircle size={16} /> Saved!
                    </>
                  ) : (
                    <>
                      <Save size={16} /> {isViewingToday ? "Save" : "Update"}
                    </>
                  )}
                </motion.button>
                
                {!isViewingToday && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancelEdit}
                    className="py-3 px-6 rounded-full border border-[var(--earth-sand)] bg-white text-[var(--forest-deep)] hover:bg-[var(--leaf-dew)] transition-colors font-medium"
                  >
                    <X size={16} /> Cancel
                  </motion.button>
                )}
              </div>
            </>
          ) : (
            /* Past Entry View (Read Only with Edit Button) */
            <div className="space-y-5">
              {viewingEntry ? (
                <>
                  {INVENTORY_PROMPTS.map((prompt, index) => (
                    <motion.div
                      key={prompt.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={!viewingEntry[prompt.key] ? 'opacity-40' : ''}
                    >
                      <div className="flex items-start gap-3">
                        <span 
                          className="text-xs px-3 py-1 rounded-full font-medium shrink-0 flex items-center gap-1"
                          style={{ background: prompt.color, color: 'var(--forest-deep)' }}
                        >
                          <span>{prompt.icon}</span>
                          {prompt.label}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[var(--forest-deep)] mb-1">{prompt.question}</p>
                          <p className="text-sm text-[var(--earth-wood)]">
                            {viewingEntry[prompt.key] || "—"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Edit Button for Past Entries */}
                  <div className="pt-4 border-t border-[var(--earth-sand)]">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEdit}
                      className="w-full py-3 px-6 rounded-full bg-[var(--butter)] text-[var(--forest-deep)] font-medium flex items-center justify-center gap-2 hover:bg-[var(--butter-warm)] transition-colors"
                    >
                      <Edit2 size={16} /> Edit This Entry
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center py-12">
                    <History size={48} className="mx-auto mb-4 text-[var(--forest-pale)]" />
                    <p className="text-sm text-[var(--earth-wood)] mb-4">
                      No inventory was recorded for this day.
                    </p>
                  </div>
                  
                  {/* Create Entry Button for Empty Days */}
                  <div className="pt-4 border-t border-[var(--earth-sand)]">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEdit}
                      className="w-full py-3 px-6 rounded-full forest-button flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} /> Add Entry for This Day
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          )}
        </motion.div>

        {/* Stats Summary */}
        {allEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="forest-card p-6 bg-gradient-to-br from-[var(--mint-cool)]/20 to-white"
          >
            <h3 className="font-semibold text-lg mb-4 text-[var(--forest-deep)] flex items-center gap-2">
              <Sparkles size={18} className="text-[var(--mint)]" />
              Your Inventory History
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white p-4 text-center border border-[var(--earth-sand)]">
                <p className="text-3xl font-bold text-[var(--forest-mid)]">{allEntries.length}</p>
                <p className="text-xs text-[var(--earth-wood)]">Total Entries</p>
              </div>
              <div className="rounded-2xl bg-white p-4 text-center border border-[var(--earth-sand)]">
                <p className="text-3xl font-bold text-[var(--forest-mid)]">
                  {allEntries.filter(e => e.gratitude).length}
                </p>
                <p className="text-xs text-[var(--earth-wood)]">Gratitude Entries</p>
              </div>
            </div>
            <p className="text-xs text-[var(--earth-wood)] mt-4 text-center">
              Keep coming back! Progress, not perfection.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
