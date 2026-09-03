export interface VisaNewsItem {
  id: string;
  title: string;
  date: string;
  isoDate: string;
  country: string;
  countryCode: 'usa' | 'canada' | 'schengen' | 'uk' | 'australia' | 'global';
  flag: string;
  category: 'Executive Policy' | 'Appointment Slots' | 'Work Visas' | 'Student Visas' | 'USCIS Rule' | 'Border & Digital';
  badge: string;
  badgeType: 'urgent' | 'live' | 'policy' | 'update';
  summary: string;
  fullContent: {
    overview: string;
    keyPoints: string[];
    affectedApplicants: string[];
    comparison?: {
      affectedTitle: string;
      affectedSubtitle: string;
      affectedItems: string[];
      affectedNote: string;
      notAffectedTitle: string;
      notAffectedSubtitle: string;
      notAffectedItems: string[];
      notAffectedNote: string;
    };
    recentUpdateContext?: string;
    recommendedAction: string;
  };
  officialSource: string;
  impactLevel: 'High' | 'Medium' | 'Standard';
  isLiveHighlight?: boolean;
}

export const VISA_NEWS_DATA: VisaNewsItem[] = [
  {
    id: 'us-pauses-immigrant-visa-processing-worldwide',
    title: 'BREAKING: U.S. Pauses Immigrant Visa Processing Worldwide Amid New Screening & Public-Charge Training',
    date: 'Breaking Alert',
    isoDate: '2026-08-25',
    country: 'United States',
    countryCode: 'usa',
    flag: '🇺🇸',
    category: 'Executive Policy',
    badge: 'BREAKING PAUSE',
    badgeType: 'urgent',
    summary: 'Trump administration pauses immigrant visa (Green Card) appointments globally at U.S. embassies & consulates for public-charge officer training. Nonimmigrant visas (H-1B, F-1, B1/B2, L-1) are continuing as usual and NOT affected.',
    fullContent: {
      overview: 'The Trump administration has paused immigrant visa appointments and applications globally at U.S. embassies and consulates while the State Department conducts new "in-depth training" for consular officers. The training focuses in part on rigorously evaluating whether immigrant visa applicants could become dependent on U.S. public benefits under revised public-charge rules. Applicants with already-scheduled immigrant visa interviews have reportedly received notices that their appointments are being rescheduled, and no clear date has yet been announced for when normal immigrant visa processing will resume.',
      keyPoints: [
        'Worldwide pause on immigrant visa interviews across all U.S. embassies and consular posts.',
        'State Department conducting comprehensive mandatory training for consular officers focused on public-charge dependency assessments.',
        'Applicants with existing interview appointments are receiving official rescheduling notifications.',
        'CRITICAL DISTINCTION: Nonimmigrant visas (B1/B2, F-1, H-1B, L-1, O-1, J-1, H-4) are NOT paused and are continuing as usual.',
        'No fixed date has been officially released for when regular immigrant visa appointments will resume.'
      ],
      affectedApplicants: [
        'Family-based immigrant visa applicants (IR-1, CR-1, F1, F2A, F2B, F3, F4)',
        'Employment-based immigrant petitions (EB-1, EB-2, EB-3, EB-4, EB-5)',
        'Diversity Visa (DV) lottery winners awaiting consular processing',
        'Special Immigrant visa categories'
      ],
      comparison: {
        affectedTitle: 'WHAT IS AFFECTED?',
        affectedSubtitle: 'IMMIGRANT VISAS (Green Card Visas)',
        affectedItems: [
          'Family-based immigrant visas (IR-1, CR-1, F1, F2A, F2B, F3, F4)',
          'Employment-based immigrant visas (EB-1, EB-2, EB-3, EB-4, EB-5)',
          'Diversity Visa (DV) lottery consular interviews',
          'Certain special immigrant visa categories'
        ],
        affectedNote: 'These are visas used to immigrate permanently to the U.S. Interviews are currently being rescheduled.',
        notAffectedTitle: 'WHAT IS NOT AFFECTED?',
        notAffectedSubtitle: 'NONIMMIGRANT VISAS (Temporary Visas)',
        notAffectedItems: [
          'H-1B Specialty Occupation & H-4 Dependents',
          'F-1 & M-1 Student Visas',
          'B1/B2 Tourist & Business Visitors',
          'L-1 Intracompany Transferees',
          'J-1 Exchange Visitors & O-1 Extraordinary Ability',
          'All other temporary nonimmigrant categories'
        ],
        notAffectedNote: 'These visas are continuing as usual. This worldwide pause does NOT apply to them.'
      },
      recentUpdateContext: "Just days prior to this directive, a federal judge struck down the administration's earlier policy that had suspended immigrant visa processing for nationals of 75 countries, finding that policy exceeded the Secretary of State's authority.",
      recommendedAction: 'Aspire Travels advises all immigrant visa candidates to prepare an ironclad Public Charge Financial Affidavit (Form I-864), audited tax returns, and comprehensive asset evaluations. If your interview was rescheduled, contact our consular team for case tracking.'
    },
    officialSource: 'U.S. Department of State, Reuters & Major U.S. News Outlets',
    impactLevel: 'High',
    isLiveHighlight: true
  },
  {
    id: 'us-trump-policy-scrutiny-2026',
    title: 'US Consular Scrutiny & DS-160 Compliance Advisory Under Current Executive Directives',
    date: 'Latest Live Bulletin',
    isoDate: '2026-03-01',
    country: 'United States',
    countryCode: 'usa',
    flag: '🇺🇸',
    category: 'Executive Policy',
    badge: 'HIGH IMPORTANCE',
    badgeType: 'urgent',
    summary: 'US Department of State & USCIS issue heightened consular screening directives. Strict DS-160 employment history, financial ties, and social media disclosures are under thorough officer review.',
    fullContent: {
      overview: 'In accordance with current US administration executive policy directives and heightened immigration enforcement frameworks, US Embassy and Consular sections worldwide have reinforced stringent adjudication standards across all non-immigrant and immigrant categories (B1/B2, F-1, H-1B, L-1, and EB pathways). Consular officers are exercising rigorous discretion regarding immigrant intent (Section 214(b) INA) and document accuracy.',
      keyPoints: [
        'Mandatory 100% verification of DS-160 employment dates, income figures, and residential histories against tax records and LinkedIn profiles.',
        'Intensified scrutiny on non-immigrant intent: strong economic, social, and familial ties to home country must be substantiated with verified documentation.',
        'Enhanced administrative processing (INA Section 221(g)) questionnaires for STEM research fields and advanced technology professionals.',
        'Strict biometric capture and social media identifier disclosures must match all prior visa petition filings.'
      ],
      affectedApplicants: [
        'B1/B2 Tourist & Business visitors',
        'F-1 Academic & M-1 Vocational students',
        'H-1B, L-1, and O-1 specialty employment applicants',
        'First-time visa applicants and interview-waiver dropbox candidates'
      ],
      recommendedAction: 'Aspire Travels provides mandatory DS-160 pre-audit screening and simulated consular interview preparation to ensure 100% filing accuracy before embassy submission.'
    },
    officialSource: 'U.S. Department of State & USCIS Consular Affairs',
    impactLevel: 'High',
    isLiveHighlight: true
  },
  {
    id: 'us-india-appointments-drop',
    title: 'US Mission in India Opens 250,000+ Non-Immigrant Interview & Dropbox Appointment Slots',
    date: 'February 2026',
    isoDate: '2026-02-24',
    country: 'United States',
    countryCode: 'usa',
    flag: '🇺🇸',
    category: 'Appointment Slots',
    badge: 'SLOT RELEASE',
    badgeType: 'live',
    summary: 'US Embassy New Delhi and Consulates in Mumbai, Hyderabad, Chennai, and Kolkata have opened thousands of fresh in-person interview dates and Dropbox waiver slots for 2026.',
    fullContent: {
      overview: 'To significantly curtail visa appointment wait times, the US Mission to India has opened over 250,000 fresh visa appointment slots across New Delhi, Mumbai, Chennai, Hyderabad, and Kolkata consular posts. The release encompasses first-time B1/B2 visitor applicants, F-1 students for upcoming academic terms, and H/L work visa renewals.',
      keyPoints: [
        'Expedited processing for Interview Waiver (Dropbox) eligibility under revised 48-month expiration windows.',
        'Weekend interview drives launched at US Consulate General Mumbai and Hyderabad to clear backlogs.',
        'Students with issued I-20 forms eligible for dedicated expedited appointment requests within 60 days of course start.',
        'Immediate slot booking recommended as high-demand metropolitan dates fill rapidly.'
      ],
      affectedApplicants: [
        'Indian national B1/B2 travelers planning summer/autumn 2026 travel',
        'F-1 university admits for Fall 2026 intake',
        'H-1B and L-1 tech/corporate professionals renewing visas'
      ],
      recommendedAction: 'Contact Aspire Travels visa desk immediately to lock in preferred consulate slots and prepare compliant document dossiers.'
    },
    officialSource: 'U.S. Embassy & Consulates in India',
    impactLevel: 'High',
    isLiveHighlight: true
  },
  {
    id: 'us-h1b-uscis-beneficiary-rule',
    title: 'USCIS Modernizes H-1B Registration: Beneficiary-Centric Selection & Wage Integrity Rules',
    date: 'February 2026',
    isoDate: '2026-02-15',
    country: 'United States',
    countryCode: 'usa',
    flag: '🇺🇸',
    category: 'Work Visas',
    badge: 'USCIS RULE',
    badgeType: 'policy',
    summary: 'USCIS enforces passport-based unique beneficiary lottery selection to eliminate multiple-entry abuses and tightens specialized degree direct-nexus standards for specialty occupations.',
    fullContent: {
      overview: 'United States Citizenship and Immigration Services (USCIS) has codified strict beneficiary-centric lottery rules for the annual H-1B cap. Each candidate is entered once based on valid passport credentials regardless of how many petitions are submitted by distinct corporate entities, leveling the playing field for international professionals.',
      keyPoints: [
        'Single entry per beneficiary tied to government passport number prevents multiple lottery submission spam.',
        'Closer examination of LCA prevailing wage levels and direct educational nexus to job duties.',
        'Stricter site visits and Third-Party Client placement documentation requirements.',
        'Online filing portal optimizations for I-129 non-immigrant worker petitions.'
      ],
      affectedApplicants: [
        'Corporate employers & HR mobility teams',
        'International STEM graduates transitioning from F-1 OPT / STEM OPT',
        'Global technology and healthcare professionals'
      ],
      recommendedAction: 'Aspire Travels offers complete corporate sponsor compliance audits, LCA filings, and dual-intent consular interview briefs.'
    },
    officialSource: 'U.S. Citizenship and Immigration Services (USCIS)',
    impactLevel: 'High'
  },
  {
    id: 'canada-ircc-study-cap-pal-2026',
    title: 'Canada IRCC Implements 2026 International Student Intake Caps & Revised PGWP Language Rules',
    date: 'February 2026',
    isoDate: '2026-02-10',
    country: 'Canada',
    countryCode: 'canada',
    flag: '🇨🇦',
    category: 'Student Visas',
    badge: 'IRCC UPDATE',
    badgeType: 'policy',
    summary: 'IRCC confirms updated nationwide study permit allocation targets. Mandatory Provincial Attestation Letters (PAL) and Canadian Language Benchmark (CLB) requirements apply for PGWP graduates.',
    fullContent: {
      overview: 'Immigration, Refugees and Citizenship Canada (IRCC) has finalized its intake targets for international study permits. All post-secondary study permit applications require an official Provincial Attestation Letter (PAL) from the provincial government, alongside verified proof of increased settlement funds.',
      keyPoints: [
        'Nationwide cap on study permit approvals strictly distributed across provinces.',
        'Post-Graduation Work Permit (PGWP) eligibility now requires minimum CLB 7 for university graduates and CLB 5 for college graduates in prioritized labor shortage fields.',
        'Spousal Open Work Permits (SOWP) restricted primarily to spouses of master’s and doctoral degree candidates.',
        'Minimum cost-of-living financial threshold maintained at CAD $20,635 + first year tuition.'
      ],
      affectedApplicants: [
        'Undergraduate and diploma students targeting Canadian colleges and universities',
        'Graduates planning Post-Graduation Work Permit pathways',
        'Spouses of international students'
      ],
      recommendedAction: 'Ensure your institution has issued a valid PAL and that your financial affidavit matches IRCC automated pre-screening criteria.'
    },
    officialSource: 'Immigration, Refugees and Citizenship Canada (IRCC)',
    impactLevel: 'High'
  },
  {
    id: 'eu-schengen-ees-etias-rollout',
    title: 'EU Schengen Area: Automated Entry/Exit System (EES) & Digital Border Biometrics Expansion',
    date: 'January 2026',
    isoDate: '2026-01-28',
    country: 'Schengen Europe',
    countryCode: 'schengen',
    flag: '🇪🇺',
    category: 'Border & Digital',
    badge: 'BORDER TECH',
    badgeType: 'update',
    summary: 'Schengen 29 member states deploy automated digital Entry/Exit System (EES). Manual passport stamping replaced by digital biometric facial scans and fingerprint kiosks at all ports.',
    fullContent: {
      overview: 'The European Union has commenced full operation of the Entry/Exit System (EES) across all external Schengen land, sea, and air borders. The system electronically logs entry and exit dates, biometric photos, and fingerprints for all non-EU travelers, strictly monitoring the 90/180-day short-stay limitation.',
      keyPoints: [
        'Physical passport entry/exit stamps are completely phased out in favor of electronic biometric records.',
        'Automated tracking of the Schengen 90 days in any 180-day window prevents accidental overstays.',
        'Preparation for upcoming ETIAS (European Travel Information and Authorisation System) pre-travel authorization rollout.',
        'Mandatory minimum €30,000 Schengen-compliant travel medical insurance coverage strictly verified at entry.'
      ],
      affectedApplicants: [
        'All tourists, business travelers, and family visitors entering the 29 Schengen member states (France, Germany, Italy, Switzerland, Spain, etc.)',
        'Multiple-entry Schengen visa holders'
      ],
      recommendedAction: 'Verify that your Schengen visa covers the correct primary destination country and carries embassy-approved medical insurance with zero deductible.'
    },
    officialSource: 'European Commission - DG Migration & Home Affairs',
    impactLevel: 'Medium'
  },
  {
    id: 'uk-evisa-digital-transition',
    title: 'UK Home Office: 100% Transition from Physical BRP Cards to Digital eVisas for All Visitors & Residents',
    date: 'January 2026',
    isoDate: '2026-01-18',
    country: 'United Kingdom',
    countryCode: 'uk',
    flag: '🇬🇧',
    category: 'Border & Digital',
    badge: 'UKVI DIGITAL',
    badgeType: 'update',
    summary: 'UK Visas and Immigration (UKVI) has phased out physical Biometric Residence Permits (BRPs) and vignette stamps in favor of secure online UKVI accounts and digital share codes.',
    fullContent: {
      overview: 'The UK Home Office has completed its transition to a fully digital immigration system. Physical immigration documents such as Biometric Residence Permits (BRPs), Biometric Residence Cards (BRCs), and passport vignette wet-ink stamps have been replaced by online digital immigration status (eVisas).',
      keyPoints: [
        'All travelers with UK immigration status must register and link their valid current passport to a UKVI account.',
        'Airlines and border carriers perform automated API checks against UKVI digital records prior to flight boarding.',
        'Share codes generated in real-time through the UK government portal for proving right to work, study, or rent.',
        'Standard visitor visa processing timelines maintained at 3 to 6 weeks from biometric submission.'
      ],
      affectedApplicants: [
        'UK Standard Visitor visa holders',
        'Skilled Worker, Health & Care, and Global Business Mobility visa holders',
        'UK Student & Graduate route visa holders'
      ],
      recommendedAction: 'Aspire Travels assists clients with digital UKVI account setup, passport linking, and pre-departure share code validation.'
    },
    officialSource: 'UK Visas and Immigration (UKVI) / Home Office',
    impactLevel: 'Medium'
  },
  {
    id: 'australia-student-financial-reform',
    title: 'Australia Department of Home Affairs: Genuine Student (GS) Standard & Proof of Funds Update',
    date: 'January 2026',
    isoDate: '2026-01-08',
    country: 'Australia',
    countryCode: 'australia',
    flag: '🇦🇺',
    category: 'Student Visas',
    badge: 'HOME AFFAIRS',
    badgeType: 'policy',
    summary: 'Australia enforces the Genuine Student (GS) assessment framework for Subclass 500 visas, raising minimum living cost evidence to AUD $29,710 to ensure financial sufficiency.',
    fullContent: {
      overview: 'Australia’s Department of Home Affairs has updated student visa assessment guidelines. The Genuine Student (GS) criterion assesses economic circumstances in home country, value of the course to future career, and realistic career trajectories rather than speculative permanent residency intent.',
      keyPoints: [
        'Proof of financial capacity increased to AUD $29,710/year for primary applicant living expenses.',
        'Higher English language scores required: IELTS 6.0 minimum for standard university entry, IELTS 6.5 for postgraduate degrees.',
        'Strict verification of gap years, source of funds, and education loan sanction documentation.',
        'Subclass 600 Visitor visa fast-tracking available with biometrics completed within 72 hours of lodgement.'
      ],
      affectedApplicants: [
        'Subclass 500 Student visa applicants',
        'Subclass 600 Tourist & Business stream visitors',
        'Subclass 485 Temporary Graduate visa seekers'
      ],
      recommendedAction: 'Have your Statement of Purpose (SOP) and financial documentation pre-audited by Aspire Travels prior to ImmiAccount submission.'
    },
    officialSource: 'Australian Government - Department of Home Affairs',
    impactLevel: 'Medium'
  }
];
