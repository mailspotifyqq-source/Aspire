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
  visaService: 'Business & Tourist Visa' | 'Visiting Family & Friends' | 'Business & Trade Fair' | 'Cultural & Sports Event';
  travelPurpose: 'Tourism & Sightseeing' | 'Business Meetings & Conferences' | 'Visiting Family & Relatives' | 'Solo Exploration & Leisure';
  primaryDestination: string;
  biometricsStatus: 'Valid VIS Biometrics (Given in last 59 months)' | 'Need New VFS Biometrics Appointment' | 'Unsure / First Time Applicant';
  travelHistory: 'Previous Schengen or US/UK/Canada Visa' | 'Other International Travel' | 'Fresh Passport / First International Trip';
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

