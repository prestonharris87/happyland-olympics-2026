interface SectionDividerProps {
  variant?: "wave" | "geometric" | "stars";
  flip?: boolean;
  className?: string;
}

export default function SectionDivider({
  variant = "wave",
  flip = false,
  className = "",
}: SectionDividerProps) {
  const flipStyle = flip ? { transform: "scaleY(-1)" } : {};

  if (variant === "wave") {
    return (
      <div className={`w-full -my-px ${className}`} style={flipStyle} aria-hidden="true">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 30C240 0 480 60 720 30C960 0 1200 60 1440 30V60H0V30Z"
            fill="#0B1426"
            fillOpacity="0.5"
          />
          <path
            d="M0 40C240 10 480 50 720 30C960 10 1200 50 1440 30"
            stroke="#FFD700"
            strokeWidth="0.5"
            strokeOpacity="0.2"
          />
        </svg>
      </div>
    );
  }

  if (variant === "geometric") {
    return (
      <div className={`w-full -my-px ${className}`} style={flipStyle} aria-hidden="true">
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 20L60 10L120 25L180 5L240 20L300 8L360 22L420 12L480 28L540 6L600 20L660 10L720 25L780 5L840 22L900 10L960 28L1020 8L1080 20L1140 5L1200 22L1260 12L1320 25L1380 8L1440 20V40H0V20Z"
            fill="#0B1426"
            fillOpacity="0.3"
          />
          {/* Diamond nodes along the line */}
          {[0, 180, 360, 540, 720, 900, 1080, 1260, 1440].map((x, i) => (
            <g key={i} transform={`translate(${x}, ${i % 2 === 0 ? 20 : 10}) rotate(45)`}>
              <rect x="-2" y="-2" width="4" height="4" fill="#FFD700" fillOpacity="0.3" />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  // stars variant
  return (
    <div className={`w-full h-8 relative ${className}`} style={flipStyle} aria-hidden="true">
      <div className="absolute inset-0 flex items-center justify-center gap-16">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              backgroundColor: "#FFD700",
              opacity: 0.3 + (i % 3) * 0.15,
              boxShadow: i % 3 === 0 ? "0 0 6px rgba(255, 215, 0, 0.3)" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}
