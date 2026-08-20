export function StatsStrip() {
  return (
    <section
      id="stats-strip"
      className="bg-[#fffdd0] border-t border-b border-[#2d2d2d]/10 relative z-30"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 md:py-14">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-center">
          {/* Stat 1 */}
          <div className="flex items-center gap-4">
            <span className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#b8860b] font-medium tracking-tight">
              8,000+
            </span>
            <span className="font-sans text-[#2d2d2d]/70 uppercase tracking-[0.2em] text-xs font-semibold whitespace-nowrap text-left leading-tight">
              Clients <br /> Served
            </span>
          </div>

          <div className="hidden md:block w-px h-10 bg-[#2d2d2d]/15" />

          {/* Stat 2 */}
          <div className="flex items-center gap-4">
            <span className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#b8860b] font-medium tracking-tight">
              Successful
            </span>
            <span className="font-sans text-[#2d2d2d]/70 uppercase tracking-[0.2em] text-xs font-semibold whitespace-nowrap text-left leading-tight">
              Visa <br /> Applications
            </span>
          </div>

          <div className="hidden md:block w-px h-10 bg-[#2d2d2d]/15" />

          {/* Stat 3 */}
          <div className="flex items-center gap-4">
            <span className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#b8860b] font-medium tracking-tight">
              98.8%
            </span>
            <span className="font-sans text-[#2d2d2d]/70 uppercase tracking-[0.2em] text-xs font-semibold whitespace-nowrap text-left leading-tight">
              Approval <br /> Track Record
            </span>
          </div>

          <div className="hidden md:block w-px h-10 bg-[#2d2d2d]/15" />

          {/* Stat 4 */}
          <div className="flex items-center gap-4">
            <span className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#b8860b] font-medium tracking-tight">
              45+
            </span>
            <span className="font-sans text-[#2d2d2d]/70 uppercase tracking-[0.2em] text-xs font-semibold whitespace-nowrap text-left leading-tight">
              Global <br /> Destinations
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
