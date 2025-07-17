import { CrudObject } from '@common/defs/types';
import { ROLE } from '@modules/permissions/defs/types';

export interface User extends CrudObject {
  email: string;
  rolesNames: ROLE[];
  permissionsNames: string[];
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  profilePicture: string;
  bio: string;
  title?: string;
  dateOfBirth: string;
  gender: string;
  preferredLanguage: string;
  timezone: string;
  userType?: 'CLIENT' | 'CREATOR' | 'AMBASSADOR' | 'ADMIN' | 'SUPERADMIN';
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacySettings: {
    profileVisibility: 'PUBLIC' | 'PRIVATE' | 'CONNECTIONS';
    showEmail: boolean;
    showPhone: boolean;
    showAddress: boolean;
  };
  socialMediaLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  preferences: {
    theme: 'LIGHT' | 'DARK' | 'SYSTEM';
    language: string;
    notifications: boolean;
  };
  // Relations avec les différents types d'utilisateurs
  creator?: Creator;
  client?: Client;
  ambassador?: Ambassador;
  systemAdministrator?: SystemAdministrator;
}

export interface AdminPermissions {
  manageUsers: boolean;
  manageProjects: boolean;
  manageMedia: boolean;
  manageDistribution: boolean;
  manageBilling: boolean;
  manageSupport: boolean;
  manageSystem: boolean;
}

export interface SystemAdministrator extends CrudObject {
  userId: number;
  accessLevel: AccessLevel;
  adminPermissions: AdminPermissions;
  departments: Department[];
  auditLog: boolean;
  lastPermissionUpdate: string;
  restrictedIpAccess: boolean;
  allowedIpAddresses: string[];
  emergencyContact: string;
  securityClearance: SecurityClearance;
}

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
}

export interface Ambassador extends CrudObject {
  userId: number;
  teamMembers: number[];
  teamName: string;
  specializations: string[];
  regionalExpertise: RegionalExpertise[];
  serviceOfferings: string[];
  clientCount: number;
  projectCapacity: number;
  applicationStatus: ApplicationStatus;
  applicationDate: string;
  verificationDocuments: string[];
  commissionRate: number;
  teamDescription: string;
  featuredWork: FeaturedWork[];
  yearsInBusiness: number;
  businessStreet: string;
  businessCity: string;
  businessState: string;
  businessPostalCode: string;
  businessCountry: string;
}

export type MediaType = 'PHOTO' | 'VIDEO' | 'ARTICLE' | 'AUDIO' | 'DESIGN' | 'OTHER';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'FEATURED';
export type AvailabilityStatus = 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE' | 'BUSY';
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type AccessLevel = 'STANDARD' | 'ELEVATED' | 'SUPER';
export type SecurityClearance = 'BASIC' | 'SENSITIVE' | 'CONFIDENTIAL';
export type Department =
  | 'USERS'
  | 'PROJECTS'
  | 'MEDIA'
  | 'DISTRIBUTION'
  | 'BILLING'
  | 'SUPPORT'
  | 'SYSTEM';

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

export interface BusinessAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Client extends CrudObject {
  userId: number;
  companyName: string;
  companySize: string;
  industry: string;
  websiteUrl: string;
  billingStreet: string;
  billingCity: string;
  billingState: string;
  billingPostalCode: string;
  billingCountry: string;
  taxIdentifier: string;
  budget: number;
  preferredCreators: number[];
  projectCount: number;
  defaultProjectSettings: {
    budget?: number;
    timeline?: string;
    requirements?: string;
  };
}
