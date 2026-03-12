"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Edit2,
  Trash2,
  CheckCircle,
  Plus,
  Activity,
  Calendar,
  GripVertical,
  LayoutGrid,
  Save,
  X,
} from "lucide-react";
import { getClientDb } from "@/lib/firebase/client";
import { useAuth } from "@/components/auth-provider";
import { useHaptics } from "@/components/haptics-provider";
import { Navigation } from "@/components/navigation";
import { MeetingForm } from "@/components/meeting-form";
import { TreasurySummary } from "@/components/treasury/treasury-summary";
import { SobrietyCounter } from "@/components/sobriety-counter";
import { SobrietySetup } from "@/components/sobriety-setup";
import { addDays, formatDateTime, formatShortDate, makeCheckinId, startOfWeek, toLocalDayKey } from "@/lib/date";
import { getTodayDate } from "@/lib/treasury-utils";
import { checkinUpdateSchema, dashboardLayoutSchema, normalizeDashboardLayout } from "@/lib/validators";
import { DASHBOARD_SECTION_IDS, type Checkin, type DashboardSectionId, type Meeting, type UserProfile } from "@/types";
import type { MeetingInput, SobrietyDateInput } from "@/lib/validators";

const safeDate = (value: unknown): Date | undefined => {
  if (!value || typeof value !== "object") return undefined;
  if ("toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate();
  }
  return undefined;
};

const timeLabel = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
} as const;

const statCardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  show: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { duration: 0.5, type: "spring" as const, stiffness: 150, damping: 15 }
  },
};

const meetingCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.4, type: "spring" as const, stiffness: 120, damping: 15 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.98,
    transition: { duration: 0.25 }
  },
};

const logItemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" as const }
  },
};

const ACTIVITY_WEEKS = 16;
const ACTIVITY_LEVELS = [0, 1, 2, 3, 4] as const;

const activityToneByLevel = [
  "var(--leaf-dew)",
  "var(--forest-light)",
  "var(--forest-mid)",
  "var(--forest-deep)",
  "var(--earth-brown)",
] as const;

const activityShadowByLevel = [
  "0 2px 4px rgba(0,0,0,0.05)",
  "0 2px 6px rgba(45,90,60,0.15)",
  "0 2px 6px rgba(45,90,60,0.2)",
  "0 2px 6px rgba(45,90,60,0.25)",
  "0 2px 8px rgba(45,90,60,0.3)",
] as const;

const activityLevelForCount = (count: number) => {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
};

const weekdayLabels = ["MON", "WED", "FRI"];

type DashboardSectionDefinition = {
  id: DashboardSectionId;
  label: string;
  hint: string;
  className?: string;
  content: ReactNode;
};

type SortableDashboardSectionProps = DashboardSectionDefinition & {
  isEditing: boolean;
};

const dashboardStatCardClass = "forest-stat";

