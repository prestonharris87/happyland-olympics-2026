"use client";

import dynamic from "next/dynamic";
import AnimatedSection from "@/components/ui/AnimatedSection";

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
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <AnimatedSection>
          <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase text-gold mb-4 drop-shadow-[0_0_20px_rgba(255,215,0,0.2)]">
            Save the Date
          </h2>
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
              lightMode="dark"
              size="5"
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
