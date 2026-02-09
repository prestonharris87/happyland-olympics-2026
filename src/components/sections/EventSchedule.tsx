import AnimatedSection from "@/components/ui/AnimatedSection";
import { SCHEDULE } from "@/lib/constants";

const colorMap = {
  sky: "border-sky bg-sky/5",
  gold: "border-gold bg-gold/5",
  coral: "border-coral bg-coral/5",
} as const;

const dotColorMap = {
  sky: "bg-sky",
  gold: "bg-gold",
  coral: "bg-coral",
} as const;

export default function EventSchedule() {
  return (
    <section
      id="schedule"
      className="py-20 sm:py-28 px-4 bg-gradient-to-b from-green-light/30 to-cream"
    >
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <h2 className="font-heading text-4xl sm:text-5xl font-black text-center uppercase text-dark mb-12">
            The Game Plan
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {SCHEDULE.map((day, i) => (
            <AnimatedSection key={day.day} delay={i * 0.15}>
              <div
                className={`rounded-2xl border-2 ${colorMap[day.color]} p-6 sm:p-8 h-full`}
              >
                <div className="text-center mb-6">
                  <p className="font-heading text-2xl sm:text-3xl font-bold uppercase text-dark">
                    {day.day}
                  </p>
                  <p className="font-body text-sm text-dark/50 mt-1">
                    {day.date}
                  </p>
                  <p className="font-body text-base font-semibold text-dark/80 mt-2">
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
                        <span className="font-body text-sm font-bold text-dark/70">
                          {item.time}
                        </span>
                        <span className="font-body text-sm text-dark/60 ml-2">
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
