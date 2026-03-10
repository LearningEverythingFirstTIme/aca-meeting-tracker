"use client";

import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { Leaf, Heart, Wind } from "lucide-react";

type Mode = "login" | "register";

const friendlyAuthError = (error: unknown): string => {
  if (!(error instanceof FirebaseError)) {
    return "Something went wrong. Please try again.";
  }

  switch (error.code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Email or password is incorrect.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    default:
      return "Unable to sign in. Please try again.";
  }
};

export const AuthForm = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        await register(email.trim(), password);
      }
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating leaves */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 rounded-full opacity-20"
            style={{
              background: `linear-gradient(135deg, var(--leaf-sage) 0%, var(--leaf-moss) 100%)`,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 10, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Soft gradient orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-br from-[var(--leaf-dew)] to-transparent opacity-40 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-tl from-[var(--accent-sunset)] to-transparent opacity-30 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & Welcome */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--forest-mid)] via-[var(--forest-light)] to-[var(--leaf-moss)] flex items-center justify-center shadow-2xl"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.8 }}
          >
            <Leaf className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="forest-title text-3xl text-[var(--forest-deep)] mb-2">
            Welcome to the Forest
          </h1>
          <p className="text-[var(--forest-mid)] text-sm">
            A peaceful space for your recovery journey
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div 
          className="forest-card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-8 p-1 bg-[var(--earth-cream)] rounded-full">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                mode === "login"
                  ? "bg-white text-[var(--forest-mid)] shadow-md"
                  : "text-[var(--earth-wood)] hover:text-[var(--forest-mid)]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                mode === "register"
                  ? "bg-white text-[var(--forest-mid)] shadow-md"
                  : "text-[var(--earth-wood)] hover:text-[var(--forest-mid)]"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-semibold text-[var(--forest-mid)] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-[var(--earth-sand)] bg-white/80 focus:border-[var(--forest-light)] focus:outline-none focus:ring-4 focus:ring-[var(--leaf-dew)] transition-all"
                placeholder="you@example.com"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-semibold text-[var(--forest-mid)] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-[var(--earth-sand)] bg-white/80 focus:border-[var(--forest-light)] focus:outline-none focus:ring-4 focus:ring-[var(--leaf-dew)] transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl bg-[var(--accent-rose)]/20 border border-[var(--accent-rose)]/30 text-[var(--forest-deep)] text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Wind size={16} />
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[var(--forest-mid)] to-[var(--forest-light)] text-white font-semibold text-lg shadow-lg shadow-[var(--forest-mid)]/30 hover:shadow-xl hover:shadow-[var(--forest-mid)]/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Please wait...
                </span>
              ) : mode === "login" ? (
                <span className="flex items-center justify-center gap-2">
                  <Heart size={18} fill="currentColor" />
                  Sign In
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Leaf size={18} />
                  Begin Your Journey
                </span>
              )}
            </motion.button>
          </form>

          {/* Footer Message */}
          <motion.p 
            className="mt-6 text-center text-sm text-[var(--forest-mid)]/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {mode === "login" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-semibold text-[var(--forest-mid)] hover:text-[var(--forest-light)] underline underline-offset-2"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-semibold text-[var(--forest-mid)] hover:text-[var(--forest-light)] underline underline-offset-2"
                >
                  Sign in
                </button>
              </>
            )}
          </motion.p>
        </motion.div>

        {/* Bottom Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-sm text-[var(--forest-mid)]/60 italic"
        >
          &ldquo;Recovery is not a race. You don&apos;t have to be perfect, just present.&rdquo;
        </motion.p>
      </motion.div>
    </div>
  );
};
