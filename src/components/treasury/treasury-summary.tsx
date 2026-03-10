"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { getClientDb } from "@/lib/firebase/client";
import { useAuth } from "@/components/auth-provider";
import { calculateSummary, formatCurrency, sortByDateDesc } from "@/lib/treasury-utils";
import type { TreasuryTransaction } from "@/types";

type TreasurySummaryProps = {
  className?: string;
};

export const TreasurySummary = ({ className }: TreasurySummaryProps) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TreasuryTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let db;
    try {
      db = getClientDb();
    } catch {
      return;
    }

    const transactionsQuery = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
    );

    const unsubscribe = onSnapshot(
      transactionsQuery,
      (snapshot) => {
        const parsed = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            userId: data.userId,
            date: data.date,
            amount: Number(data.amount) || 0,
            type: data.type,
            category: data.category,
            note: data.note ?? "",
            createdAt: data.createdAt?.toDate?.(),
            updatedAt: data.updatedAt?.toDate?.(),
          } satisfies TreasuryTransaction;
        });

        parsed.sort(sortByDateDesc);
        setTransactions(parsed);
        setLoading(false);
      },
      () => {
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user]);

  if (!user) return null;

  const summary = calculateSummary(transactions);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="h-full"
    >
      <Link href="/treasury" className="block h-full">
        <motion.div
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          className={["forest-card flex h-full cursor-pointer flex-col p-6", className].filter(Boolean).join(" ")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[var(--butter)] flex items-center justify-center">
                <DollarSign size={16} className="text-[var(--forest-deep)]" />
              </div>
              <span className="font-semibold text-xs text-[var(--forest-deep)]">Treasury</span>
            </div>
            <ArrowRight size={16} className="text-[var(--forest-light)]" />
          </div>

          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-[var(--earth-sand)] rounded-xl w-24 mb-2"></div>
              <div className="h-4 bg-[var(--earth-sand)] rounded-xl w-16"></div>
            </div>
          ) : (
            <>
              <div className="mt-auto">
                <motion.p
                  className={`text-5xl font-bold ${summary.net >= 0 ? 'text-[var(--forest-mid)]' : 'text-[var(--coral)]'}`}
                  key={summary.net}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {formatCurrency(summary.net)}
                </motion.p>

                <div className="mt-4 grid grid-cols-2 gap-6 border-t border-[var(--earth-sand)] pt-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[var(--mint-cool)] flex items-center justify-center">
                      <TrendingUp size={14} className="text-[var(--forest-mid)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--earth-wood)]">Contributions</p>
                      <p className="text-base font-bold text-[var(--forest-mid)]">
                        {formatCurrency(summary.contributions)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[var(--coral-pale)] flex items-center justify-center">
                      <TrendingDown size={14} className="text-[var(--coral)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--earth-wood)]">Expenses</p>
                      <p className="text-base font-bold text-[var(--coral)]">
                        {formatCurrency(summary.expenses)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
};
