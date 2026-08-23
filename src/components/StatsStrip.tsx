interface StatItem {
  value: string;
  labelTop: string;
  labelBottom: string;
}

const STATS_DATA: StatItem[] = [
  {
    value: "8,000+",
    labelTop: "Clients",
    labelBottom: "Served",
  },
  {
    value: "98.8%",
    labelTop: "Approval",
    labelBottom: "Track Record",
  },
  {
    value: "45+",
    labelTop: "Global",
    labelBottom: "Destinations",
  },
  {
    value: "15+",
    labelTop: "Years Of",
    labelBottom: "Excellence",
  },
  {
    value: "100%",
    labelTop: "Pre-Screen",
    labelBottom: "Guarantee",
  },
  {
    value: "24/7",
    labelTop: "Case",
    labelBottom: "Tracking",
  },
];

export function StatsStrip() {
  return (
    <section
      id="stats-strip"
      className="bg-[#fffdd0] border-t border-b border-[#2d2d2d]/10 relative z-30 overflow-hidden py-6 md:py-8 select-none"
      aria-label="Key Performance Statistics"
    >
      {/* Edge gradient masks for smooth seamless fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#fffdd0] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#fffdd0] to-transparent z-10" />

      {/* Continuously moving marquee container (moving left to right) */}
      <div className="animate-marquee-left-to-right flex items-center">
        {/* Set 1 */}
        <div className="flex items-center shrink-0">
          {STATS_DATA.map((stat, idx) => (
            <div key={`stat-1-${idx}`} className="flex items-center">
              <div className="flex items-center gap-3.5 px-8 md:px-12 py-2">
                <span className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#b8860b] font-medium tracking-tight whitespace-nowrap">
                  {stat.value}
                </span>
                <span className="font-sans text-[#2d2d2d]/75 uppercase tracking-[0.18em] text-[11px] sm:text-xs font-semibold whitespace-nowrap text-left leading-tight">
                  {stat.labelTop} <br /> {stat.labelBottom}
                </span>
              </div>
              <div className="w-px h-8 sm:h-10 bg-[#2d2d2d]/15 shrink-0" />
            </div>
          ))}
        </div>

        {/* Set 2 (Duplicate for infinite seamless loop) */}
        <div className="flex items-center shrink-0">
          {STATS_DATA.map((stat, idx) => (
            <div key={`stat-2-${idx}`} className="flex items-center">
              <div className="flex items-center gap-3.5 px-8 md:px-12 py-2">
                <span className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#b8860b] font-medium tracking-tight whitespace-nowrap">
                  {stat.value}
                </span>
                <span className="font-sans text-[#2d2d2d]/75 uppercase tracking-[0.18em] text-[11px] sm:text-xs font-semibold whitespace-nowrap text-left leading-tight">
                  {stat.labelTop} <br /> {stat.labelBottom}
                </span>
              </div>
              <div className="w-px h-8 sm:h-10 bg-[#2d2d2d]/15 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

