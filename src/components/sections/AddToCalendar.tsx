"use client";

import dynamic from "next/dynamic";
import { Bell } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import TextAlertSignup from "@/components/sections/TextAlertSignup";

const AddToCalendarButton = dynamic(
  () => import("add-to-calendar-button-react").then((mod) => mod.AddToCalendarButton),
  { ssr: false }
);

export default function AddToCalendar() {
  return (
    <section
      id="save-the-date"
      className="relative py-20 sm:py-28 px-4"
    >
      <div className="max-w-5xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Save the Date card */}
        <div className="bg-white/5 backdrop-blur-md border border-gold/30 rounded-2xl p-8 sm:p-12 h-full flex flex-col justify-center text-center">
          <AnimatedSection>
            <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase text-gold mb-2 drop-shadow-[0_0_20px_rgba(255,215,0,0.2)]">
              Save the Date
            </h2>
            <p className="font-body text-xl sm:text-2xl font-semibold text-white mb-4">
              June 12–14, 2026
            </p>
            <p className="font-body text-cream/50 mb-10 text-lg">
              Don&apos;t miss out — add it to your calendar now.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="flex justify-center">
              <AddToCalendarButton
                name="Happyland Olympics 2026"
                description="The 3rd annual Happyland Olympics! Where the Elements Come to Play."
                startDate="2026-06-12"
                startTime="19:00"
                endDate="2026-06-14"
                endTime="12:00"
                timeZone="America/Chicago"
                location="Happyland, Oklahoma"
                options={["Google", "Apple", "Outlook.com", "iCal"]}
                buttonStyle="round"
                listStyle="modal"
                hideBackground
                lightMode="dark"
                size="5"
              />
            </div>
          </AnimatedSection>
        </div>

        {/* Text Alerts card */}
        <AnimatedSection delay={0.15}>
          <div className="bg-white/5 backdrop-blur-md border border-gold/30 rounded-2xl p-8 sm:p-12 h-full flex flex-col justify-center text-center">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                <Bell className="w-7 h-7 text-gold" />
              </div>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase text-gold mb-2 drop-shadow-[0_0_20px_rgba(255,215,0,0.2)]">
              Text Alerts
            </h2>
            <p className="font-body text-cream/50 mb-8 text-lg">
              Get notified when tickets drop
            </p>
            <TextAlertSignup />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
