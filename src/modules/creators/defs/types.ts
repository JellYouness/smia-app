import { CrudObject } from '@common/defs/types';
// ignore circular dependency
// eslint-disable-next-line import/no-cycle
import { User } from '@modules/users/defs/types';

export interface Creator extends CrudObject {
  userId: number;
  skills: string[];
  verificationStatus: VerificationStatus;
  portfolio: PortfolioItem[];
  experience: number;
  hourlyRate: number;
  availability: AvailabilityStatus;
  averageRating: number;
  ratingCount: number;
  regionalExpertise: RegionalExpertise[];
  languages: Language[];
  isJournalist: boolean;
  mediaTypes: MediaType[];
  certifications: Certification[];
  equipmentInfo: EquipmentInfo;
  education: Education[];
  professionalBackground: ProfessionalBackground[];
  achievements: string[];
  reviewNotes?: string;
  reviewedAt?: string;
  reviewedBy?: number;
  user?: User;
}

export type MediaType = 'PHOTO' | 'VIDEO' | 'ARTICLE' | 'AUDIO' | 'DESIGN' | 'OTHER';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'FEATURED';
export type AvailabilityStatus = 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE' | 'BUSY';

export interface PortfolioItem {
  title: string;
  description: string;
  url: string;
}

export interface RegionalExpertise {
  region: string;
  expertiseLevel: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
}

export interface Language {
  language: string;
  proficiency: 'BASIC' | 'INTERMEDIATE' | 'FLUENT' | 'NATIVE';
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  year: string;
}

export interface ProfessionalBackground {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface EquipmentInfo {
  cameras: string[];
  lenses: string[];
  audio: string[];
  lighting: string[];
}

export interface FeaturedWork {
  projectId: number;
  description: string;
}
