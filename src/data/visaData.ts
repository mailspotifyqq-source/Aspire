import { Destination, VisaService, FAQItem, Consultant, CustomerReview } from '../types';

const PRIMARY_DOCUMENTS = [
  'DS-160 confirmation',
  'Invitation letter',
  'Passport-size photo',
  'Valid international passport (6+ months validity)',
  'Leave approval',
  'NOC',
  'Employment letter'
];
export const DESTINATIONS: Destination[] = [
  {
    id: 'usa',
    name: 'USA',
    flag: '🇺🇸',
    code: 'US',
    landmarkName: 'Statue of Liberty',
    landmarkImage: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80',
    category: 'Work & Study',
    tagline: 'Global Hub for Innovation, Higher Education & Enterprise',
    description: 'From B1/B2 tourism and F-1 student visas to H-1B, L-1 intracompany transfers, and O-1 extraordinary ability petitions, our US immigration specialists guide your petition through USCIS and consular processing.',
    lat: 37.0902,
    lon: -95.7129,
    popularVisas: ['B1/B2 Visitor Visa', 'F1/F2 Visa Appointments', 'H1B/H4 Visa Appointments', 'L1/L2 Visa Appointments'],
    averageProcessingTime: '3 – 8 Weeks (Interview Wait times vary)',
    successRate: '98.6%',
    financialProof: '$5,000 – $25,000 depending on category',
    keyRequirements: [
      'Valid Passport with at least 6 months validity beyond intended stay',
      'DS-160 Confirmation Page & Barcode',
      'Proof of financial solvency (Bank statements, I-20 or I-797)',
      'Ties to home country and genuine temporary intent documentation'
    ],
    highlights: ['Top 50 Global Universities', 'Silicon Valley Tech Careers', 'Multinational Corporate Headquarters']
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    code: 'CA',
    landmarkName: 'CN Tower',
    landmarkImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    category: 'Immigration & Study',
    tagline: 'World-Class Education, Express Entry PR & Global Talent Stream',
    description: 'Specialized visa guidance for Canada Visitor Visas (TRV), Study Permits with PGWP work pathways, LMIA Work Permits, and Express Entry (FSW/CEC) permanent residency.',
    lat: 56.1304,
    lon: -106.3468,
    popularVisas: ['Visitor Visa (TRV / Super Visa)', 'Study Permit with PGWP', 'Express Entry (CRS PR)', 'Global Talent Stream Work Permit'],
    averageProcessingTime: '2 – 6 Weeks',
    successRate: '99.0%',
    financialProof: 'CAD $10,000 – $20,635 annual cost of living',
    keyRequirements: [
      'Letter of Acceptance (DLI) or Job Offer / Proof of Funds',
      'Language proficiency (IELTS General / Academic or CELPIP)',
      'Biometrics & Police Character Clearances',
      'Ties to country of residence'
    ],
    highlights: ['Post-Graduation Work Permits (PGWP)', 'Fast-Track PR via Express Entry', 'Welcoming Multicultural Cities']
  },
  {
    id: 'europe',
    name: 'Europe (Schengen)',
    flag: '🇪🇺',
    code: 'EU',
    landmarkName: 'Eiffel Tower',
    landmarkImage: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
    category: 'Schengen & Work',
    tagline: '29 Countries, One Seamless Visa for Travel, Culture & Business',
    description: 'Explore the Schengen Zone with single or multi-entry tourist visas, national long-stay D-visas, the EU Blue Card for skilled experts, and European Golden Visa residency programs.',
    lat: 48.8566,
    lon: 2.3522,
    popularVisas: ['Schengen Short-Stay (Type C)', 'EU Blue Card', 'National Study Visa (Type D)', 'Portugal D7 / Golden Visa', 'Germany Job Seeker / Opportunity Card'],
    averageProcessingTime: '15 – 30 Days',
    successRate: '98.2%',
    financialProof: '€45 – €120 per day of stay minimum balance',
    keyRequirements: [
      'Travel Health Insurance covering minimum €30,000 across Schengen',
      'Confirmed flight itinerary and hotel bookings / invitation letter',
      '3-6 Months bank statements stamped by banking institution',
      'Detailed day-by-day travel itinerary or employment contract'
    ],
    highlights: ['Access to 29 European Nations', 'Rich Cultural & Historic Heritage', 'Flexible Multi-Entry 1-5 Year Visas']
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    code: 'GB',
    landmarkName: 'Big Ben',
    landmarkImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    category: 'Work & Tourism',
    tagline: 'Global Financial Hub, Prestigious Universities & Skilled Worker Visas',
    description: 'Comprehensive visa filing for UK Standard Visitor (6-month & 2/5/10-year multi-entry), Student Route (CAS), Skilled Worker Visa (CoS), and Global Talent endorsement.',
    lat: 51.5074,
    lon: -0.1278,
    popularVisas: ['UK Standard Visitor Visa', 'Skilled Worker Visa (Tier 2)', 'Student Visa (CAS)', 'Global Talent Visa', 'Youth Mobility Scheme'],
    averageProcessingTime: '3 – 5 Weeks (Priority Available)',
    successRate: '98.9%',
    financialProof: '£1,270 – £9,207 Maintenance Requirement',
    keyRequirements: [
      'TB Test certificate (where applicable)',
      'Certificate of Sponsorship (CoS) or University CAS',
      'Proof of financial maintenance and accommodation',
      'Certified English proficiency (SELT / IELTS)'
    ],
    highlights: ['London Financial Ecosystem', '2-Year Graduate Route Work Rights', 'Fast-Track Priority Consular Processing']
  },
  {
    id: 'singapore',
    name: 'Singapore',
    flag: '🇸🇬',
    code: 'SG',
    landmarkName: 'Marina Bay Sands',
    landmarkImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    category: 'Business & Tech',
    tagline: 'Asia’s Financial Capital & Premier Gateway for Tech Talent',
    description: 'Singapore attracts elite professionals and founders with the Employment Pass (COMPASS framework), Tech.Pass, ONE Pass (Overseas Networks & Expertise), and seamless business visit passes.',
    lat: 1.3521,
    lon: 103.8198,
    popularVisas: ['Employment Pass (EP)', 'Tech.Pass / ONE Pass', 'EntrePass', 'Short-Term Business Visit Pass', 'Student Pass'],
    averageProcessingTime: '1 – 3 Weeks',
    successRate: '99.4%',
    financialProof: 'Fixed monthly salary criteria (SGD $5,000+ for EP)',
    keyRequirements: [
      'MOM COMPASS point verification score sheet',
      'Verified degree credentials from accredited universities',
      'Letter of Offer or corporate sponsorship documentation',
      'Clean background verification and employer tax clearances'
    ],
    highlights: ['Zero Capital Gains Tax', 'Tier-1 Asian Business Hub', 'Fastest Processing Timelines Worldwide']
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    code: 'AU',
    landmarkName: 'Sydney Opera House',
    landmarkImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    category: 'Skilled & Family',
    tagline: 'High Standard of Living, World-Class Universities & Points-Based PR',
    description: 'Australia offers lucrative skilled migration pathways (Subclass 189, 190, 491), visitor visas (Subclass 600), and top-tier university study permits (Subclass 500) with generous post-study work rights.',
    lat: -25.2744,
    lon: 133.7751,
    popularVisas: ['Subclass 600 (Visitor)', 'Subclass 500 (Student)', 'Subclass 189/190 (Skilled Independent PR)', 'Subclass 482 (TSS Work Visa)'],
    averageProcessingTime: '2 – 6 Weeks',
    successRate: '99.1%',
    financialProof: 'AUD $5,000 – $24,505 (Annual living requirement)',
    keyRequirements: [
      'GTE / Genuine Student Requirement statement',
      'Skills Assessment certification (for skilled PR pathways)',
      'Health & Character police clearances',
      'Proof of funds and English language test scores (IELTS / PTE)'
    ],
    highlights: ['Points-Based PR Pathway', '2-4 Year Post-Study Work Visas', 'Universal Healthcare & Exceptional Lifestyle']
  },
  {
    id: 'asia',
    name: 'Asia',
    flag: '🇯🇵',
    code: 'JP',
    landmarkName: 'Mount Fuji',
    landmarkImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    category: 'Tourism & Work',
    tagline: 'Vibrant Economies, Ancient Traditions & High-Tech Opportunities',
    description: 'Comprehensive visa processing for Japan, South Korea, UAE, and East Asian powerhouses. Specializing in tourist eVisa, Highly Skilled Professional (HSP) visas, and business delegate entry.',
    lat: 35.6762,
    lon: 139.6503,
    popularVisas: ['Japan Tourist & eVisa', 'Japan Highly Skilled Professional', 'South Korea C-3 / D-2', 'UAE Golden Visa / Green Visa', 'UK Standard Visitor & Skilled Worker'],
    averageProcessingTime: '5 – 14 Days',
    successRate: '99.3%',
    financialProof: '$3,000 – $10,000 bank balance',
    keyRequirements: [
      'Cover letter outlining detailed travel schedule',
      'Income Tax Returns (ITR) for last 2 years',
      'Round-trip confirmed flight reservations',
      'Valid passport with at least 2 blank pages'
    ],
    highlights: ['Fast eVisa Digital Turnaround', 'Dynamic Global Tourism Destinations', 'Booming Tech & Engineering Markets']
  }
];

