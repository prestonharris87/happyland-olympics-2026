import { EVENT_NAME, EVENT_TAGLINE, EVENT_YEAR } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-dark py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <p className="font-heading text-2xl sm:text-3xl font-bold text-cream/90 uppercase">
          {EVENT_NAME}
        </p>
        <p className="font-body text-cream/50 mt-2 italic">
          &ldquo;{EVENT_TAGLINE}&rdquo;
        </p>
        <p className="font-body text-cream/30 mt-4 text-sm">
          &copy; {EVENT_YEAR}
        </p>
      </div>
    </footer>
  );
}
