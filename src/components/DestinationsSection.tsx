import { useState, useId, useMemo } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Globe2,
  ShieldCheck,
  Sparkles,
  MapPin,
  Compass,
  Navigation
} from 'lucide-react';
import { geoNaturalEarth1, geoPath, geoGraticule } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { DESTINATIONS } from '../data/visaData';
import { Destination } from '../types';

interface DestinationsSectionProps {
  onSelectDestination: (id: string) => void;
  onOpenAssessment: (prefillDestinationId?: string) => void;
  onOpenDetailsModal: (destination: Destination) => void;
}

interface HubMarker {
  id: string;
  label: string;
  subLabel: string;
  coordinates: [number, number]; // [Longitude, Latitude]
  flag: string;
  labelAnchor?: 'left' | 'right' | 'top' | 'bottom';
  countryIds?: string[]; // Match ISO names/IDs in Natural Earth
}

const GLOBAL_HUBS: HubMarker[] = [
  {
    id: 'usa',
    label: 'USA',
    subLabel: 'USCIS & Consular Processing',
    coordinates: [-98.5795, 39.8283],
    flag: '🇺🇸',
    labelAnchor: 'top',
    countryIds: ['United States of America', 'USA', '840']
  },
  {
    id: 'california',
    label: 'California',
    subLabel: 'Silicon Valley & West Coast Hub',
    coordinates: [-119.6, 36.7783],
    flag: '🇺🇸',
    labelAnchor: 'left',
  },
  {
    id: 'canada',
    label: 'Canada',
    subLabel: 'Express Entry & Study Permits',
    coordinates: [-106.3468, 56.1304],
    flag: '🇨🇦',
    labelAnchor: 'top',
    countryIds: ['Canada', '124']
  },
  {
    id: 'uk',
    label: 'United Kingdom',
    subLabel: 'Standard Visitor & Skilled Worker',
    coordinates: [-2.0, 54.0],
    flag: '🇬🇧',
    labelAnchor: 'top',
    countryIds: ['United Kingdom', '826']
  },
  {
    id: 'europe',
    label: 'Europe (Schengen)',
    subLabel: '29 Countries & EU Blue Card',
    coordinates: [10.4515, 51.1657],
    flag: '🇪🇺',
    labelAnchor: 'right',
    countryIds: [
      'France', 'Germany', 'Italy', 'Spain', 'Switzerland', 'Netherlands',
      'Belgium', 'Sweden', 'Norway', 'Poland', 'Austria', 'Greece',
      'Portugal', 'Ireland', 'Denmark', 'Finland', 'Czechia', 'Hungary'
    ]
  },
  {
    id: 'singapore',
    label: 'Singapore',
    subLabel: 'Employment Pass & Tech.Pass',
    coordinates: [103.8198, 1.3521],
    flag: '🇸🇬',
    labelAnchor: 'left',
    countryIds: ['Singapore', '702', 'Malaysia']
  },
  {
    id: 'asia',
    label: 'Asia (Japan & East Asia)',
    subLabel: 'eVisas & Highly Skilled Talent',
    coordinates: [138.2529, 36.2048],
    flag: '🇯🇵',
    labelAnchor: 'right',
    countryIds: ['Japan', '392', 'South Korea', 'Taiwan']
  },
  {
    id: 'australia',
    label: 'Australia',
    subLabel: 'Points PR & Subclass 500/600',
    coordinates: [133.7751, -25.2744],
    flag: '🇦🇺',
    labelAnchor: 'bottom',
    countryIds: ['Australia', '036', 'New Zealand', '554']
  }
];

// Great-circle flight routes connecting major hubs
const FLIGHT_CORRIDORS: Array<{ from: [number, number]; to: [number, number] }> = [
  { from: [-119.6, 36.7783], to: [-98.5795, 39.8283] }, // California -> USA
  { from: [-98.5795, 39.8283], to: [-106.3468, 56.1304] }, // USA -> Canada
  { from: [-98.5795, 39.8283], to: [-2.0, 54.0] }, // USA -> UK (Transatlantic)
  { from: [-2.0, 54.0], to: [10.4515, 51.1657] }, // UK -> Europe
  { from: [10.4515, 51.1657], to: [103.8198, 1.3521] }, // Europe -> Singapore
  { from: [103.8198, 1.3521], to: [133.7751, -25.2744] }, // Singapore -> Australia
  { from: [103.8198, 1.3521], to: [138.2529, 36.2048] }, // Singapore -> Asia (Japan)
  { from: [138.2529, 36.2048], to: [-119.6, 36.7783] }, // Asia -> California (Transpacific)
];

