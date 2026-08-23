export interface Destination {
  id: string;
  name: string;
  flag?: string;
  code?: string;
  landmarkName?: string;
  landmarkImage?: string;
  category: string;
  tagline: string;
  description: string;
  lat: number;
  lon: number;
  popularVisas: string[];
  averageProcessingTime: string;
  successRate: string;
  financialProof: string;
  keyRequirements: string[];
  highlights: string[];
}

export interface VisaService {
  id: string;
  category: 'Leisure' | 'Corporate' | 'Education' | 'Residency' | 'Visitor' | 'Student' | 'Employment';
  title: string;
  shortDesc: string;
  fullDesc: string;
  processingTime: string;
  validity: string;
  estimatedFee: string;
  requiredDocuments: string[];
  eligibilityPoints: string[];
  popularDestinations: string[];
}

export interface CustomerReview {
  id: string;
  name: string;
  rating: number;
  review: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Documentation' | 'Processing' | 'Fees';
}

export interface Consultant {
  id: string;
  name: string;
  title: string;
  specialization: string;
  experienceYears: number;
  languages: string[];
  rating: number;
  avatar: string;
  availableDays: string[];
}

export interface UsaPortalState {
  visaService: 'Tourist & Business Visa' | 'Work Visa Appointments' | 'Student Visa Appointments' | 'J1 / J2 Visa Appointments';
  hasDs160Confirmation: 'yes' | 'no' | null;
  fullName: string;
  dateOfBirth: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  city: string;
  state: string;
  country: string;
  applicantsCount: number;
  intendedTravelPeriod?: string;
  notes?: string;
}

export interface CanadaPortalState {
  visaService: 'Business & Tourist Visa';
  travelPurpose: 'Tourism & Sightseeing' | 'Business Meetings & Conferences' | 'Visiting Family & Relatives' | 'Solo Exploration & Leisure';
  biometricsStatus: 'Valid (Given in last 10 years)' | 'Need New VFS Biometrics Appointment' | 'Unsure / First Time Applicant';
  travelHistory: 'Valid US Visa or Travel to US/UK/Schengen (CAN+ Eligible)' | 'Other International Travel' | 'Fresh Passport / First International Trip';
  employmentStatus: 'Salaried Professional' | 'Business Owner / Self-Employed' | 'Retired' | 'Student / Freelancer';
  fundsAvailability: '₹4,00,000 – ₹7,00,000' | '₹7,00,000 – ₹15,00,000' | '₹15,00,000+';
  fullName: string;
  dateOfBirth: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  city: string;
  state: string;
  country: string;
  applicantsCount: number;
  intendedTravelPeriod?: string;
  notes?: string;
}

export interface SchengenPortalState {
  primaryDestination: string;
  entryCountry: string;
  visaType: 'Tourist (Type C)' | 'Business & Trade Fair' | 'Visiting Family / Friends' | 'Cultural / Sports Event' | 'Airport Transit';
  entryType: 'Single Entry' | 'Double Entry' | 'Multiple Entry';
  travelDurationDays: number;
  intendedTravelDate: string;
  biometricVisStatus: 'Biometrics given within last 59 months (Waiver eligible)' | 'Need new VFS biometrics appointment' | 'First-time Schengen applicant';
  hasPreviousSchengen: 'Yes, in last 3 years' | 'Yes, older than 3 years' | 'No previous Schengen';
  validOtherVisas: string[];
  employmentStatus: 'Salaried Professional' | 'Self-Employed / Business Owner' | 'Freelancer / Consultant' | 'Student' | 'Retired' | 'Homemaker';
  monthlyIncome: string;
  bankBalance: string;
  hasItr: 'Yes, last 2-3 years ITR-V filed' | 'Form 16 / Salaried' | 'Not filed / Tax exempt';
  hasSponsor: 'Self-funded' | 'Fully Sponsored by Employer' | 'Sponsored by Family / Host in Europe';
  hasTravelInsurance: 'Yes, €30,000+ compliant' | 'Need Aspire assistance with insurance';
  fullName: string;
  passportNumber?: string;
  dateOfBirth: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  city: string;
  state: string;
  preferredVfsCity: string;
  adultsCount: number;
  childrenCount: number;
  infantsCount: number;
  notes?: string;
}

export interface AssessmentFormState {
  destinationId: string;
  visaCategory: string;
  hasDs160Confirmation?: 'yes' | 'no';
  nationality: string;
  passportValidityMonths: number;
  purpose: string;
  employmentStatus: string;
  hasPreviousRefusal: boolean;
  fundsAvailability: string;
  travelDate: string;
  fullName: string;
  email: string;
  phone: string;
}

