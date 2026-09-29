import type { CSSProperties } from "react";

interface Mote {
  left: number;
  top: number;
  size: number;
  dur: number;
  delay: number;
  dx: number;
  o: number;
}

/** Deterministic (integer LCG) so server and client markup always match. */
function buildMotes(count: number, seed: number): Mote[] {
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  return Array.from({ length: count }, () => ({
    left: Math.round(rnd() * 1000) / 10,
    top: Math.round((20 + rnd() * 75) * 10) / 10,
    size: Math.round(4 + rnd() * 8),
    dur: Math.round(9 + rnd() * 9),
    delay: Math.round(rnd() * -18),
    dx: Math.round(rnd() * 60 - 30),
    o: Math.round((0.45 + rnd() * 0.45) * 100) / 100,
  }));
}

/** Soft floating light motes — pure CSS, hidden for reduced motion. */
export function Particles({
  count = 16,
  seed = 7,
  className = "",
}: {
  count?: number;
  seed?: number;
  className?: string;
}) {
  const motes = buildMotes(count, seed);
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {motes.map((m, i) => (
        <span
          key={i}
          className="particle"
          style={
            {
              left: `${m.left}%`,
              top: `${m.top}%`,
              width: m.size,
              height: m.size,
              "--dur": `${m.dur}s`,
              "--delay": `${m.delay}s`,
              "--dx": `${m.dx}px`,
              "--o": m.o,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