export const VISA_SERVICES: VisaService[] = [
  {
    id: 'b1-b2',
    category: 'Visitor',
    title: 'B1/B2 Visitor Visa',
    shortDesc: 'Tourism, family visits, business travel, and expedited appointment scheduling.',
    fullDesc: 'End-to-end guidance, DS-160 document audit, and consular appointment scheduling for US visitor, tourism, and business travel.',
    processingTime: '5 to 20 Business Days',
    validity: 'Up to 10 Years',
    estimatedFee: '$185',
    requiredDocuments: PRIMARY_DOCUMENTS,
    eligibilityPoints: [
      'Sufficient verifiable funds for duration of travel',
      'Strong socio-economic ties to home country',
      'No prior immigration violations or active bans',
      'Clear criminal background'
    ],
    popularDestinations: ['USA (B1/B2)']
  },
  {
    id: 'f1-f2',
    category: 'Student',
    title: 'F1/F2 Visa Appointments',
    shortDesc: 'Priority student and dependent appointment booking, SEVIS/I-20 verification, and mock interviews.',
    fullDesc: 'Dedicated consular scheduling for academic scholars (F-1) and dependents (F-2), with Form I-20 compliance review and personalized consular interview coaching.',
    processingTime: '2 to 6 Weeks',
    validity: 'Duration of Status (D/S)',
    estimatedFee: '$185',
    requiredDocuments: PRIMARY_DOCUMENTS,
    eligibilityPoints: [
      'Valid Form I-20 issued by SEVP-certified institution',
      'Proof of SEVIS I-901 fee payment',
      'Verifiable liquid funding for tuition and living expenses',
      'Intent to depart the U.S. upon completion of studies'
    ],
    popularDestinations: ['USA (F-1 / F-2)']
  },
  {
    id: 'h1b-h4',
    category: 'Employment',
    title: 'H1B/H4 Visa Appointments',
    shortDesc: 'Fast-track consular interview booking and Form I-797 review for specialty professionals and families.',
    fullDesc: 'Consular interview scheduling and document verification for approved Form I-797 petition holders (H-1B) and dependent spouses/children (H-4).',
    processingTime: '3 to 8 Weeks',
    validity: 'Up to 3 Years (Renewable)',
    estimatedFee: '$205',
    requiredDocuments: PRIMARY_DOCUMENTS,
    eligibilityPoints: [
      'Approved USCIS Form I-797 Notice of Action',
      'Valid employer sponsorship documentation',
      'Academic credentials matching job requirements',
      'Clean immigration and background record'
    ],
    popularDestinations: ['USA (H-1B / H-4)']
  },
  {
    id: 'l1-l2',
    category: 'Corporate',
    title: 'L1/L2 Visa Appointments',
    shortDesc: 'Intra-company managerial and executive transfer appointments and dependent processing.',
    fullDesc: 'Priority appointment scheduling for intracompany transferees (L-1A managers/executives, L-1B specialized knowledge) and dependents (L-2), supporting blanket and individual petitions.',
    processingTime: '3 to 8 Weeks',
    validity: '1 to 5 Years (Renewable)',
    estimatedFee: '$205',
    requiredDocuments: PRIMARY_DOCUMENTS,
    eligibilityPoints: [
      'Approved Form I-797 or Blanket L Petition (Form I-129S)',
      'Continuous employment with qualifying overseas entity for at least 1 year',
      'Executive, managerial, or specialized knowledge capacity',
      'Valid corporate sponsorship documentation'
    ],
    popularDestinations: ['USA (L-1 / L-2)']
  }
];
export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'kunal-kalyanpur',
    name: 'Kunal Kalyanpur',
    rating: 5,
    review: 'I recently applied for my US Visa renewal as my visa was about to expire. I was looking for a trustworthy and dependable source through whom I could quickly get my visa renewed. I was referred to Aspire Travel Team through one of my close ...'
  },
  {
    id: 'shobhit-kumar-prasad',
    name: 'Shobhit Kumar Prasad',
    rating: 5,
    review: 'Thanks to Aspire Visa Placement for helping me get a timely visa appointment date. The process was smooth, and Mr Sandeep was supportive and responsive throughout. Really appreciate their efforts and professionalism. Would definitely recommend them to others looking for visa appointment assistance.'
  },
  {
    id: 'nishant-patro',
    name: 'Nishant Patro',
    rating: 5,
    review: 'You are in good hands. Good service, easy to reach out and for me they did better then commitment.'
  },
  {
    id: 'sachin-acharya',
    name: 'Sachin Acharya',
    rating: 5,
    review: 'Very professional service. It was an easy coordination and the team was diligent.'
  },
  {
    id: 'harish-iyer',
    name: 'Harish Iyer',
    rating: 5,
    review: 'I recently interacted with Aspire for my Visa and am delighted with my experience. They are very professional, responsive and deliver on their assurance. I had approached them for my Visa at a critical stage since the entire family was ...'
  },
  {
    id: 'pawandeep-bindra',
    name: 'Pawandeep Bindra',
    rating: 5,
    review: 'We had an absolutely fantastic experience with Sandeep (Aspire Travels). He went above and beyond to secure our USA appointment on an incredibly fast-track basis. His professionalism, efficiency, and deep knowledge of the process made ...'
  },
  {
    id: 'sunny-sharan',
    name: 'Sunny Sharan',
    rating: 5,
    review: 'Sandeep is helpful and will guide on each step. Great help.'
  },
  {
    id: 'ankush-tayal',
    name: 'Ankush Tayal',
    rating: 5,
    review: 'Reached out to Aspire folks when my visa application was stuck due to previous agent I had engaged. Sandeep helped me getting the issue resolve and get me visa slot in 6 days. He was transparent and supportive during entire process. Thanks team.'
  },
  {
    id: 'meenakshi-badlani',
    name: 'Meenakshi Badlani',
    rating: 5,
    review: 'I had an urgency to get the disappointment for USA and Sandeep ji was recommended by a friend. Aspire is extremely professional supportive and knows the job quite well. Extremely reliable and honest to work with.'
  },
  {
    id: 'anshuman-rudra',
    name: 'Anshuman Rudra',
    rating: 5,
    review: 'I had to travel for an medical urgency back home and was refereed by a Friend to connect with Aspire consultant. The anxiety to travel with no confirmed appointment in the current administration is worse.Thank you Sandeep for helping me get visa counselor appt. on a short notice.'
  },
  {
    id: 'lokesh-chauhan',
    name: 'Lokesh Chauhan',
    rating: 5,
    review: "In a market full of deceits they're a really legit and authentic consultancy with good results. Their most redeeming quality is they don't keep ..."
  }
];

