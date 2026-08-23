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

