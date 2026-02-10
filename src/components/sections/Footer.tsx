import { EVENT_NAME, EVENT_TAGLINE, EVENT_YEAR } from "@/lib/constants";
import ConstellationSVG from "@/components/ui/ConstellationSVG";

export default function Footer() {
  return (
    <footer className="relative bg-navy py-12 px-4 overflow-hidden z-10">
      {/* Subtle constellation pattern */}
      <div className="absolute inset-0">
        <ConstellationSVG variant="wide" opacity={0.05} />
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <p className="font-heading text-2xl sm:text-3xl font-bold text-gold/90 uppercase">
          {EVENT_NAME}
        </p>
        <p className="font-body text-cream/40 mt-2 italic">
          &ldquo;{EVENT_TAGLINE}&rdquo;
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <span className="text-earth/60 text-sm">Earth</span>
          <span className="text-fire/60 text-sm">Fire</span>
          <span className="text-water/60 text-sm">Water</span>
          <span className="text-air/60 text-sm">Air</span>
        </div>
        <p className="font-body text-cream/20 mt-4 text-sm">
          &copy; {EVENT_YEAR}
        </p>
      </div>
    </footer>
  );
}
