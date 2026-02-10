"use client";

interface ConstellationSVGProps {
  className?: string;
  opacity?: number;
  /** Variant pattern to render */
  variant?: "hero" | "wide" | "compact";
}

export default function ConstellationSVG({
  className = "",
  opacity = 0.15,
  variant = "hero",
}: ConstellationSVGProps) {
  if (variant === "hero") {
    // Node positions matching the 8 medallion positions in ElementalRing
    // mapped to the 1200x800 viewBox, plus center
    const nodes = {
      earthTL: [288, 96],   // Earth top-left  (24%, 12%)
      airTR: [912, 96],     // Air top-right   (76%, 12%)
      waterML: [264, 312],  // Water mid-left  (22%, 39%)
      fireMR: [936, 312],   // Fire mid-right  (78%, 39%)
      fireLL: [264, 488],   // Fire lower-left (22%, 61%)
      waterLR: [936, 488],  // Water lower-right (78%, 61%)
      airBL: [288, 704],    // Air bottom-left (24%, 88%)
      earthBR: [912, 704],  // Earth bottom-right (76%, 88%)
      center: [600, 400],   // Center
    };

    return (
      <svg
        className={`absolute inset-0 w-full h-full ${className}`}
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ opacity }}
      >
        {/* Sacred geometry connecting medallion positions */}
        <g stroke="#FFD700" strokeWidth="0.8">
          {/* Outer ring — connecting adjacent medallions */}
          <line x1={nodes.earthTL[0]} y1={nodes.earthTL[1]} x2={nodes.airTR[0]} y2={nodes.airTR[1]} />
          <line x1={nodes.airTR[0]} y1={nodes.airTR[1]} x2={nodes.fireMR[0]} y2={nodes.fireMR[1]} />
          <line x1={nodes.fireMR[0]} y1={nodes.fireMR[1]} x2={nodes.waterLR[0]} y2={nodes.waterLR[1]} />
          <line x1={nodes.waterLR[0]} y1={nodes.waterLR[1]} x2={nodes.earthBR[0]} y2={nodes.earthBR[1]} />
          <line x1={nodes.earthBR[0]} y1={nodes.earthBR[1]} x2={nodes.airBL[0]} y2={nodes.airBL[1]} />
          <line x1={nodes.airBL[0]} y1={nodes.airBL[1]} x2={nodes.fireLL[0]} y2={nodes.fireLL[1]} />
          <line x1={nodes.fireLL[0]} y1={nodes.fireLL[1]} x2={nodes.waterML[0]} y2={nodes.waterML[1]} />
          <line x1={nodes.waterML[0]} y1={nodes.waterML[1]} x2={nodes.earthTL[0]} y2={nodes.earthTL[1]} />

          {/* Diagonal cross — connecting mirrored pairs through center */}
          <line x1={nodes.earthTL[0]} y1={nodes.earthTL[1]} x2={nodes.earthBR[0]} y2={nodes.earthBR[1]} />
          <line x1={nodes.airTR[0]} y1={nodes.airTR[1]} x2={nodes.airBL[0]} y2={nodes.airBL[1]} />
          <line x1={nodes.waterML[0]} y1={nodes.waterML[1]} x2={nodes.waterLR[0]} y2={nodes.waterLR[1]} />
          <line x1={nodes.fireMR[0]} y1={nodes.fireMR[1]} x2={nodes.fireLL[0]} y2={nodes.fireLL[1]} />

          {/* Inner diamond — connecting to center */}
          <line x1={nodes.center[0]} y1={nodes.center[1]} x2={nodes.earthTL[0]} y2={nodes.earthTL[1]} />
          <line x1={nodes.center[0]} y1={nodes.center[1]} x2={nodes.airTR[0]} y2={nodes.airTR[1]} />
          <line x1={nodes.center[0]} y1={nodes.center[1]} x2={nodes.waterML[0]} y2={nodes.waterML[1]} />
          <line x1={nodes.center[0]} y1={nodes.center[1]} x2={nodes.fireMR[0]} y2={nodes.fireMR[1]} />
          <line x1={nodes.center[0]} y1={nodes.center[1]} x2={nodes.fireLL[0]} y2={nodes.fireLL[1]} />
          <line x1={nodes.center[0]} y1={nodes.center[1]} x2={nodes.waterLR[0]} y2={nodes.waterLR[1]} />
          <line x1={nodes.center[0]} y1={nodes.center[1]} x2={nodes.airBL[0]} y2={nodes.airBL[1]} />
          <line x1={nodes.center[0]} y1={nodes.center[1]} x2={nodes.earthBR[0]} y2={nodes.earthBR[1]} />
        </g>

        {/* Diamond nodes at medallion positions + center */}
        <g fill="#FFD700">
          {Object.values(nodes).map(([cx, cy], i) => (
            <g key={i} transform={`translate(${cx}, ${cy}) rotate(45)`}>
              <rect x="-4" y="-4" width="8" height="8" />
            </g>
          ))}
        </g>
      </svg>
    );
  }

  if (variant === "wide") {
    return (
      <svg
        className={`absolute inset-0 w-full h-full ${className}`}
        viewBox="0 0 1400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ opacity }}
        preserveAspectRatio="none"
      >
        <g stroke="#FFD700" strokeWidth="0.6">
          <line x1="50" y1="100" x2="200" y2="50" />
          <line x1="200" y1="50" x2="400" y2="120" />
          <line x1="400" y1="120" x2="550" y2="40" />
          <line x1="550" y1="40" x2="700" y2="100" />
          <line x1="700" y1="100" x2="850" y2="40" />
          <line x1="850" y1="40" x2="1000" y2="120" />
          <line x1="1000" y1="120" x2="1200" y2="50" />
          <line x1="1200" y1="50" x2="1350" y2="100" />
          {/* verticals */}
          <line x1="200" y1="50" x2="200" y2="150" />
          <line x1="550" y1="40" x2="550" y2="160" />
          <line x1="850" y1="40" x2="850" y2="160" />
          <line x1="1200" y1="50" x2="1200" y2="150" />
        </g>
        <g fill="#FFD700">
          {[
            [50, 100], [200, 50], [400, 120], [550, 40], [700, 100],
            [850, 40], [1000, 120], [1200, 50], [1350, 100],
            [200, 150], [550, 160], [850, 160], [1200, 150],
          ].map(([cx, cy], i) => (
            <g key={i} transform={`translate(${cx}, ${cy}) rotate(45)`}>
              <rect x="-3" y="-3" width="6" height="6" />
            </g>
          ))}
        </g>
      </svg>
    );
  }

  // compact variant
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity }}
    >
      <g stroke="#FFD700" strokeWidth="0.6">
        <line x1="200" y1="50" x2="350" y2="200" />
        <line x1="350" y1="200" x2="200" y2="350" />
        <line x1="200" y1="350" x2="50" y2="200" />
        <line x1="50" y1="200" x2="200" y2="50" />
        <line x1="200" y1="50" x2="200" y2="350" />
        <line x1="50" y1="200" x2="350" y2="200" />
      </g>
      <g fill="#FFD700">
        {[
          [200, 50], [350, 200], [200, 350], [50, 200], [200, 200],
        ].map(([cx, cy], i) => (
          <g key={i} transform={`translate(${cx}, ${cy}) rotate(45)`}>
            <rect x="-3" y="-3" width="6" height="6" />
          </g>
        ))}
      </g>
    </svg>
  );
}
