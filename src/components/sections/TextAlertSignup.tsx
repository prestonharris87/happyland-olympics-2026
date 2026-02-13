"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, CheckCircle } from "lucide-react";
import { subscribeTextAlerts } from "@/lib/engagement";

export default function TextAlertSignup() {
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!phone.trim() || submitting) return;

    setError("");
    setSubmitting(true);

    const result = await subscribeTextAlerts(phone);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Something went wrong. Please try again.");
    }

    setSubmitting(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <AnimatePresence mode="wait">
      {success ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center gap-3 py-2"
        >
          <CheckCircle className="w-10 h-10 text-green-400" />
          <p className="font-body text-cream/90 text-center text-sm sm:text-base">
            Thanks for signing up! We&apos;ll text you when tickets drop.
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-3"
        >
          <div className="flex gap-2">
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              name="phone"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={handleKeyDown}
              disabled={submitting}
              className="flex-1 min-w-0 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder:text-white/40 font-body text-base focus:outline-none focus:border-gold/50 transition-colors disabled:opacity-50"
            />
            <button
              onClick={handleSubmit}
              disabled={!phone.trim() || submitting}
              className="px-5 py-3 bg-gold/80 hover:bg-gold text-navy font-body font-semibold text-sm rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Sign Up"
              )}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-coral text-xs font-body text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
