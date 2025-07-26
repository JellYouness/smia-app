import { CrudObject } from '@common/defs/types';

export interface Ambassador extends CrudObject {
  userId: number;
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
  reviewNotes?: string;
  reviewedAt?: string;
  reviewedBy?: number;
}

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface RegionalExpertise {
  region: string;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
}
export interface FeaturedWork {
  projectId: number;
  description: string;
}

export interface TeamMember extends CrudObject {
  ambassadorId: number;
  userId: number;
  role?: string;
  isPrimary: boolean;
  joinedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
    profile?: {
      avatar?: string;
    };
  };
}
