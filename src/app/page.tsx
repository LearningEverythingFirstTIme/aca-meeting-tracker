"use client";

import { motion } from "framer-motion";
import { AuthForm } from "@/components/auth-form";
import { Dashboard } from "@/components/dashboard";
import { useAuth } from "@/components/auth-provider";

export default function Home() {
  const { user, loading, configError } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-b from-[var(--leaf-dew)] to-[var(--earth-cream)]">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          className="forest-card p-12 text-center"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-6 h-16 w-16 rounded-full border-3 border-[var(--forest-mid)] border-t-transparent"
          />
          <p className="text-xl font-semibold text-[var(--forest-deep)] animate-pulse">
            Initializing...
          </p>
        </motion.div>
      </main>
    );
  }

  if (configError) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8 bg-gradient-to-b from-[var(--leaf-dew)] to-[var(--earth-cream)]">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
          className="forest-card border-[var(--coral)] max-w-lg p-8"
        >
          <div className="mb-6 flex items-center gap-3 border-b border-[var(--earth-sand)] pb-4">
            <div className="h-8 w-8 bg-[var(--coral)] rounded-full flex items-center justify-center">
              <span className="text-white font-bold">!</span>
            </div>
            <h1 className="font-semibold text-3xl text-[var(--forest-deep)]">Error</h1>
          </div>
          <p className="text-sm mb-6 text-[var(--coral)]">
            {configError}
          </p>
          <div className="bg-[var(--earth-cream)] rounded-xl border border-[var(--earth-sand)] p-4">
            <p className="text-xs text-[var(--forest-deep)]">
              Copy <span className="bg-[var(--forest-mid)] text-white px-2 py-1 rounded">.env.example</span> to <span className="bg-[var(--forest-mid)] text-white px-2 py-1 rounded">.env.local</span>
            </p>
          </div>
        </motion.div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8 bg-gradient-to-b from-[var(--leaf-dew)] to-[var(--earth-cream)]">
        <AuthForm />
      </main>
    );
  }

  return <Dashboard />;
}