export const CONSULTANTS: Consultant[] = [
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins, Esq.',
    title: 'Senior Immigration Attorney & US Practice Lead',
    specialization: 'US Business, Employment & Extraordinary Ability (O-1, H-1B, L-1)',
    experienceYears: 14,
    languages: ['English', 'French'],
    rating: 4.98,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  },
  {
    id: 'marcus-vance',
    name: 'Marcus Vance, MARA #180429',
    title: 'Registered Migration Agent & Oceania Lead',
    specialization: 'Australia & New Zealand Skilled Migration & Student Pathways',
    experienceYears: 12,
    languages: ['English', 'German'],
    rating: 4.96,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    availableDays: ['Mon', 'Wed', 'Thu', 'Sat']
  },
  {
    id: 'aisha-tan',
    name: 'Aisha Tan',
    title: 'Executive Director of APAC & European Mobility',
    specialization: 'Singapore MOM COMPASS, Schengen Visas, Global Investor Golden Visas',
    experienceYears: 10,
    languages: ['English', 'Mandarin', 'Malay'],
    rating: 4.99,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    availableDays: ['Tue', 'Wed', 'Fri', 'Sat']
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I know which visa category is right for my profile?',
    answer: 'Our proprietary assessment matches your travel purpose, duration of stay, educational credentials, and employment background against strict consular requirements. You can take our instant 2-minute Visa Assessment on this page or book a 1-on-1 discovery consultation with our accredited immigration specialists.',
    category: 'General'
  },
  {
    id: 'faq-2',
    question: 'What is your historical visa approval rate?',
    answer: 'Aspire Travels maintains an audited 98.8% approval rate across over 8,000 successfully processed applications. We achieve this by conducting rigorous pre-submission quality audits—ensuring zero missing clauses, financial discrepancies, or ambiguous cover letters.',
    category: 'General'
  },
  {
    id: 'faq-3',
    question: 'What documents are mandatory for a standard tourist or business visa?',
    answer: 'Core requirements include a valid passport with at least 6 months remaining validity, stamped bank statements verifying sufficient liquid balance, proof of employment or business ownership, confirmed travel bookings, and a bespoke cover letter articulating clear intent to return.',
    category: 'Documentation'
  },
  {
    id: 'faq-4',
    question: 'How long before my planned travel date should I apply?',
    answer: 'We strongly recommend starting the application process 6 to 12 weeks before your intended departure date. While many e-visas process in 5–10 business days, consular interview appointments (especially for the US and certain Schengen embassies) require advance booking.',
    category: 'Processing'
  },
  {
    id: 'faq-5',
    question: 'What happens if an application previously received a refusal or rejection?',
    answer: 'A previous visa refusal does NOT mean you cannot be approved in the future. We specialize in refusal remedy cases—analyzing the specific refusal clause, repairing the evidential deficit, drafting formal legal clarification briefs, and re-filing with confidence.',
    category: 'Documentation'
  },
  {
    id: 'faq-6',
    question: 'Are government embassy fees included in your service consultation packages?',
    answer: 'Our service quotes clearly distinguish between professional consultancy & legal filing fees and direct government statutory embassy fees. Embassy fees are paid directly to the respective consulate or visa application center (e.g., VFS / TLScontact / CGI Federal) with full transparent receipts.',
    category: 'Fees'
  }
];


