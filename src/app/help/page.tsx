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
          className="neo-card p-6 mb-6 border-[var(--coral)]"
          style={{ background: "var(--coral)", boxShadow: "8px 8px 0px 0px black" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 bg-black border-3 border-black flex items-center justify-center">
              <Heart size={20} className="text-[var(--coral)]" strokeWidth={3} />
            </div>
            <h1 className="neo-title text-3xl">
              You Are Not Alone
            </h1>
          </div>
          <p className="neo-mono text-sm text-[var(--black)]/80 ml-11">
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
            className="neo-card p-6 bg-[var(--white)] hover:scale-[1.02] transition-transform cursor-pointer block"
            style={{ boxShadow: "8px 8px 0px 0px black" }}
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-[var(--coral)] border-4 border-black flex items-center justify-center shrink-0">
                <Phone size={24} strokeWidth={3} />
              </div>
              <div className="flex-1">
                <h2 className="neo-title text-xl mb-1">
                  ACA National Hotline
                </h2>
                <p className="neo-mono text-2xl font-bold text-[var(--black)] mb-2">
                  1-562-595-7831
                </p>
                <p className="neo-mono text-xs text-[var(--black)]/60">
                  Available 24 hours a day, 7 days a week
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t-2 border-dashed border-black/20">
              <p className="neo-mono text-xs text-[var(--black)]/70">
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
            className="neo-card p-6 bg-[var(--white)] hover:scale-[1.02] transition-transform cursor-pointer block"
            style={{ boxShadow: "8px 8px 0px 0px black" }}
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-[var(--mint)] border-4 border-black flex items-center justify-center shrink-0">
                <Users size={24} strokeWidth={3} />
              </div>
              <div className="flex-1">
                <h2 className="neo-title text-xl mb-1">
                  ACA World Service
                </h2>
                <p className="neo-mono text-lg font-bold text-[var(--black)] mb-2">
                  adultchildren.org
                </p>
                <p className="neo-mono text-xs text-[var(--black)]/60">
                  Find meetings, literature, and resources
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t-2 border-dashed border-black/20">
              <p className="neo-mono text-xs text-[var(--black)]/70">
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
          className="neo-card p-6 mb-8 border-4 border-[var(--coral)] bg-[var(--cream)]"
        >
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-[var(--coral)] border-3 border-black flex items-center justify-center shrink-0">
              <AlertCircle size={20} strokeWidth={3} />
            </div>
            <div>
              <h3 className="neo-title text-lg mb-2">
                Feeling Overwhelmed?
              </h3>
              <p className="neo-mono text-sm text-[var(--black)]/80 mb-3">
                You don&apos;t have to go through this alone. Recovery is possible, one day at a time. 
                Reach out to someone who understands childhood trauma and its effects.
              </p>
              <p className="neo-mono text-xs text-[var(--black)]/60">
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
          className="neo-card p-6"
        >
          <h3 className="neo-title text-lg mb-4 flex items-center gap-2">
            <ExternalLink size={18} strokeWidth={3} /> MORE RESOURCES
          </h3>
          
          <div className="space-y-3">
            <a 
              href="https://adultchildren.org/meetings/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 border-3 border-black bg-[var(--white)] hover:bg-[var(--cream)] transition-colors"
            >
              <span className="neo-mono text-sm">ACA Meeting Finder</span>
              <ExternalLink size={14} strokeWidth={3} />
            </a>
            
            <a 
              href="https://adultchildren.org/literature/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 border-3 border-black bg-[var(--white)] hover:bg-[var(--cream)] transition-colors"
            >
              <span className="neo-mono text-sm">ACA Literature Store</span>
              <ExternalLink size={14} strokeWidth={3} />
            </a>

            <div className="p-3 border-3 border-black bg-[var(--butter)]">
              <p className="neo-mono text-xs text-[var(--black)]/80">
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
