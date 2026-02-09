import AnimatedSection from "@/components/ui/AnimatedSection";

export default function VideoRecap() {
  return (
    <section
      id="recap"
      className="py-20 sm:py-28 px-4 bg-gradient-to-b from-sky-light/40 to-cream"
    >
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <h2 className="font-heading text-4xl sm:text-5xl font-black text-center uppercase text-dark mb-10">
            The 2025 Recap
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-dark">
            <video
              controls
              playsInline
              preload="metadata"
              className="w-full aspect-video"
            >
              <source src="/videos/recap-2025.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
