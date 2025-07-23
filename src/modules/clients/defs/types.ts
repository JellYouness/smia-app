import { CrudObject } from '@common/defs/types';

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
  budget: Budget;
  preferredCreators: number[];
  projectCount: number;
  defaultProjectSettings: {
    timeline?: string;
    notificationFrequency?: number;
    communicationPreference?: string;
  };
}

export type Budget = 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