export function DestinationsSection({
  onSelectDestination,
  onOpenAssessment,
  onOpenDetailsModal,
}: DestinationsSectionProps) {
  const [selectedId, setSelectedId] = useState<string>('usa');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selectedDestination =
    DESTINATIONS.find((d) => d.id === selectedId) || DESTINATIONS[0];
  const activeHub = GLOBAL_HUBS.find((h) => h.id === selectedId) || GLOBAL_HUBS[0];

  const mapGradId = useId();

  // 1. D3 Natural Earth Geographic Projection for True World Map
  const { countriesPaths, bordersPath, graticulePath, spherePath, projectedHubs, projectedCorridors } =
    useMemo(() => {
      const width = 960;
      const height = 500;

      // Real Natural Earth 1 Projection standard
      const projection = geoNaturalEarth1()
        .scale(168)
        .translate([width / 2, height / 2 + 10]);

      const pathGenerator = geoPath().projection(projection);

      // TopoJSON conversion to authentic GeoJSON features
      const topo = worldData as any;
      const countriesGeo = feature(topo, topo.objects.countries) as any;
      const bordersGeo = mesh(topo, topo.objects.countries, (a: any, b: any) => a !== b);
      const graticuleGenerator = geoGraticule();

      const countriesList = countriesGeo.features.map((feat: any) => {
        const path = pathGenerator(feat) || '';
        const name = feat.properties?.name || '';
        const id = feat.id || '';

        // Match destination
        let matchedDestinationId: string | null = null;
        for (const hub of GLOBAL_HUBS) {
          if (hub.countryIds && (hub.countryIds.includes(name) || hub.countryIds.includes(id))) {
            matchedDestinationId = hub.id;
            break;
          }
        }

        return {
          id,
          name,
          path,
          matchedDestinationId,
        };
      });

      const borders = pathGenerator(bordersGeo) || '';
      const graticule = pathGenerator(graticuleGenerator()) || '';
      const sphere = pathGenerator({ type: 'Sphere' }) || '';

      // Project Hub Markers
      const hubs = GLOBAL_HUBS.map((hub) => {
        const [x, y] = projection(hub.coordinates) || [0, 0];
        return {
          ...hub,
          x,
          y,
        };
      });

      // Project Great-Circle Flight Corridors
      const corridors = FLIGHT_CORRIDORS.map((corridor) => {
        const geoLine = {
          type: 'LineString',
          coordinates: [corridor.from, corridor.to],
        };
        return pathGenerator(geoLine as any) || '';
      });

      return {
        countriesPaths: countriesList,
        bordersPath: borders,
        graticulePath: graticule,
        spherePath: sphere,
        projectedHubs: hubs,
        projectedCorridors: corridors,
      };
    }, []);

  const handleMarkerSelect = (id: string) => {
    setSelectedId(id);
    onSelectDestination(id);
  };

  return (
    <section
      id="destinations"
      className="py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-[#f5f5dc] border-b border-[#2d2d2d]/10 relative overflow-hidden"
    >
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#b8860b]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto relative">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 text-center">
          <div className="inline-flex items-center gap-2 bg-[#fffdd0] border border-[#b8860b]/30 px-3.5 py-1 rounded-full text-[#b8860b] text-xs uppercase tracking-widest font-semibold mb-3 shadow-xs">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Global Consular Reach</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2d2d2d] mb-4 font-light">
            Destinations We Serve
          </h2>
          <p className="font-sans text-sm sm:text-base md:text-lg text-[#4a3c31]/85 font-light max-w-2xl mx-auto leading-relaxed">
            Real consular pathways mapped across every continent. Explore our primary travel, study, and immigration hubs worldwide.
          </p>
        </div>

        {/* Quick Country Pill Navigation Bar for Instant 1-Tap Access */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-6 sm:mb-8 scrollbar-none px-1">
          {GLOBAL_HUBS.map((hub) => {
            const isSelected = hub.id === selectedId;
            return (
              <button
                key={hub.id}
                id={`map-nav-pill-${hub.id}`}
                onClick={() => handleMarkerSelect(hub.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#b8860b] text-white border-[#b8860b] shadow-sm -translate-y-0.5'
                    : 'bg-[#fffdd0] text-[#2d2d2d] border-[#2d2d2d]/15 hover:border-[#b8860b]/60 hover:bg-[#fffdd0]/90'
                }`}
              >
                <span>{hub.flag}</span>
                <span>{hub.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Cartographic World Map Card */}
        <div className="bg-[#fffdd0] border border-[#2d2d2d]/15 rounded-sm p-4 sm:p-6 md:p-8 shadow-sm mb-10 relative overflow-hidden">
          {/* Top Bar Status / Map Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-[#2d2d2d]/10 text-xs">
            <div className="flex items-center gap-2 text-[#2d2d2d]/80 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#b8860b] animate-pulse" />
              <span className="font-serif tracking-wide text-sm font-semibold text-[#2d2d2d]">
                World Consular Cartography
              </span>
              <span className="text-[#2d2d2d]/40 hidden sm:inline">•</span>
              <span className="text-[#2d2d2d]/60 hidden sm:inline">
                Natural Earth Geographic Projection
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-[#2d2d2d]/70">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b8860b] ring-2 ring-[#b8860b]/25" />
                <span>Consular Hub</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-[1.5px] bg-[#b8860b] border-t border-dashed border-[#b8860b]" />
                <span>Active Flight Route</span>
              </div>
            </div>
          </div>

          {/* SVG Cartographic World Map */}
          <div className="relative w-full aspect-[1.92/1] min-h-[380px] max-h-[660px] bg-[#faf8ef] rounded-sm border border-[#2d2d2d]/12 overflow-hidden shadow-inner flex items-center justify-center">
            <svg
              viewBox="0 0 960 500"
              className="w-full h-full object-contain select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Ocean Ambient Gradient */}
                <radialGradient id={`oceanGrad-${mapGradId}`} cx="50%" cy="50%" r="65%">
                  <stop offset="0%" stopColor="#faf7ed" />
                  <stop offset="70%" stopColor="#f3eedd" />
                  <stop offset="100%" stopColor="#e8dfc7" />
                </radialGradient>

                {/* Landmass Neutral Fill */}
                <linearGradient id={`landGrad-${mapGradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ded5be" />
                  <stop offset="100%" stopColor="#cebe9a" />
                </linearGradient>

                {/* Highlighted Country Fill */}
                <linearGradient id={`activeLandGrad-${mapGradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#b8860b" />
                </linearGradient>

                {/* Glow Filter for Active Hub */}
                <filter id={`hubGlow-${mapGradId}`} x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. Global Ocean Realm Background */}
              <rect width="960" height="500" fill={`url(#oceanGrad-${mapGradId})`} />

              {/* 2. World Outline Frame / Natural Earth Boundary */}
              {spherePath && (
                <path
                  d={spherePath}
                  fill="none"
                  stroke="#b8860b"
                  strokeWidth="1"
                  strokeOpacity="0.25"
                />
              )}

              {/* 3. Geographic Lat/Long Graticule Grid Lines */}
              {graticulePath && (
                <path
                  d={graticulePath}
                  fill="none"
                  stroke="#2d2d2d"
                  strokeWidth="0.5"
                  strokeOpacity="0.09"
                  strokeDasharray="3 4"
                />
              )}

              {/* 4. REAL GEOGRAPHIC COUNTRIES (100% TopoJSON Coastlines & Islands) */}
              <g id="world-countries-layer" className="transition-colors duration-200">
                {countriesPaths.map((country: any) => {
                  const isDestinationCountry =
                    country.matchedDestinationId &&
                    (country.matchedDestinationId === selectedId ||
                      (selectedId === 'california' && country.matchedDestinationId === 'usa'));
                  const isHovered =
                    hoveredId &&
                    country.matchedDestinationId &&
                    country.matchedDestinationId === hoveredId;

                  return (
                    <path
                      key={country.id || country.name}
                      d={country.path}
                      fill={
                        isDestinationCountry
                          ? `url(#activeLandGrad-${mapGradId})`
                          : isHovered
                          ? '#e5d7ad'
                          : `url(#landGrad-${mapGradId})`
                      }
                      fillOpacity={isDestinationCountry ? 0.95 : 0.85}
                      stroke={isDestinationCountry ? '#9a7009' : '#b8860b'}
                      strokeWidth={isDestinationCountry ? 1 : 0.45}
                      strokeOpacity={isDestinationCountry ? 0.9 : 0.35}
                      onClick={() => {
                        if (country.matchedDestinationId) {
                          handleMarkerSelect(country.matchedDestinationId);
                        }
                      }}
                      onMouseEnter={() => {
                        if (country.matchedDestinationId) {
                          setHoveredId(country.matchedDestinationId);
                        }
                      }}
                      onMouseLeave={() => setHoveredId(null)}
                      className={`transition-colors duration-200 ${
                        country.matchedDestinationId ? 'cursor-pointer' : ''
                      }`}
                    >
                      <title>{country.name}</title>
                    </path>
                  );
                })}
              </g>

              {/* 5. Country Interior Borders Mesh */}
              {bordersPath && (
                <path
                  d={bordersPath}
                  fill="none"
                  stroke="#2d2d2d"
                  strokeWidth="0.4"
                  strokeOpacity="0.18"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />
              )}

              {/* 6. Authentic Great-Circle Flight Corridors */}
              <g fill="none" stroke="#b8860b" strokeWidth="1.3" opacity="0.65" className="pointer-events-none">
                {projectedCorridors.map((d: string, i: number) => (
                  <path
                    key={`corridor-${i}`}
                    d={d}
                    strokeDasharray="4 6"
                    className="animate-dash-travel"
                    strokeLinecap="round"
                  />
                ))}
              </g>

              {/* 7. Active Selected Hub Radar Beacon Pulse */}
              {activeHub && (
                <g className="pointer-events-none">
                  {/* Outer pulse */}
                  <circle
                    cx={activeHub.coordinates ? (projectedHubs.find((h) => h.id === activeHub.id)?.x || 0) : 0}
                    cy={activeHub.coordinates ? (projectedHubs.find((h) => h.id === activeHub.id)?.y || 0) : 0}
                    r="20"
                    fill="none"
                    stroke="#b8860b"
                    strokeWidth="1.4"
                    strokeOpacity="0.45"
                    className="animate-ping origin-center"
                  />
                  <circle
                    cx={projectedHubs.find((h) => h.id === activeHub.id)?.x || 0}
                    cy={projectedHubs.find((h) => h.id === activeHub.id)?.y || 0}
                    r="10"
                    fill="#b8860b"
                    fillOpacity="0.22"
                  />
                </g>
              )}

              {/* 8. INTERACTIVE GLOBAL HUB MARKER PINS */}
              {projectedHubs.map((hub) => {
                const isSelected = hub.id === selectedId;
                const isHovered = hub.id === hoveredId;

                return (
                  <g
                    key={hub.id}
                    id={`map-hub-${hub.id}`}
                    onClick={() => handleMarkerSelect(hub.id)}
                    onMouseEnter={() => setHoveredId(hub.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="cursor-pointer transition-all duration-300 group focus:outline-none"
                    tabIndex={0}
                    role="button"
                    aria-label={`Select ${hub.label} Hub`}
                  >
                    {/* Generous 44px Minimum Touch Area */}
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r="22"
                      fill="transparent"
                      className="pointer-events-auto"
                    />

                    {/* Outer Target Circle */}
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={isSelected ? 9 : isHovered ? 7.5 : 5.5}
                      fill={isSelected ? '#b8860b' : '#2d2d2d'}
                      fillOpacity={isSelected ? 0.3 : 0.15}
                      stroke={isSelected ? '#b8860b' : '#ffffff'}
                      strokeWidth={isSelected ? 1.5 : 1}
                      className="transition-all duration-300"
                    />

                    {/* Core Glowing Dot */}
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={isSelected ? 4.5 : isHovered ? 4 : 3}
                      fill={isSelected ? '#b8860b' : isHovered ? '#b8860b' : '#ffffff'}
                      stroke={isSelected ? '#ffffff' : '#2d2d2d'}
                      strokeWidth={isSelected ? 1.5 : 1}
                      filter={isSelected ? `url(#hubGlow-${mapGradId})` : undefined}
                      className="transition-all duration-300"
                    />

                    {/* Concise Label Tag with Flag */}
                    <g
                      transform={`translate(${hub.x}, ${
                        hub.labelAnchor === 'top'
                          ? hub.y - 12
                          : hub.labelAnchor === 'left'
                          ? hub.y - 4
                          : hub.labelAnchor === 'right'
                          ? hub.y - 4
                          : hub.y + 16
                      })`}
                      className="transition-transform duration-200 pointer-events-none"
                    >
                      {/* Label Pill Box */}
                      <rect
                        x={
                          hub.labelAnchor === 'left'
                            ? -85
                            : hub.labelAnchor === 'right'
                            ? 10
                            : -40
                        }
                        y={-9}
                        width={
                          hub.labelAnchor === 'left'
                            ? 80
                            : hub.labelAnchor === 'right'
                            ? 85
                            : 80
                        }
                        height={18}
                        rx={9}
                        fill={isSelected ? '#2d2d2d' : isHovered ? '#fffdd0' : '#f5f5dc'}
                        stroke={isSelected ? '#b8860b' : '#2d2d2d'}
                        strokeOpacity={isSelected ? 1 : 0.25}
                        strokeWidth={isSelected ? 1.2 : 0.75}
                        className="shadow-sm transition-all duration-200"
                      />

                      {/* Flag + Label Text */}
                      <text
                        x={
                          hub.labelAnchor === 'left'
                            ? -45
                            : hub.labelAnchor === 'right'
                            ? 52
                            : 0
                        }
                        y={3.5}
                        textAnchor="middle"
                        fill={isSelected ? '#ffffff' : '#2d2d2d'}
                        fontSize="8.5"
                        fontWeight={isSelected ? 'bold' : '600'}
                        fontFamily="Inter, sans-serif"
                        className="select-none tracking-tight"
                      >
                        {hub.flag} {hub.label}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* 9. Vintage/Luxury Cartographic Elements */}
              {/* Compass Rose in South Pacific */}
              <g transform="translate(130, 410)" opacity="0.45" className="pointer-events-none">
                <circle cx="0" cy="0" r="24" fill="none" stroke="#b8860b" strokeWidth="0.75" />
                <circle cx="0" cy="0" r="18" fill="none" stroke="#2d2d2d" strokeWidth="0.5" strokeDasharray="2 2" />
                {/* 4-Point Compass Star */}
                <polygon points="0,-22 4,-5 0,0 -4,-5" fill="#b8860b" />
                <polygon points="0,22 4,5 0,0 -4,5" fill="#2d2d2d" />
                <polygon points="22,0 5,4 0,0 5,-4" fill="#2d2d2d" />
                <polygon points="-22,0 -5,4 0,0 -5,-4" fill="#2d2d2d" />
                <text x="0" y="-25" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#b8860b" fontFamily="serif">N</text>
                <text x="0" y="32" textAnchor="middle" fontSize="6" fill="#2d2d2d" fontFamily="serif">S</text>
                <text x="28" y="2" textAnchor="start" fontSize="6" fill="#2d2d2d" fontFamily="serif">E</text>
                <text x="-28" y="2" textAnchor="end" fontSize="6" fill="#2d2d2d" fontFamily="serif">W</text>
              </g>

              {/* Prime Meridian & Equator Text Legend */}
              <text x="480" y="492" textAnchor="middle" fontSize="7" fill="#2d2d2d" opacity="0.35" fontFamily="serif">
                EQUATOR 0° • GREENWICH MERIDIAN 0° • NATURAL EARTH GEODETIC SYSTEM
              </text>
            </svg>
          </div>
        </div>

        {/* Selected Destination Interactive Consular Dossier Card */}
        <div className="bg-[#fffdd0] border border-[#2d2d2d]/15 p-6 sm:p-8 md:p-10 rounded-sm shadow-sm transition-all duration-300 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Comprehensive Destination Intel */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 bg-[#b8860b]/15 text-[#9a7009] text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-none">
                  <MapPin className="w-3 h-3 text-[#b8860b]" />
                  <span>{selectedDestination.category}</span>
                </span>
                <span className="text-xs text-[#2d2d2d]/60 font-medium flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-[#b8860b]" />
                  {activeHub.subLabel}
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-3xl sm:text-4xl">{selectedDestination.flag}</span>
                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2d2d2d] font-bold">
                  {selectedDestination.name} Visa Guidance
                </h3>
              </div>

              <p className="text-sm sm:text-base text-[#4a3c31] leading-relaxed mb-6 font-light">
                {selectedDestination.description}
              </p>

              {/* Specialized Visa Tracks */}
              <div className="mb-6">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#2d2d2d]/70 block mb-2.5">
                  Key Specialized Visa Pathways:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedDestination.popularVisas.map((visa, idx) => (
                    <span
                      key={idx}
                      className="bg-[#f5f5dc] border border-[#2d2d2d]/15 text-xs text-[#2d2d2d] px-3 py-1.5 rounded-full font-medium shadow-2xs hover:border-[#b8860b]/50 transition-colors"
                    >
                      {visa}
                    </span>
                  ))}
                </div>
              </div>

              {/* Core Requirements Checkpoints */}
              <div className="space-y-2.5 pt-2 border-t border-[#2d2d2d]/10">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#2d2d2d]/70 block">
                  Mandatory Consular Standards:
                </span>
                {selectedDestination.keyRequirements.slice(0, 3).map((req, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#2d2d2d]/85">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#b8860b] shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Key Consular Metrics & Action Triggers */}
            <div className="lg:col-span-5 bg-[#f5f5dc] border border-[#2d2d2d]/15 p-6 rounded-sm flex flex-col justify-between h-full shadow-2xs">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2d2d2d]/10">
                  <h4 className="font-serif text-lg font-bold text-[#2d2d2d] flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#b8860b]" />
                    <span>Consular Benchmarks</span>
                  </h4>
                  <span className="text-[10px] text-[#b8860b] uppercase font-bold tracking-widest bg-[#fffdd0] px-2 py-0.5 rounded border border-[#b8860b]/30">
                    2025 Standard
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Processing Window */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#2d2d2d]/70 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#b8860b]" /> Processing Window
                    </span>
                    <span className="font-semibold text-[#2d2d2d]">
                      {selectedDestination.averageProcessingTime}
                    </span>
                  </div>

                  {/* Historical Approval */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#2d2d2d]/70 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#b8860b]" /> Historical Approval
                    </span>
                    <span className="font-bold text-[#b8860b]">
                      {selectedDestination.successRate}
                    </span>
                  </div>

                  {/* Financial Solvency */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#2d2d2d]/70 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-[#b8860b]" /> Financial Solvency
                    </span>
                    <span className="font-semibold text-[#2d2d2d] text-right">
                      {selectedDestination.financialProof}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Assessment & Dossier Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t border-[#2d2d2d]/10">
                <button
                  id={`destination-start-btn-${selectedDestination.id}`}
                  onClick={() => onOpenAssessment(selectedDestination.id)}
                  className="w-full bg-[#b8860b] text-white py-3.5 text-xs uppercase tracking-widest font-bold hover:bg-[#9a7009] transition-all shadow-sm text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Your Visa Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  id={`destination-details-btn-${selectedDestination.id}`}
                  onClick={() => onOpenDetailsModal(selectedDestination)}
                  className="w-full border border-[#2d2d2d]/30 text-[#2d2d2d] py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#2d2d2d]/5 transition-colors text-center cursor-pointer"
                >
                  View Complete Country Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
