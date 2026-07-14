"use client";

import { motion } from "framer-motion";
import { useId, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export type EcosystemNode = {
  id: string;
  label: string;
};

type EcosystemDiagramProps = {
  /** Exactly the orbit nodes (center label passed separately) */
  nodes: EcosystemNode[];
  centerLabel: string;
  className?: string;
};

const SIZE = 640;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = 232;

/** Chords between orbit nodes (by index) that carry cross-flows. */
const CHORDS: [number, number][] = [
  [0, 3],
  [1, 4],
  [2, 6],
  [5, 7],
];

function nodePos(i: number, total: number) {
  const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CX + Math.cos(angle) * RADIUS,
    y: CY + Math.sin(angle) * RADIUS,
  };
}

function curve(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2 + (a.y - b.y) * 0.18;
  const my = (a.y + b.y) / 2 + (b.x - a.x) * 0.18;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

/**
 * The business-ecosystem constellation: a hub-and-spoke network whose
 * connections light up as you hover each pillar.
 */
export function EcosystemDiagram({
  nodes,
  centerLabel,
  className,
}: EcosystemDiagramProps) {
  const [active, setActive] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();
  const gradId = useId();

  const positions = nodes.map((_, i) => nodePos(i, nodes.length));

  const isLit = (i: number) =>
    active === null ? false : active === i;
  const spokeLit = (i: number) => active === null || active === i;
  const chordLit = ([a, b]: [number, number]) =>
    active === null ? false : active === a || active === b;

  return (
    <div className={cn("relative mx-auto w-full max-w-[640px]", className)}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${centerLabel} — ${nodes.map((n) => n.label).join(", ")}`}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2B59FF" />
            <stop offset="0.5" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>

        {/* Orbit ring */}
        <circle
          cx={CX}
          cy={CY}
          r={RADIUS}
          fill="none"
          stroke="rgba(148,163,184,0.1)"
          strokeDasharray="2 6"
        />

        {/* Spokes */}
        {positions.map((p, i) => (
          <g key={`spoke-${i}`}>
            <path
              d={curve({ x: CX, y: CY }, p)}
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth={spokeLit(i) ? 1.6 : 0.8}
              opacity={spokeLit(i) ? 0.85 : 0.22}
              className="transition-all duration-300"
            />
            {!reduced && spokeLit(i) && (
              <circle r="2.4" fill="#22D3EE">
                <animateMotion
                  dur={`${3 + i * 0.4}s`}
                  repeatCount="indefinite"
                  path={curve({ x: CX, y: CY }, p)}
                />
              </circle>
            )}
          </g>
        ))}

        {/* Cross chords */}
        {CHORDS.map((chord, i) => {
          const [a, b] = chord;
          if (!positions[a] || !positions[b]) return null;
          return (
            <path
              key={`chord-${i}`}
              d={curve(positions[a], positions[b])}
              fill="none"
              stroke="rgba(139,92,246,0.5)"
              strokeWidth={chordLit(chord) ? 1.4 : 0.6}
              opacity={chordLit(chord) ? 0.8 : 0.16}
              className="transition-all duration-300"
            />
          );
        })}

        {/* Center hub */}
        <g>
          <circle cx={CX} cy={CY} r="56" className="fill-[#0C1220]" stroke={`url(#${gradId})`} strokeWidth="1.4" />
          {!reduced && (
            <circle cx={CX} cy={CY} r="56" fill="none" stroke="rgba(139,92,246,0.5)" strokeWidth="1">
              <animate attributeName="r" values="56;74" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0" dur="3s" repeatCount="indefinite" />
            </circle>
          )}
          <text
            x={CX}
            y={CY}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-[#F4F7FF] font-heading"
            fontSize="17"
            fontWeight="600"
          >
            {centerLabel}
          </text>
        </g>

        {/* Orbit nodes */}
        {nodes.map((node, i) => {
          const p = positions[i];
          return (
            <motion.g
              key={node.id}
              onHoverStart={() => setActive(i)}
              onHoverEnd={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              tabIndex={0}
              role="button"
              aria-label={node.label}
              className="cursor-pointer outline-none"
              animate={
                reduced
                  ? undefined
                  : { y: [0, i % 2 === 0 ? -6 : 6, 0] }
              }
              transition={{
                duration: 5 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={isLit(i) ? 40 : 34}
                className="fill-[#0A0F1A] transition-all duration-300"
                stroke={isLit(i) ? "#8B5CF6" : "rgba(148,163,184,0.25)"}
                strokeWidth={isLit(i) ? 1.6 : 1}
              />
              <text
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="11.5"
                fontWeight="500"
                className={cn(
                  "transition-colors duration-300",
                  isLit(i) ? "fill-[#F4F7FF]" : "fill-[#9AA7BD]",
                )}
              >
                {node.label}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
