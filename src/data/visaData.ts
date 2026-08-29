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
    financialProof: '₹4,00,000 – ₹20,00,000 liquid funds',
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
    landmarkName: 'CN Tower, Toronto',
    landmarkImage: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=1200&q=85',
    category: 'Tourism & Business',
    tagline: 'End-to-End Filing for Canada Business & Tourist Visas (TRV)',
    description: 'Specialized visa guidance for Canada Visitor Visas (Temporary Resident Visa / TRV), CAN+ fast-track pre-screening, business conference delegations, and VFS biometrics coordination.',
    lat: 56.1304,
    lon: -106.3468,
    popularVisas: ['Business & Tourist Visa'],
    averageProcessingTime: '2 – 6 Weeks',
    successRate: '99.0%',
    financialProof: '₹4,00,000 – ₹10,00,000 liquid savings',
    keyRequirements: [
      'Valid Passport with at least 6 months validity',
      'Financial solvency proof (6 months stamped bank statements & ITR)',
      'Detailed travel itinerary or Canadian business invitation letter',
      'VFS Biometric enrollment & strong ties to home country'
    ],
    highlights: ['Multiple-Entry 10-Year TRV', 'CAN+ Expedited Processing', 'Tourism & Business Delegations']
  },
  {
    id: 'europe',
    name: 'Europe (Schengen)',
    flag: '🇪🇺',
    code: 'EU',
    landmarkName: 'Eiffel Tower',
    landmarkImage: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
    category: 'Tourism & Business',
    tagline: '29 Countries, One Seamless Visa for Travel, Culture & Business',
    description: 'Explore Switzerland, France, Germany, Italy, Spain, and all 29 Schengen nations with single or multi-entry tourist and short-stay business visitor visas (Type C).',
    lat: 48.8566,
    lon: 2.3522,
    popularVisas: ['Business & Tourist Visa'],
    averageProcessingTime: '15 – 30 Days',
    successRate: '98.2%',
    financialProof: '₹4,000 – ₹10,000 per day of stay minimum balance',
    keyRequirements: [
      'Travel Health Insurance covering minimum €30,000 across Schengen',
      'Confirmed flight itinerary and hotel bookings / invitation letter',
      '3-6 Months bank statements stamped by banking institution',
      'Detailed day-by-day travel itinerary or business conference invite'
    ],
    highlights: ['Access to 29 European Nations', 'Tourist & Business Short-Stay', 'Flexible Multi-Entry Visas']
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    code: 'GB',
    landmarkName: 'Big Ben',
    landmarkImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    category: 'Tourism & Business',
    tagline: 'Standard Visitor Visa Guidance for Sightseeing, Business & Family Visits',
    description: 'Comprehensive consular filing for UK Standard Visitor Visas (6-month, 2-year, 5-year, and 10-year multi-entry) for tourism, holidays, corporate meetings, and visiting relatives.',
    lat: 51.5074,
    lon: -0.1278,
    popularVisas: ['Business & Tourist Visa'],
    averageProcessingTime: '3 – 5 Weeks (Priority Available)',
    successRate: '98.9%',
    financialProof: '₹2,50,000 – ₹6,50,000 maintenance balance',
    keyRequirements: [
      'Valid Passport with at least 6 months validity',
      'Employment leave NOC or Business ownership proof',
      '6 Months original stamped bank statements & 2 years ITR',
      'Travel itinerary or UK business invitation letter'
    ],
    highlights: ['6-Month to 10-Year Multi-Entry', 'Fast-Track Priority Processing', 'Tourism & Corporate Delegations']
  },
  {
    id: 'singapore',
    name: 'Singapore',
    flag: '🇸🇬',
    code: 'SG',
    landmarkName: 'Marina Bay Sands',
    landmarkImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    category: 'Tourism & Business',
    tagline: 'Premier Asian Gateway for Leisure, Conferences & Corporate Travel',
    description: 'Effortless visa facilitation for Singapore tourist eVisas, short-term business visit passes, corporate delegations, trade exhibitions, and international conferences.',
    lat: 1.3521,
    lon: 103.8198,
    popularVisas: ['Business & Tourist Visa'],
    averageProcessingTime: '3 – 7 Days',
    successRate: '99.4%',
    financialProof: '₹1,50,000 – ₹3,50,000 liquid funds',
    keyRequirements: [
      'Valid Passport with minimum 6 months validity',
      'Form 14A duly completed with passport-size photograph',
      'Confirmed return flight tickets and hotel reservations',
      '3 Months bank statements and employment proof / company letter'
    ],
    highlights: ['Fast eVisa Digital Turnaround', 'Business & Conference Delegations', 'Top Global Tourism Destination']
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    code: 'AU',
    landmarkName: 'Sydney Opera House',
    landmarkImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    category: 'Tourism & Business',
    tagline: 'Subclass 600 Visitor & Business Visas for Seamless Travel Down Under',
    description: 'Expert filing and documentation for Australian Subclass 600 Visitor Visas (Tourist stream and Business Visitor stream) with fast turnaround times.',
    lat: -25.2744,
    lon: 133.7751,
    popularVisas: ['Business & Tourist Visa'],
    averageProcessingTime: '2 – 4 Weeks',
    successRate: '99.1%',
    financialProof: '₹3,00,000 – ₹7,00,000 liquid funds',
    keyRequirements: [
      'Genuine Temporary Entrant (GTE) statement & intent to return',
      '6 Months stamped bank statements & 3 years ITR',
      'Employment proof with approved leave or business registration',
      'Clean background & health character declarations'
    ],
    highlights: ['Subclass 600 Fast-Track', '1 to 3 Year Multi-Entry Available', 'Tourism & Business Conferences']
  },
  {
    id: 'asia',
    name: 'Asia',
    flag: '🇯🇵',
    code: 'JP',
    landmarkName: 'Mount Fuji',
    landmarkImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    category: 'Tourism & Business',
    tagline: 'Vibrant Tourism, Cultural Exploration & High-Tech Business Hubs',
    description: 'Comprehensive tourist and business visa assistance for Japan, South Korea, UAE, and East Asian destinations with seamless eVisa and consular handling.',
    lat: 35.6762,
    lon: 139.6503,
    popularVisas: ['Business & Tourist Visa'],
    averageProcessingTime: '5 – 14 Days',
    successRate: '99.3%',
    financialProof: '₹2,50,000 – ₹8,00,000 bank balance',
    keyRequirements: [
      'Cover letter outlining detailed travel schedule',
      'Income Tax Returns (ITR) for last 2 years',
      'Round-trip confirmed flight reservations',
      'Valid passport with at least 2 blank pages'
    ],
    highlights: ['Fast eVisa Digital Turnaround', 'Dynamic Global Tourism Destinations', 'Business & Trade Delegate Visas']
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
    estimatedFee: '₹15,540',
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
    shortDesc: 'Priority student and dependent appointment booking and SEVIS/I-20 verification.',
    fullDesc: 'Dedicated consular scheduling for academic scholars (F-1) and dependents (F-2), with Form I-20 compliance review and consular advisory.',
    processingTime: '2 to 6 Weeks',
    validity: 'Duration of Status (D/S)',
    estimatedFee: '₹15,540',
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
    estimatedFee: '₹17,220',
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
    estimatedFee: '₹17,220',
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


