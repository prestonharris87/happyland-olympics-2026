"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import ConstellationSVG from "@/components/ui/ConstellationSVG";
import { SCHEDULE } from "@/lib/constants";

const colorMap = {
  water: "border-water bg-water/10",
  fire: "border-fire bg-fire/10",
  earth: "border-earth bg-earth/10",
} as const;

const dotColorMap = {
  water: "bg-water",
  fire: "bg-fire",
  earth: "bg-earth",
} as const;

const headingColorMap = {
  water: "text-water-light",
  fire: "text-fire-light",
  earth: "text-earth-light",
} as const;

export default function EventSchedule() {
  return (
    <section
      id="schedule"
      className="relative py-20 sm:py-28 px-4"
    >
      {/* Background constellation */}
      <div className="absolute inset-0 overflow-hidden">
        <ConstellationSVG variant="wide" opacity={0.06} className="top-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatedSection>
          <h2 className="font-heading text-4xl sm:text-5xl font-black text-center uppercase text-gold mb-12 drop-shadow-[0_0_20px_rgba(255,215,0,0.2)]">
            The Game Plan
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {SCHEDULE.map((day, i) => (
            <AnimatedSection key={day.day} delay={i * 0.15}>
              <div
                className={`rounded-2xl border-2 ${colorMap[day.color]} backdrop-blur-sm p-6 sm:p-8 h-full`}
              >
                <div className="text-center mb-6">
                  <p className={`font-heading text-2xl sm:text-3xl font-bold uppercase ${headingColorMap[day.color]}`}>
                    {day.day}
                  </p>
                  <p className="font-body text-sm text-cream/40 mt-1">
                    {day.date}
                  </p>
                  <p className="font-body text-base font-semibold text-cream/70 mt-2">
                    {day.title}
                  </p>
                </div>

                <div className="space-y-3">
                  {day.items.map((item) => (
                    <div
                      key={item.time}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${dotColorMap[day.color]} mt-1.5 shrink-0`}
                      />
                      <div>
                        <span className="font-body text-sm font-bold text-cream/60">
                          {item.time}
                        </span>
                        <span className="font-body text-sm text-cream/45 ml-2">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
