"use client";

import DottedMap from "dotted-map";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Trade hubs (id, lat, lng). Tehran is the network's origin. */
const HUBS = [
  { id: "thr", lat: 35.69, lng: 51.42 },
  { id: "dxb", lat: 25.2, lng: 55.27 },
  { id: "ist", lat: 41.01, lng: 28.98 },
  { id: "sha", lat: 31.23, lng: 121.47 },
  { id: "sin", lat: 1.35, lng: 103.82 },
  { id: "fra", lat: 50.11, lng: 8.68 },
  { id: "lon", lat: 51.51, lng: -0.13 },
  { id: "bom", lat: 19.08, lng: 72.88 },
  { id: "nbo", lat: -1.29, lng: 36.82 },
  { id: "gru", lat: -23.55, lng: -46.63 },
  { id: "nyc", lat: 40.71, lng: -74.01 },
] as const;

const ROUTES: [string, string][] = [
  ["thr", "dxb"],
  ["thr", "ist"],
  ["thr", "sha"],
  ["thr", "fra"],
  ["dxb", "sin"],
  ["dxb", "bom"],
  ["ist", "lon"],
  ["fra", "nyc"],
  ["sha", "sin"],
  ["thr", "nbo"],
  ["nyc", "gru"],
];

type Pt = { x: number; y: number };

function buildMap() {
  const map = new DottedMap({ height: 60, grid: "diagonal" });
  const dots = map.getPoints();
  const hubs = new Map<string, Pt>();
  for (const h of HUBS) {
    const pin = map.getPin({ lat: h.lat, lng: h.lng });
    if (pin) hubs.set(h.id, { x: pin.x, y: pin.y });
  }
  return { dots, hubs, maxX: map.image.width, maxY: map.image.height };
}

/** Curved route path between two projected points (lifts toward the top). */
function arcPath(a: Pt, b: Pt): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - Math.abs(b.x - a.x) * 0.35 - 4;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

type WorldMapProps = {
  className?: string;
  /** Dot color; hubs always glow in brand colors */
  dotColor?: string;
};

/**
 * The hero's animated world: a dotted map on canvas, luminous trade-route
 * arcs with traveling light packets on an SVG overlay, and pulsing hubs.
 */
export function WorldMap({
  className,
  dotColor = "rgba(148,163,184,0.28)",
}: WorldMapProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  const geo = useMemo(buildMap, []);

  // Static dot layer on canvas, redrawn on resize.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const draw = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const sx = w / geo.maxX;
      const sy = h / geo.maxY;
      const r = Math.max(0.7, (w / geo.maxX) * 0.32);
      ctx.fillStyle = dotColor;
      for (const d of geo.dots) {
        ctx.beginPath();
        ctx.arc(d.x * sx, d.y * sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      setReady(true);
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [geo, dotColor]);

  // Route arcs: draw-in loop + traveling packet per route.
  useGSAP(
    () => {
      if (reduced || !svgRef.current || !ready) return;
      const paths = svgRef.current.querySelectorAll<SVGPathElement>("[data-route]");
      const packets = svgRef.current.querySelectorAll<SVGCircleElement>("[data-packet]");

      paths.forEach((path, i) => {
        gsap.fromTo(
          path,
          { drawSVG: "0% 0%" },
          {
            drawSVG: "0% 100%",
            duration: 2.4,
            ease: "power2.inOut",
            delay: i * 0.35,
            repeat: -1,
            repeatDelay: 3.2,
            yoyo: true,
          },
        );
      });

      packets.forEach((packet, i) => {
        gsap.to(packet, {
          motionPath: {
            path: paths[i],
            align: paths[i],
            alignOrigin: [0.5, 0.5],
          },
          duration: 3.6,
          ease: "power1.inOut",
          delay: i * 0.35 + 0.6,
          repeat: -1,
          repeatDelay: 2,
        });
      });
    },
    { dependencies: [reduced, ready], scope: svgRef },
  );

  return (
    <div ref={wrapRef} className={cn("relative aspect-[2/1] w-full", className)} aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${geo.maxX} ${geo.maxY}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="route-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2B59FF" />
            <stop offset="0.5" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        {ROUTES.map(([from, to], i) => {
          const a = geo.hubs.get(from);
          const b = geo.hubs.get(to);
          if (!a || !b) return null;
          return (
            <g key={i}>
              <path
                data-route
                d={arcPath(a, b)}
                stroke="url(#route-grad)"
                strokeWidth="0.35"
                strokeLinecap="round"
                opacity="0.8"
              />
              {!reduced && (
                <circle data-packet r="0.55" fill="#22D3EE" opacity="0.9" />
              )}
            </g>
          );
        })}
        {[...geo.hubs.entries()].map(([id, p]) => (
          <g key={id}>
            <circle cx={p.x} cy={p.y} r="0.8" fill="#8B5CF6" />
            <circle cx={p.x} cy={p.y} r="0.8" fill="none" stroke="#8B5CF6" strokeWidth="0.2" opacity="0.7">
              {!reduced && (
                <>
                  <animate attributeName="r" values="0.8;2.6" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.7;0" dur="2.4s" repeatCount="indefinite" />
                </>
              )}
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
}
