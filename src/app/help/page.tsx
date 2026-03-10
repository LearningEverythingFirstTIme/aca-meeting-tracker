"use client";

import { motion } from "framer-motion";
import { Phone, Heart, Users, AlertCircle, ExternalLink } from "lucide-react";
import { Navigation } from "@/components/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, type: "spring" as const, stiffness: 150 }
  },
};

export default function HelpPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="forest-card p-6 mb-6 bg-gradient-to-r from-[var(--forest-mid)] to-[var(--forest-light)]"
          style={{ border: "1px solid rgba(90, 147, 112, 0.3)" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
              <Heart size={20} className="text-white" fill="white" />
            </div>
            <h1 className="font-semibold text-2xl text-white">
              You Are Not Alone
            </h1>
          </div>
          <p className="text-sm text-white/90 ml-13 pl-1">
            If you&apos;re struggling right now, please reach out. We understand what you&apos;re going through.
          </p>
        </motion.div>

        {/* Phone Numbers */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 mb-8"
        >
          {/* ACA National Hotline */}
          <motion.a
            variants={cardVariants}
            href="tel:1-562-595-7831"
            className="forest-card p-6 hover:scale-[1.02] transition-all cursor-pointer block group"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-gradient-to-br from-[var(--forest-mid)] to-[var(--forest-light)] rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <Phone size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg mb-1 text-[var(--forest-deep)]">
                  ACA National Hotline
                </h2>
                <p className="text-2xl font-bold text-[var(--forest-mid)] mb-2">
                  1-562-595-7831
                </p>
                <p className="text-xs text-[var(--earth-wood)]">
                  Available 24 hours a day, 7 days a week
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--earth-sand)]">
              <p className="text-xs text-[var(--earth-wood)]">
                Talk to someone who understands the effects of growing up in a dysfunctional family.
              </p>
            </div>
          </motion.a>

          {/* ACA World Service */}
          <motion.a
            variants={cardVariants}
            href="https://adultchildren.org"
            target="_blank"
            rel="noopener noreferrer"
            className="forest-card p-6 hover:scale-[1.02] transition-all cursor-pointer block group"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-gradient-to-br from-[var(--mint)] to-[var(--mint-cool)] rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <Users size={24} className="text-[var(--forest-deep)]" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg mb-1 text-[var(--forest-deep)]">
                  ACA World Service
                </h2>
                <p className="text-lg font-bold text-[var(--forest-mid)] mb-2">
                  adultchildren.org
                </p>
                <p className="text-xs text-[var(--earth-wood)]">
                  Find meetings, literature, and resources
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--earth-sand)]">
              <p className="text-xs text-[var(--earth-wood)]">
                Connect with ACA members worldwide who can help you find a meeting.
              </p>
            </div>
          </motion.a>
        </motion.div>

        {/* Crisis Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="forest-card p-6 mb-8 bg-gradient-to-br from-[var(--sunlight-glow)] to-[var(--leaf-dew)]"
        >
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-gradient-to-br from-[var(--forest-mid)] to-[var(--leaf-moss)] rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <AlertCircle size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-[var(--forest-deep)]">
                Feeling Overwhelmed?
              </h3>
              <p className="text-sm text-[var(--earth-wood)] mb-3">
                You don&apos;t have to go through this alone. Recovery is possible, one day at a time. 
                Reach out to someone who understands childhood trauma and its effects.
              </p>
              <p className="text-xs text-[var(--earth-wood)]/70">
                This too shall pass. Just for today, focus on your recovery.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="forest-card p-6"
        >
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-[var(--forest-deep)]">
            <ExternalLink size={18} /> More Resources
          </h3>
          
          <div className="space-y-3">
            <a 
              href="https://adultchildren.org/meetings/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl border border-[var(--earth-sand)] bg-white hover:bg-[var(--leaf-dew)] transition-colors"
            >
              <span className="text-sm text-[var(--forest-deep)]">ACA Meeting Finder</span>
              <ExternalLink size={14} className="text-[var(--forest-light)]" />
            </a>
            
            <a 
              href="https://adultchildren.org/literature/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl border border-[var(--earth-sand)] bg-white hover:bg-[var(--leaf-dew)] transition-colors"
            >
              <span className="text-sm text-[var(--forest-deep)]">ACA Literature Store</span>
              <ExternalLink size={14} className="text-[var(--forest-light)]" />
            </a>

            <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--butter)] to-[var(--butter-warm)]/50">
              <p className="text-xs text-[var(--forest-deep)]">
                <strong>Remember:</strong> The only requirement for ACA membership is a desire to recover 
                from the effects of growing up in an alcoholic or otherwise dysfunctional family. 
                You are not alone. Together we can heal.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
