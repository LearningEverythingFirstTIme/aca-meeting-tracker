"use client";

import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Wallet } from "lucide-react";
import { getClientDb } from "@/lib/firebase/client";
import { useAuth } from "@/components/auth-provider";
import { Navigation } from "@/components/navigation";
import { BalanceCard } from "@/components/treasury/balance-card";
import { TransactionCard } from "@/components/treasury/transaction-card";
import { TransactionForm } from "@/components/treasury/transaction-form";
import { sortByDateDesc } from "@/lib/treasury-utils";
import type { TreasuryTransaction } from "@/types";
import type { TransactionInput } from "@/lib/validators";

export default function TreasuryPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TreasuryTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TreasuryTransaction | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        setError("Failed to load transactions");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user]);

  if (!user) return null;

  const addTransaction = async (data: TransactionInput) => {
    const db = getClientDb();
    const id = crypto.randomUUID();
    const ref = doc(db, "transactions", id);
    await setDoc(ref, {
      userId: user.uid,
      date: data.date,
      amount: Number(data.amount),
      type: data.type,
      category: data.category,
      note: data.note,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const updateTransaction = async (id: string, data: TransactionInput) => {
    const db = getClientDb();
    const ref = doc(db, "transactions", id);
    await setDoc(ref, {
      userId: user.uid,
      date: data.date,
      amount: Number(data.amount),
      type: data.type,
      category: data.category,
      note: data.note,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  };

  const deleteTransaction = async (id: string) => {
    const confirmed = window.confirm("Delete this transaction?");
    if (!confirmed) return;
    const db = getClientDb();
    await deleteDoc(doc(db, "transactions", id));
  };

  const handleEdit = (transaction: TreasuryTransaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleSubmit = async (data: TransactionInput) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, data);
    } else {
      await addTransaction(data);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--leaf-dew)] to-[var(--earth-cream)]">
      <Navigation />
      
      <div className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="forest-card bg-gradient-to-r from-[var(--lavender)] to-[var(--lavender-soft)] p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Wallet size={20} className="text-[var(--lavender-deep)]" />
                </div>
                <h1 className="font-semibold text-2xl text-white">Treasury</h1>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setShowForm(true)}
                className="bg-white text-[var(--forest-deep)] px-4 py-2 rounded-full font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
              >
                <Plus size={16} /> Add
              </motion.button>
            </div>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="forest-card p-4 bg-gradient-to-r from-[var(--coral)] to-[var(--coral-warm)]"
              >
                <span className="font-medium text-sm text-white">Error: {error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <BalanceCard transactions={transactions} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="forest-card p-6"
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--earth-sand)]">
              <span className="text-sm text-[var(--forest-light)]">►</span>
              <span className="font-semibold text-sm text-[var(--forest-deep)]">Transactions</span>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mx-auto mb-4 h-10 w-10 rounded-full border-3 border-[var(--forest-mid)] border-t-transparent"
                />
                <p className="text-[var(--forest-deep)] animate-pulse">Loading...</p>
              </div>
            ) : transactions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  className="h-12 w-12 rounded-full bg-[var(--butter)] mx-auto mb-4 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Wallet size={24} className="text-[var(--forest-deep)]" />
                </motion.div>
                <p className="font-semibold text-lg text-[var(--forest-deep)]">No Transactions</p>
                <p className="text-sm mt-2 text-[var(--earth-wood)]">Click Add to record your first transaction.</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {transactions.map((t) => (
                    <TransactionCard
                      key={t.id}
                      transaction={t}
                      onEdit={() => handleEdit(t)}
                      onDelete={() => void deleteTransaction(t.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <TransactionForm
            transaction={editingTransaction ?? undefined}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            onClose={handleCloseForm}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
