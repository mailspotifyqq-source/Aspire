import { useEffect, useRef } from 'react';

/**
 * Ultra-Smooth 60FPS Scroll-Triggered Airplane with Aspire Travels Trailing Flag
 * 
 * Performance Optimizations:
 * 1. ZERO React re-renders during flight: Directly updates DOM element via transform3d on RAF.
 * 2. GPU-Accelerated: Only animates `transform` (translate3d, rotate, scale) and `opacity`.
 * 3. Layout Stability: No left/top layout thrashing or forced reflows.
 * 4. IntersectionObserver: Monitors section entries with a debounce cooldown to prevent spam.
 * 5. Aspire Travels Trailing Flag: Lightweight vector/HTML ribbon with organic fluttering wave.
 * 6. Accessibility: 100% disabled if `prefers-reduced-motion: reduce` is detected.
 */
export function AirplaneFlyby() {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRigRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isFlyingRef = useRef(false);
  const lastTriggerTimeRef = useRef(0);
  const lastSectionIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const planeRig = planeRigRef.current;
    if (!planeRig) return;

    // Trigger flight animation along smooth cubic Bezier curve
    const startFlight = (type: 'initial' | 'scroll', altitudeOffset = 0) => {
      const now = performance.now();
      // Cooldown between flights (at least 6.5s)
      if (isFlyingRef.current || now - lastTriggerTimeRef.current < 6500) {
        return;
      }

      isFlyingRef.current = true;
      lastTriggerTimeRef.current = now;

      // Slow, relaxed, graceful cruising speed (6.8s - 7.5s)
      const duration = type === 'initial' ? 7500 : 6800;
      const startTime = performance.now();

      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;

      // Bezier Control Points in Pixels (Left -> Cruise Arc -> Right)
      const p0 = { x: -180, y: viewportH * (type === 'initial' ? 0.38 : 0.44 + altitudeOffset) };
      const p1 = { x: viewportW * 0.30, y: viewportH * (type === 'initial' ? 0.18 : 0.22 + altitudeOffset) };
      const p2 = { x: viewportW * 0.72, y: viewportH * (type === 'initial' ? 0.22 : 0.26 + altitudeOffset) };
      const p3 = { x: viewportW + 200, y: viewportH * (type === 'initial' ? 0.36 : 0.40 + altitudeOffset) };

      const cx = 3 * (p1.x - p0.x);
      const bx = 3 * (p2.x - p1.x) - cx;
      const ax = p3.x - p0.x - cx - bx;

      const cy = 3 * (p1.y - p0.y);
      const by = 3 * (p2.y - p1.y) - cy;
      const ay = p3.y - p0.y - cy - by;

      const scale = viewportW < 640 ? 0.65 : 0.78;

      const animate = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const rawProgress = Math.min(elapsed / duration, 1.0);

        // Smooth cubic ease-in-out progress
        const t = rawProgress < 0.5
          ? 2 * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

        const currentX = ax * Math.pow(t, 3) + bx * Math.pow(t, 2) + cx * t + p0.x;
        const currentY = ay * Math.pow(t, 3) + by * Math.pow(t, 2) + cy * t + p0.y;

        // Tangent derivative for aerodynamic pitch angle
        const dx = 3 * ax * Math.pow(t, 2) + 2 * bx * t + cx;
        const dy = 3 * ay * Math.pow(t, 2) + 2 * by * t + cy;
        const angleRad = Math.atan2(dy, dx);
        const angleDeg = (angleRad * 180) / Math.PI;

        // Opacity fade at entrance/exit
        let opacity = 1;
        if (rawProgress < 0.08) {
          opacity = rawProgress / 0.08;
        } else if (rawProgress > 0.92) {
          opacity = (1 - rawProgress) / 0.08;
        }

        // Direct hardware-accelerated style update (NO React setState)
        if (planeRig) {
          planeRig.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${angleDeg}deg) scale(${scale})`;
          planeRig.style.opacity = `${opacity}`;
          planeRig.style.visibility = 'visible';
        }

        if (rawProgress < 1.0) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          if (planeRig) {
            planeRig.style.visibility = 'hidden';
            planeRig.style.opacity = '0';
          }
          isFlyingRef.current = false;
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // 1. Initial Page Load Launch (after 900ms)
    const initialTimer = setTimeout(() => {
      startFlight('initial', 0);
    }, 900);

    // 2. IntersectionObserver on major sections
    const sections = [
      { id: 'destinations', offset: -0.04 },
      { id: 'services', offset: 0.05 },
      { id: 'why-us', offset: -0.02 },
      { id: 'success', offset: 0.03 }
    ];

    const observedElements: HTMLElement[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
            const sectionId = entry.target.id;
            if (lastSectionIdRef.current !== sectionId && !isFlyingRef.current) {
              lastSectionIdRef.current = sectionId;
              const config = sections.find((s) => s.id === sectionId);
              startFlight('scroll', config ? config.offset : 0);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -15% 0px',
        threshold: 0.15
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        observedElements.push(el);
      }
    });

    return () => {
      clearTimeout(initialTimer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      observedElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Plane Rig with Trailing Flag - Positioned via GPU translate3d */}
      <div
        ref={planeRigRef}
        className="absolute top-0 left-0 will-change-transform flex items-center"
        style={{
          visibility: 'hidden',
          opacity: 0,
          transform: 'translate3d(-200px, -200px, 0)',
        }}
      >
        {/* Soft cloud puffs that travel with the flyby */}
        <div className="absolute right-[104%] top-1/2 -translate-y-1/2 pointer-events-none opacity-70">
          <div className="relative h-24 w-56 sm:w-72">
            <span className="absolute left-2 top-7 h-8 w-16 rounded-full bg-white/70 blur-[1px] shadow-[24px_-8px_0_rgba(255,255,255,0.5),46px_4px_0_rgba(255,255,255,0.38)] animate-cloud-drift" />
            <span className="absolute left-24 top-12 h-7 w-14 rounded-full bg-white/55 blur-[1px] shadow-[20px_5px_0_rgba(255,255,255,0.34),38px_-6px_0_rgba(255,255,255,0.28)] animate-cloud-drift-slow" />
            <span className="absolute left-44 top-4 hidden h-6 w-12 rounded-full bg-white/45 blur-[1px] shadow-[18px_6px_0_rgba(255,255,255,0.25)] sm:block animate-cloud-drift" />
          </div>
        </div>

        {/* Trailing Aspire Travels Pennant / Flag (Attached behind aircraft) */}
        <div className="flex items-center mr-[-8px] pointer-events-none relative z-10">
          {/* Natural Flag / Pennant Banner */}
          <div className="animate-flag-wave bg-[#f5f5dc] border border-[#b8860b]/70 shadow-[0_6px_18px_rgba(45,45,45,0.16)] px-4 py-2 rounded-[2px] flex items-center gap-2 backdrop-blur-xs">
            {/* Small Gold Compass / Monogram */}
            <svg
              viewBox="0 0 16 16"
              className="w-4 h-4 text-[#b8860b] shrink-0"
              fill="currentColor"
            >
              <polygon points="8,1 10,7 15,8 10,9 8,15 6,9 1,8 6,7" />
            </svg>
            <span className="font-serif tracking-widest text-[12px] sm:text-[13px] uppercase font-bold text-[#2d2d2d] whitespace-nowrap">
              Aspire Travels
            </span>
          </div>

          {/* Thin Flexible Tether Line to Aircraft Tail */}
          <div className="w-12 sm:w-16 h-[1.5px] bg-gradient-to-r from-[#b8860b]/60 to-[#2d2d2d]/35" />
        </div>

        {/* Engine Contrail Vapor Trails */}
        <div className="absolute right-[96%] top-[50%] -translate-y-1/2 w-28 sm:w-40 h-3 pointer-events-none opacity-40">
          <div className="w-full h-[1.5px] bg-gradient-to-l from-white via-[#b8860b]/35 to-transparent blur-[0.8px] transform -translate-y-1" />
          <div className="w-full h-[1.5px] bg-gradient-to-l from-white via-[#b8860b]/35 to-transparent blur-[0.8px] transform translate-y-1" />
        </div>

        {/* High-Precision Refined Passenger Jet Airliner SVG */}
        <div className="relative">
          <svg
            viewBox="0 0 240 100"
            className="w-24 sm:w-32 md:w-36 h-auto drop-shadow-[0_6px_14px_rgba(45,45,45,0.18)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="flybyFuselageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#f8fafc" />
                <stop offset="85%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
              <linearGradient id="flybyWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f1f5f9" />
                <stop offset="70%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <linearGradient id="flybyEngineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <linearGradient id="flybyGoldLivery" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9a7009" />
                <stop offset="50%" stopColor="#b8860b" />
                <stop offset="100%" stopColor="#dfba73" />
              </linearGradient>
            </defs>

            {/* Far Side Wing */}
            <path d="M95 44 L50 20 L62 18 L122 42 Z" fill="url(#flybyWingGrad)" opacity="0.85" />
            <rect x="74" y="27" width="20" height="6.5" rx="3.25" fill="url(#flybyEngineGrad)" />

            {/* Far Side Stabilizer */}
            <path d="M28 47 L12 40 L16 38 L38 46 Z" fill="url(#flybyWingGrad)" />

            {/* Aerodynamic Fuselage */}
            <path
              d="M218 53 C214 47 195 43 145 43 C95 43 45 44 24 47 C16 48 10 50 8 52 C10 54 16 56 24 57 C45 60 95 61 145 61 C195 61 214 57 218 53 Z"
              fill="url(#flybyFuselageGrad)"
            />

            {/* Gold Cheatline */}
            <path
              d="M30 53 C70 53 140 53 205 53 C208 53 212 53.5 214 54 C210 54.8 190 55 140 55 C70 55 30 54.5 30 53 Z"
              fill="url(#flybyGoldLivery)"
            />

            {/* Cockpit Window */}
            <path
              d="M202 48 C198 48 194 48 191 49 C190 50.5 192 51.5 195 51.5 C199 51.5 204 50.5 206 49.5 C205 48.8 204 48.2 202 48 Z"
              fill="#0f172a"
            />

            {/* Passenger Windows */}
            <g fill="#1e293b" opacity="0.75">
              <circle cx="178" cy="50" r="1.1" />
              <circle cx="170" cy="50" r="1.1" />
              <circle cx="162" cy="50" r="1.1" />
              <circle cx="154" cy="50" r="1.1" />
              <circle cx="146" cy="50" r="1.1" />
              <circle cx="138" cy="50" r="1.1" />
              <circle cx="130" cy="50" r="1.1" />
              <circle cx="122" cy="50" r="1.1" />
              <circle cx="114" cy="50" r="1.1" />
              <circle cx="106" cy="50" r="1.1" />
              <circle cx="98" cy="50" r="1.1" />
              <circle cx="90" cy="50" r="1.1" />
              <circle cx="82" cy="50" r="1.1" />
              <circle cx="74" cy="50" r="1.1" />
              <circle cx="66" cy="50" r="1.1" />
            </g>

            {/* Vertical Tail Fin */}
            <path d="M36 47 L12 14 C11 12 13 11 15 11 L28 11 L56 46 Z" fill="url(#flybyGoldLivery)" />
            <path d="M26 14 L17 14 L36 44 L44 44 Z" fill="#ffffff" opacity="0.35" />

            {/* Near Side Main Wing */}
            <path d="M136 56 L62 86 L50 84 L108 55 Z" fill="url(#flybyWingGrad)" />
            <path d="M50 84 L46 76 L51 77 L53 84 Z" fill="url(#flybyGoldLivery)" />

            {/* Near Side Jet Engine */}
            <g>
              <path d="M102 56 L96 66 L104 66 L108 56 Z" fill="#64748b" />
              <rect x="88" y="65" width="26" height="9" rx="4.5" fill="url(#flybyEngineGrad)" />
              <ellipse cx="114" cy="69.5" rx="2" ry="4.2" fill="#1e293b" />
              <rect x="84" y="67" width="5" height="5" rx="1.5" fill="#334155" />
            </g>

            {/* Near Side Horizontal Stabilizer */}
            <path d="M38 55 L16 66 L12 64 L28 54 Z" fill="url(#flybyWingGrad)" />

            {/* Strobe & Nav Lights */}
            <circle cx="48" cy="76" r="1.5" fill="#34c759" />
            <circle cx="12" cy="12" r="1.3" fill="#ffffff" />
          </svg>
        </div>
      </div>
    </div>
  );
}