const SortableDashboardSection = ({
  id,
  label,
  hint,
  className,
  content,
  isEditing,
}: SortableDashboardSectionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isEditing });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${className ?? ""} ${isDragging ? "z-20" : ""}`.trim()}
    >
      <div
        className={[
          "relative h-full",
          isEditing
            ? "rounded-3xl border-2 border-dashed border-[var(--earth-sand)] bg-[var(--earth-cream)]/50 p-4"
            : "",
          isDragging ? "opacity-90" : "",
        ].join(" ")}
        style={isEditing ? { boxShadow: "0 8px 32px rgba(45,90,60,0.12)" } : undefined}
      >
        {isEditing ? (
          <div className="mb-3 flex items-center justify-between gap-3 border-b border-dashed border-[var(--earth-sand)] pb-3">
            <div>
              <p className="forest-title text-sm text-[var(--forest-deep)]">{label}</p>
              <p className="text-[10px] text-[var(--forest-mid)]/70">{hint}</p>
            </div>
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="forest-button flex items-center gap-2 px-3 py-2 text-[10px]"
              style={{ touchAction: "none" }}
              aria-label={`Drag ${label}`}
            >
              <GripVertical size={12} strokeWidth={2} /> DRAG
            </button>
          </div>
        ) : null}

        <div className={isEditing ? "pointer-events-none select-none" : ""}>{content}</div>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const { user } = useAuth();
  const { trigger, isSupported } = useHaptics();
  const db = getClientDb();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [pendingCheckinId, setPendingCheckinId] = useState<string | null>(null);
  const [checkinSuccessId, setCheckinSuccessId] = useState<string | null>(null);
  const [showSobrietySetup, setShowSobrietySetup] = useState(false);
  const [isEditingLayout, setIsEditingLayout] = useState(false);
  const [isSavingLayout, setIsSavingLayout] = useState(false);
  const [savedLayout, setSavedLayout] = useState<DashboardSectionId[]>(() => [...DASHBOARD_SECTION_IDS]);
  const [draftLayout, setDraftLayout] = useState<DashboardSectionId[]>(() => [...DASHBOARD_SECTION_IDS]);
  
  // Check-in editing state
  const [editingCheckinId, setEditingCheckinId] = useState<string | null>(null);
  const [editingCheckinNote, setEditingCheckinNote] = useState("");
  const [editingCheckinDate, setEditingCheckinDate] = useState("");

  const profileRef = useMemo(
    () => (user ? doc(db, "userProfiles", user.uid) : null),
    [db, user],
  );

  useEffect(() => {
    if (!user || !profileRef) return;

    const meetingsQuery = query(
      collection(db, "meetings"),
      where("userId", "==", user.uid),
    );

    const checkinsQuery = query(
      collection(db, "checkins"),
      where("userId", "==", user.uid),
    );

    const unsubMeetings = onSnapshot(
      meetingsQuery,
      (snapshot) => {
        setMeetings(
          snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              userId: data.userId,
              name: data.name,
              location: data.location,
              time: data.time,
              createdAt: safeDate(data.createdAt),
              updatedAt: safeDate(data.updatedAt),
            } satisfies Meeting;
          }),
        );
        setLoading(false);
      },
      () => {
        setError("Unable to load meetings.");
        setLoading(false);
      },
    );

    const unsubCheckins = onSnapshot(
      checkinsQuery,
      (snapshot) => {
        const parsed = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            userId: data.userId,
            meetingId: data.meetingId,
            meetingName: data.meetingName,
            dayKey: data.dayKey,
            note: data.note,
            createdAt: safeDate(data.createdAt),
          } satisfies Checkin;
        });

        parsed.sort((a, b) => {
          const aTime = a.createdAt?.getTime() ?? 0;
          const bTime = b.createdAt?.getTime() ?? 0;
          return bTime - aTime;
        });

        setCheckins(parsed);
      },
      (err) => {
        if (err instanceof FirebaseError) {
          setError(`Unable to load check-ins (${err.code}).`);
          return;
        }
        setError("Unable to load check-ins.");
      },
    );

    // Subscribe to user profile
    const unsubProfile = onSnapshot(
      profileRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setUserProfile({
            userId: snapshot.id,
            sobrietyDate: data.sobrietyDate,
            dashboardLayout: normalizeDashboardLayout(data.dashboardLayout),
            updatedAt: safeDate(data.updatedAt),
          });
        } else {
          setUserProfile(null);
        }
      },
      () => {
        // Profile might not exist yet, that's okay
        setUserProfile(null);
      }
    );

    return () => {
      unsubMeetings();
      unsubCheckins();
      unsubProfile();
    };
  }, [db, profileRef, user]);

  useEffect(() => {
    if (isEditingLayout) return;

    const nextLayout = normalizeDashboardLayout(userProfile?.dashboardLayout);
    setSavedLayout(nextLayout);
    setDraftLayout(nextLayout);
  }, [isEditingLayout, userProfile]);

  const meetingById = useMemo(
    () => new Map(meetings.map((meeting) => [meeting.id, meeting])),
    [meetings],
  );

  const todayKey = toLocalDayKey();

  const thisWeekCheckins = useMemo(() => {
    const weekStart = startOfWeek();
    return checkins.filter((entry) => entry.createdAt && entry.createdAt >= weekStart);
  }, [checkins]);

  const checkinsByMeeting = useMemo(() => {
    const map = new Map<string, Checkin[]>();
    for (const checkin of checkins) {
      const list = map.get(checkin.meetingId) ?? [];
      list.push(checkin);
      map.set(checkin.meetingId, list);
    }
    return map;
  }, [checkins]);

  const activityGrid = useMemo(() => {
    const dayCounts = new Map<string, number>();
    for (const entry of checkins) {
      dayCounts.set(entry.dayKey, (dayCounts.get(entry.dayKey) ?? 0) + 1);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = startOfWeek(addDays(today, -(ACTIVITY_WEEKS - 1) * 7));
    const weeks = [] as Array<{
      label: string;
      days: Array<{
        key: string;
        date: Date;
        count: number;
        level: number;
        isToday: boolean;
      }>;
    }>;

    for (let weekIndex = 0; weekIndex < ACTIVITY_WEEKS; weekIndex += 1) {
      const weekStart = addDays(start, weekIndex * 7);
      const days = Array.from({ length: 7 }, (_, dayOffset) => {
        const date = addDays(weekStart, dayOffset);
        const key = toLocalDayKey(date);
        const count = dayCounts.get(key) ?? 0;
        return {
          key,
          date,
          count,
          level: activityLevelForCount(count),
          isToday: key === todayKey,
        };
      });

      weeks.push({
        label: weekStart.getDate() <= 7 ? weekStart.toLocaleString(undefined, { month: "short" }).toUpperCase() : "",
        days,
      });
    }

    return weeks;
  }, [checkins, todayKey]);

  if (!user) return null;

  const activeLayout = isEditingLayout ? draftLayout : savedLayout;

  const beginLayoutEditing = () => {
    setError(null);
    setDraftLayout(savedLayout);
    setIsEditingLayout(true);
  };

  const cancelLayoutEditing = () => {
    setDraftLayout(savedLayout);
    setIsEditingLayout(false);
  };

  const handleLayoutDragEnd = ({ active, over }: DragEndEvent) => {
    if (!isEditingLayout || !over || active.id === over.id) return;

    setDraftLayout((currentLayout) => {
      const oldIndex = currentLayout.indexOf(active.id as DashboardSectionId);
      const newIndex = currentLayout.indexOf(over.id as DashboardSectionId);

      if (oldIndex === -1 || newIndex === -1) {
        return currentLayout;
      }

      return arrayMove(currentLayout, oldIndex, newIndex);
    });
  };

  const saveLayout = async () => {
    if (!profileRef) return;

    setError(null);
    setIsSavingLayout(true);

    const parsed = dashboardLayoutSchema.safeParse(draftLayout);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Layout is invalid.");
      setIsSavingLayout(false);
      return;
    }

    try {
      await setDoc(profileRef, {
        userId: user.uid,
        dashboardLayout: parsed.data,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setSavedLayout(parsed.data);
      setDraftLayout(parsed.data);
      setIsEditingLayout(false);
    } catch (err) {
      if (err instanceof FirebaseError && err.code === "permission-denied") {
        setError("Permission denied. Unable to save your layout.");
      } else {
        setError("Failed to save layout. Please try again.");
      }
    } finally {
      setIsSavingLayout(false);
    }
  };

  const createMeeting = async (values: MeetingInput) => {
    await addDoc(collection(db, "meetings"), {
      userId: user.uid,
      name: values.name,
      location: values.location,
      time: values.time,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const updateMeeting = async (meetingId: string, values: MeetingInput) => {
    const meetingRef = doc(db, "meetings", meetingId);
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(meetingRef);
      if (!snap.exists() || snap.data().userId !== user.uid) {
        throw new Error("Meeting not found.");
      }
      transaction.update(meetingRef, {
        ...values,
        updatedAt: serverTimestamp(),
      });
    });
  };

  const removeMeeting = async (meetingId: string) => {
    const confirmed = window.confirm("Delete this meeting? Existing check-ins will remain in history.");
    if (!confirmed) return;
    await deleteDoc(doc(db, "meetings", meetingId));
  };

  const checkIn = async (meeting: Meeting) => {
    const checkinId = makeCheckinId(user.uid, meeting.id, todayKey);
    const meetingRef = doc(db, "meetings", meeting.id);
    const checkinRef = doc(db, "checkins", checkinId);
    setPendingCheckinId(meeting.id);
    setError(null);

    try {
      await user.getIdToken();

      const existingCheckin = checkins.find(
        (entry) => entry.meetingId === meeting.id && entry.dayKey === todayKey,
      );

      if (existingCheckin) {
        throw new Error("already-checked-in");
      }

      const meetingSnap = await getDoc(meetingRef);

      if (!meetingSnap.exists() || meetingSnap.data().userId !== user.uid) {
        throw new Error("Meeting no longer exists.");
      }

      await setDoc(checkinRef, {
        userId: user.uid,
        meetingId: meeting.id,
        meetingName: meeting.name,
        dayKey: todayKey,
        createdAt: serverTimestamp(),
      });

      setCheckinSuccessId(meeting.id);
      setTimeout(() => setCheckinSuccessId(null), 600);
    } catch (err) {
      if (err instanceof Error && err.message === "already-checked-in") {
        setError(`Already checked in to ${meeting.name} today.`);
        return;
      }

      if (err instanceof FirebaseError && err.code === "permission-denied") {
        try {
          const existingCheckinSnap = await getDoc(checkinRef);
          const existingCheckinData = existingCheckinSnap.data();
          if (
            existingCheckinSnap.exists()
            && existingCheckinData?.userId === user.uid
            && existingCheckinData?.meetingId === meeting.id
            && existingCheckinData?.dayKey === todayKey
          ) {
            setError(`Already checked in to ${meeting.name} today.`);
            return;
          }
        } catch {
          // Ignore follow-up read failures and fall through to the original error.
        }

        setError("Permission denied for this operation.");
        return;
      }

      setError("Check-in failed. Please retry.");
    } finally {
      setPendingCheckinId(null);
    }
  };

  const alreadyCheckedInToday = (meetingId: string): boolean =>
    checkins.some((entry) => entry.meetingId === meetingId && entry.dayKey === todayKey);

  // Sobriety date functions
  const updateSobrietyDate = async (data: SobrietyDateInput) => {
    if (!user) return;
    
    const profileRef = doc(db, "userProfiles", user.uid);
    
    if (data.sobrietyDate) {
      await setDoc(profileRef, {
        userId: user.uid,
        sobrietyDate: data.sobrietyDate,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } else {
      // Clear sobriety date
      await setDoc(profileRef, {
        sobrietyDate: null,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
  };

  // Check-in edit/delete functions
  const startEditingCheckin = (checkin: Checkin) => {
    setEditingCheckinId(checkin.id);
    setEditingCheckinNote(checkin.note || "");
    setEditingCheckinDate(checkin.dayKey);
  };

  const cancelEditingCheckin = () => {
    setEditingCheckinId(null);
    setEditingCheckinNote("");
    setEditingCheckinDate("");
  };

  const saveCheckinEdit = async (checkinId: string) => {
    setError(null);
    
    const parsed = checkinUpdateSchema.safeParse({
      dayKey: editingCheckinDate,
      note: editingCheckinNote,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    try {
      const checkinRef = doc(db, "checkins", checkinId);
      await setDoc(checkinRef, {
        dayKey: parsed.data.dayKey,
        note: parsed.data.note || null,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      cancelEditingCheckin();
    } catch (err) {
      if (err instanceof FirebaseError && err.code === "permission-denied") {
        setError("Permission denied. You can only edit your own check-ins.");
        return;
      }
      setError("Failed to update check-in.");
    }
  };

  const deleteCheckin = async (checkinId: string, meetingName: string) => {
    const confirmed = window.confirm(`Delete check-in for "${meetingName}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "checkins", checkinId));
    } catch (err) {
      if (err instanceof FirebaseError && err.code === "permission-denied") {
        setError("Permission denied. You can only delete your own check-ins.");
        return;
      }
      setError("Failed to delete check-in.");
    }
  };

  const dashboardSections: Record<DashboardSectionId, DashboardSectionDefinition> = {
    sobrietyCounter: {
      id: "sobrietyCounter",
      label: "Sobriety Counter",
      hint: "Progress, milestones, and anniversaries",
      className: "md:col-span-6 lg:col-span-4",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SobrietyCounter
            sobrietyDate={userProfile?.sobrietyDate || null}
            onEdit={() => setShowSobrietySetup(true)}
          />
        </motion.div>
      ),
    },
    weeklyStat: {
      id: "weeklyStat",
      label: "Weekly Check-Ins",
      hint: "This week's total attendance",
      className: "lg:col-span-3",
      content: (
        <motion.article
          variants={statCardVariants}
          initial="hidden"
          animate="show"
          className={`${dashboardStatCardClass} forest-stat-mint`}
        >
          <div className="mb-4 flex items-center gap-2">
            <Calendar size={20} strokeWidth={2} className="text-[var(--forest-deep)]" />
            <span className="forest-title text-sm text-[var(--forest-deep)]">WEEKLY</span>
          </div>
          <div className="mt-auto">
            <motion.p
              className="forest-title text-6xl text-[var(--forest-deep)]"
              key={thisWeekCheckins.length}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {thisWeekCheckins.length}
            </motion.p>
            <p className="mt-2 text-sm font-medium text-[var(--forest-mid)]">Check-ins</p>
          </div>
        </motion.article>
      ),
    },
    activeStat: {
      id: "activeStat",
      label: "Active Meetings",
      hint: "Current number of tracked meetings",
      className: "lg:col-span-3",
      content: (
        <motion.article
          variants={statCardVariants}
          initial="hidden"
          animate="show"
          className={`${dashboardStatCardClass} forest-stat-butter`}
        >
          <div className="mb-4 flex items-center gap-2">
            <Activity size={20} strokeWidth={2} className="text-[var(--earth-brown)]" />
            <span className="forest-title text-sm text-[var(--earth-brown)]">ACTIVE</span>
          </div>
          <div className="mt-auto">
            <p className="forest-title text-6xl text-[var(--earth-brown)]">{meetings.length}</p>
            <p className="mt-2 text-sm font-medium text-[var(--earth-sand)]">Meetings</p>
          </div>
        </motion.article>
      ),
    },
    latestStat: {
      id: "latestStat",
      label: "Latest Check-In",
      hint: "Most recent activity timestamp",
      className: "lg:col-span-3",
      content: (
        <motion.article
          variants={statCardVariants}
          initial="hidden"
          animate="show"
          className={`${dashboardStatCardClass} forest-stat-lavender`}
        >
          <div className="mb-4 flex items-center gap-2">
            <Clock size={20} strokeWidth={2} className="text-[var(--forest-deep)]" />
            <span className="forest-title text-sm text-[var(--forest-deep)]">LATEST</span>
          </div>
          <div className="mt-auto space-y-3">
            <motion.p
              className="text-lg font-medium leading-snug text-[var(--forest-deep)]"
              key={checkins[0]?.id || "none"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {checkins[0]?.createdAt ? formatDateTime(checkins[0].createdAt) : "No data"}
            </motion.p>
            <p className="text-base font-medium text-[var(--forest-mid)]">
              {checkins[0]?.meetingName ?? "No recent check-in"}
            </p>
          </div>
        </motion.article>
      ),
    },
    treasurySummary: {
      id: "treasurySummary",
      label: "Treasury Snapshot",
      hint: "Quick jump to the treasury page",
      className: "lg:col-span-3",
      content: <TreasurySummary className={dashboardStatCardClass} />,
    },
    addMeeting: {
      id: "addMeeting",
      label: "Add Meeting",
      hint: "Create a new meeting card",
      className: "md:col-span-6 lg:col-span-4",
      content: (
        <div className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
            className="rounded-3xl bg-gradient-to-br from-[var(--coral)] to-[#e8a598] p-1 shadow-lg shadow-[var(--coral)]/20"
          >
            <div className="rounded-[20px] bg-[var(--white)]/90 p-4 backdrop-blur-sm">
              <h2 className="forest-title flex items-center gap-2 text-xl text-[var(--forest-deep)]">
                <Plus size={24} strokeWidth={2} /> Add Meeting
              </h2>
            </div>
          </motion.div>

          <MeetingForm submitLabel="Create" onSubmit={createMeeting} />
        </div>
      ),
    },
    recentCheckins: {
      id: "recentCheckins",
      label: "Recent Check-Ins",
      hint: "Edit and review your latest check-ins",
      className: "md:col-span-6 lg:col-span-4",
      content: (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="forest-card rounded-3xl p-6"
        >
          <div className="mb-4 flex items-center gap-2 border-b border-[var(--earth-sand)] pb-3">
            <span className="forest-title text-sm text-[var(--forest-mid)]">◆</span>
            <span className="forest-title text-sm text-[var(--forest-deep)]">Recent Check-ins</span>
          </div>
          <ul className="space-y-2">
            {checkins.slice(0, 8).map((entry) => (
              <motion.li
                variants={logItemVariants}
                key={entry.id}
                className="rounded-2xl border border-[var(--earth-sand)] bg-[var(--earth-cream)]/50 px-3 py-2"
              >
                {editingCheckinId === entry.id ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={editingCheckinDate}
                        onChange={(e) => setEditingCheckinDate(e.target.value)}
                        className="forest-input py-1 text-xs"
                        max={getTodayDate()}
                      />
                    </div>
                    <input
                      type="text"
                      value={editingCheckinNote}
                      onChange={(e) => setEditingCheckinNote(e.target.value)}
                      placeholder="Add a note..."
                      className="forest-input py-1 text-xs"
                      maxLength={200}
                    />
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { if (isSupported) trigger('success'); saveCheckinEdit(entry.id); }}
                        className="rounded-full bg-gradient-to-r from-[var(--forest-mid)] to-[var(--forest-deep)] px-3 py-1.5 text-[10px] font-medium text-white shadow-md shadow-[var(--forest-mid)]/20"
                      >
                        Save
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { if (isSupported) trigger('light'); cancelEditingCheckin(); }}
                        className="rounded-full bg-[var(--earth-sand)] px-3 py-1.5 text-[10px] font-medium text-[var(--forest-deep)]"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium text-[var(--forest-deep)]">{entry.meetingName}</span>
                      {entry.note && (
                        <span className="block truncate text-[10px] text-[var(--forest-mid)]/70">&ldquo;{entry.note}&rdquo;</span>
                      )}
                    </div>
                    <div className="ml-2 flex items-center gap-2">
                      <span className="whitespace-nowrap text-[10px] text-[var(--forest-mid)]">
                        {entry.createdAt ? formatDateTime(entry.createdAt).split(" ")[0] : entry.dayKey}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { if (isSupported) trigger('light'); startEditingCheckin(entry); }}
                        className="rounded-lg border border-[var(--earth-sand)] p-1.5 text-[var(--forest-mid)] hover:bg-[var(--butter)] hover:text-[var(--earth-brown)]"
                      >
                        <Edit2 size={10} strokeWidth={2} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { if (isSupported) trigger('warning'); deleteCheckin(entry.id, entry.meetingName); }}
                        className="rounded-lg border border-[var(--coral)]/30 p-1.5 text-[var(--coral)] hover:bg-[var(--coral)]/10"
                      >
                        <Trash2 size={10} strokeWidth={2} />
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.li>
            ))}
            {checkins.length === 0 ? (
              <li className="text-xs text-[var(--forest-mid)]/60">No records</li>
            ) : null}
          </ul>
        </motion.div>
      ),
    },
    yourMeetings: {
      id: "yourMeetings",
      label: "Your Meetings",
      hint: "Manage meetings and daily check-ins",
      className: "md:col-span-2 lg:col-span-12",
      content: (
        <div className="space-y-6">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
            className="rounded-3xl bg-gradient-to-br from-[var(--forest-mid)] to-[var(--forest-light)] p-1 shadow-lg shadow-[var(--forest-mid)]/20"
          >
            <div className="rounded-[20px] bg-[var(--white)]/90 p-4 backdrop-blur-sm">
              <h2 className="forest-title text-xl text-[var(--forest-deep)]">Your Meetings</h2>
            </div>
          </motion.div>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="forest-card rounded-3xl p-8 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-gradient-to-br from-[var(--butter)] to-[var(--coral)] shadow-lg"
              />
              <p className="forest-title animate-pulse text-[var(--forest-mid)]">Loading...</p>
            </motion.div>
          ) : null}

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {meetings.map((meeting) => {
                const isEditing = editingMeetingId === meeting.id;
                const todaysCheckin = alreadyCheckedInToday(meeting.id);
                const history = checkinsByMeeting.get(meeting.id) ?? [];
                const showSuccess = checkinSuccessId === meeting.id;

                return (
                  <motion.article
                    layout
                    variants={meetingCardVariants}
                    key={meeting.id}
                    className={`forest-card rounded-3xl p-6 ${todaysCheckin ? "ring-2 ring-[var(--forest-mid)]" : ""}`}
                    style={todaysCheckin ? { boxShadow: "0 8px 32px rgba(45,90,60,0.15)" } : {}}
                    whileHover={{ scale: 1.005, y: -2 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    {isEditing ? (
                      <MeetingForm
                        submitLabel="Update"
                        initialValues={{
                          name: meeting.name,
                          location: meeting.location,
                          time: meeting.time,
                        }}
                        onSubmit={async (values) => {
                          await updateMeeting(meeting.id, values);
                          setEditingMeetingId(null);
                        }}
                        onCancel={() => setEditingMeetingId(null)}
                      />
                    ) : (
                      <>
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="mb-2 flex items-center gap-2">
                              <motion.div
                                className={`h-3 w-3 rounded-full border-2 ${todaysCheckin ? "border-[var(--forest-mid)] bg-[var(--forest-mid)]" : "border-[var(--earth-sand)] bg-[var(--leaf-dew)]"}`}
                                animate={showSuccess ? { scale: [1, 1.5, 1] } : {}}
                                transition={{ duration: 0.4 }}
                              />
                              <h3 className="forest-title text-xl text-[var(--forest-deep)]">{meeting.name}</h3>
                            </div>
                            <div className="space-y-1 text-xs text-[var(--forest-mid)]">
                              <div className="flex items-center gap-2">
                                <MapPin size={12} strokeWidth={2} />
                                <span>{meeting.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock size={12} strokeWidth={2} />
                                <span>{timeLabel(meeting.time)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              type="button"
                              onClick={() => { if (isSupported) trigger('light'); setEditingMeetingId(meeting.id); }}
                              className="rounded-full bg-gradient-to-r from-[var(--forest-mid)] to-[var(--forest-light)] px-4 py-2 text-xs font-medium text-white shadow-md shadow-[var(--forest-mid)]/20"
                            >
                              <Edit2 size={12} strokeWidth={2} className="inline mr-1" /> Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              type="button"
                              onClick={() => { if (isSupported) trigger('warning'); void removeMeeting(meeting.id); }}
                              className="rounded-full bg-gradient-to-r from-[var(--coral)] to-[#e8a598] px-4 py-2 text-xs font-medium text-white shadow-md shadow-[var(--coral)]/20"
                            >
                              <Trash2 size={12} strokeWidth={2} className="inline mr-1" /> Del
                            </motion.button>
                            <motion.button
                              whileHover={!todaysCheckin ? { scale: 1.03, y: -1 } : {}}
                              whileTap={!todaysCheckin ? { scale: 0.97 } : {}}
                              type="button"
                              disabled={todaysCheckin || pendingCheckinId === meeting.id}
                              onClick={() => { if (isSupported) trigger('success'); void checkIn(meeting); }}
                              className={`rounded-full px-4 py-2 text-xs font-medium shadow-md transition-all ${
                                todaysCheckin
                                  ? "bg-[var(--forest-mid)] text-white shadow-[var(--forest-mid)]/20"
                                  : "bg-gradient-to-r from-[var(--forest-light)] to-[var(--forest-mid)] text-white shadow-[var(--forest-mid)]/20 hover:shadow-lg hover:shadow-[var(--forest-mid)]/30"
                              }`}
                            >
                              {todaysCheckin ? (
                                <>
                                  <CheckCircle size={12} strokeWidth={2} className="inline mr-1" /> Done
                                </>
                              ) : pendingCheckinId === meeting.id ? (
                                "..."
                              ) : (
                                "Check In"
                              )}
                            </motion.button>
                          </div>
                        </div>

                        <div className="mt-4 border-t border-dashed border-[var(--earth-sand)] pt-3">
                          <p className="mb-2 text-[10px] font-medium text-[var(--forest-mid)]/70">History ({history.length})</p>
                          <div className="flex flex-wrap gap-1">
                            {history.slice(0, 6).map((entry) => (
                              <span
                                key={entry.id}
                                className="rounded-full bg-[var(--earth-cream)] px-2.5 py-1 text-[10px] font-medium text-[var(--forest-mid)]"
                                title={entry.note || undefined}
                              >
                                {entry.createdAt ? formatDateTime(entry.createdAt).split(" ")[0] : entry.dayKey}
                              </span>
                            ))}
                            {history.length === 0 ? (
                              <span className="text-[10px] text-[var(--forest-mid)]/50">No data</span>
                            ) : null}
                          </div>
                        </div>
                      </>
                    )}
                  </motion.article>
                );
              })}
            </AnimatePresence>

            {!loading && meetings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="forest-card rounded-3xl border-2 border-dashed border-[var(--earth-sand)] p-12 text-center"
              >
                <motion.div
                  className="mx-auto mb-4 h-6 w-6 rounded-full bg-[var(--coral)]"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
                <p className="forest-title text-lg text-[var(--forest-deep)]">No Meetings</p>
                <p className="mt-2 text-xs text-[var(--forest-mid)]">Add a meeting above to start tracking.</p>
              </motion.div>
            ) : null}
          </motion.div>
        </div>
      ),
    },
    activityTracker: {
      id: "activityTracker",
      label: "Activity Tracker",
      hint: "Heatmap of the last sixteen weeks",
      className: "md:col-span-6 lg:col-span-6",
      content: (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="forest-card rounded-3xl p-6"
        >
          <div className="mb-4 flex items-center gap-2 border-b border-[var(--earth-sand)] pb-3">
            <span className="forest-title text-sm text-[var(--forest-mid)]">◆</span>
            <span className="forest-title text-sm text-[var(--forest-deep)]">Activity Tracker</span>
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="inline-flex min-w-full gap-3">
              <div className="flex flex-col pt-8 text-[10px]">
                {Array.from({ length: 7 }, (_, dayIndex) => (
                  <div key={dayIndex} className="flex h-4 items-center justify-end pr-1 text-[10px] text-[var(--forest-mid)]/70">
                    {weekdayLabels.includes(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][dayIndex])
                      ? ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][dayIndex]
                      : ""}
                  </div>
                ))}
              </div>
              <div className="flex-1">
                <div className="mb-2 grid" style={{ gridTemplateColumns: `repeat(${activityGrid.length}, minmax(0, 1fr))` }}>
                  {activityGrid.map((week, index) => (
                    <div key={`${week.label}-${index}`} className="h-6 px-[2px] text-[10px] text-[var(--forest-mid)]/70">
                      {week.label}
                    </div>
                  ))}
                </div>
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${activityGrid.length}, minmax(0, 1fr))`,
                    gridTemplateRows: "repeat(7, minmax(0, 1fr))",
                  }}
                >
                  {activityGrid.flatMap((week, weekIndex) =>
                    week.days.map((day, dayIndex) => (
                      <motion.div
                        key={day.key}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: weekIndex * 0.01 + dayIndex * 0.01, duration: 0.2 }}
                        className={`group relative h-4 w-4 rounded-sm ${day.isToday ? "ring-2 ring-[var(--forest-deep)] ring-offset-2 ring-offset-[var(--earth-cream)]" : ""}`}
                        style={{
                          backgroundColor: activityToneByLevel[day.level],
                          boxShadow: activityShadowByLevel[day.level],
                          gridColumn: weekIndex + 1,
                          gridRow: dayIndex + 1,
                        }}
                        aria-label={`${day.count} check-ins on ${formatShortDate(day.date)}`}
                        title={`${formatShortDate(day.date)} - ${day.count} check-in${day.count === 1 ? "" : "s"}`}
                      />
                    )),
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t border-dashed border-[var(--earth-sand)] pt-3 md:flex-row md:items-center md:justify-between">
            <p className="text-[10px] text-[var(--forest-mid)]/70">
              Last {ACTIVITY_WEEKS} weeks of check-ins across all meetings.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[var(--forest-mid)]/70">
              <span>Less</span>
              {ACTIVITY_LEVELS.map((level) => (
                <span
                  key={level}
                  className="h-4 w-4 rounded-sm"
                  style={{
                    backgroundColor: activityToneByLevel[level],
                    boxShadow: activityShadowByLevel[level],
                  }}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </motion.section>
      ),
    },
    weeklyLog: {
      id: "weeklyLog",
      label: "Weekly Log",
      hint: "Chronological check-ins from this week",
      className: "md:col-span-6 lg:col-span-6",
      content: (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="forest-card rounded-3xl p-6"
        >
          <div className="mb-4 flex items-center gap-2 border-b border-[var(--earth-sand)] pb-3">
            <span className="forest-title text-sm text-[var(--forest-mid)]">◆</span>
            <span className="forest-title text-sm text-[var(--forest-deep)]">Weekly Log</span>
          </div>
          <ul className="space-y-2">
            {thisWeekCheckins.map((entry, i) => {
              const meeting = meetingById.get(entry.meetingId);
              return (
                <motion.li
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.5, duration: 0.3 }}
                  key={entry.id}
                  className="flex items-center justify-between rounded-2xl border border-[var(--earth-sand)] bg-[var(--leaf-dew)]/50 px-4 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-medium text-[var(--forest-deep)]">{meeting?.name ?? entry.meetingName}</span>
                    {entry.note && (
                      <span className="block truncate text-[10px] text-[var(--forest-mid)]/70">&ldquo;{entry.note}&rdquo;</span>
                    )}
                  </div>
                  <span className="ml-2 whitespace-nowrap text-[10px] text-[var(--forest-mid)]">
                    {entry.createdAt ? formatDateTime(entry.createdAt) : entry.dayKey}
                  </span>
                </motion.li>
              );
            })}
            {thisWeekCheckins.length === 0 ? (
              <li className="py-4 text-center text-xs text-[var(--forest-mid)]/60">No activity</li>
            ) : null}
          </ul>
        </motion.section>
      ),
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[var(--earth-cream)] via-[var(--leaf-dew)] to-[var(--earth-cream)]">
      <Navigation />
      <div className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-[1400px] space-y-6">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="rounded-2xl bg-[var(--coral)] p-4 shadow-lg shadow-[var(--coral)]/20"
              >
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-white" />
                  <span className="forest-title text-sm text-white">Error: {error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.section
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl bg-gradient-to-br from-[var(--white)] to-[var(--earth-cream)] p-1 shadow-lg shadow-[var(--forest-mid)]/10"
          >
            <div className="flex flex-col gap-4 rounded-[20px] bg-[var(--white)]/80 p-4 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <LayoutGrid size={18} strokeWidth={2} className="text-[var(--forest-mid)]" />
                  <span className="forest-title text-base text-[var(--forest-deep)]">Dashboard Layout</span>
                </div>
                <p className="max-w-2xl text-xs text-[var(--forest-mid)]/70">
                  {isEditingLayout
                    ? "Drag cards by their handles, then save this order to keep it across refreshes, logouts, and future logins."
                    : "Turn on edit layout mode to rearrange the main dashboard cards and keep that order between sessions."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {isEditingLayout ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => { if (isSupported) trigger('success'); void saveLayout(); }}
                      disabled={isSavingLayout}
                      className="rounded-full bg-gradient-to-r from-[var(--forest-mid)] to-[var(--forest-deep)] px-4 py-2 text-xs font-medium text-white shadow-md shadow-[var(--forest-mid)]/20"
                    >
                      <Save size={14} strokeWidth={2} className="inline mr-1" /> {isSavingLayout ? "Saving..." : "Save Layout"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => { if (isSupported) trigger('light'); cancelLayoutEditing(); }}
                      disabled={isSavingLayout}
                      className="rounded-full bg-[var(--earth-sand)] px-4 py-2 text-xs font-medium text-[var(--forest-deep)]"
                    >
                      <X size={14} strokeWidth={2} className="inline mr-1" /> Cancel
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => { if (isSupported) trigger('light'); beginLayoutEditing(); }}
                    className="rounded-full bg-gradient-to-r from-[var(--forest-mid)] to-[var(--forest-deep)] px-4 py-2 text-xs font-medium text-white shadow-md shadow-[var(--forest-mid)]/20"
                  >
                    <LayoutGrid size={14} strokeWidth={2} className="inline mr-1" /> Edit Layout
                  </motion.button>
                )}
              </div>
            </div>
          </motion.section>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleLayoutDragEnd}
          >
            <SortableContext items={activeLayout} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
                {activeLayout.map((sectionId) => (
                  <SortableDashboardSection
                    key={sectionId}
                    {...dashboardSections[sectionId]}
                    isEditing={isEditingLayout}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Sobriety Setup Modal */}
      <AnimatePresence>
        {showSobrietySetup && (
          <SobrietySetup
            currentDate={userProfile?.sobrietyDate || null}
            onSubmit={updateSobrietyDate}
            onClose={() => setShowSobrietySetup(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
};
