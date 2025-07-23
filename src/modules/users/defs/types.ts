import { CrudObject } from '@common/defs/types';
import { ROLE } from '@modules/permissions/defs/types';
import { Client } from '@modules/clients/defs/types';
// eslint-disable-next-line import/no-cycle
import { Creator } from '@modules/creators/defs/types';
import { Ambassador } from '@modules/ambassadors/defs/types';

export interface User extends CrudObject {
  email: string;
  rolesNames: ROLE[];
  permissionsNames: string[];
  firstName: string;
  lastName: string;
  username: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'DELETED';
  dateRegistered: string;
  userType?: 'CLIENT' | 'CREATOR' | 'AMBASSADOR' | 'ADMIN' | 'SUPERADMIN';
  twoFactorEnabled: boolean;
  acceptedTerms: boolean;
  emailVerified: boolean;
  emailVerifiedAt: string;
  twoFactorSecret: string;
  googleId: string;
  facebookId: string;
  // Relations avec les différents types d'utilisateurs
  creator?: Creator;
  client?: Client;
  ambassador?: Ambassador;
  systemAdministrator?: SystemAdministrator;
  profile: UserProfile;
}

export interface UserProfile extends CrudObject {
  id: number;
  userId: number;
  bio: string;
  shortBio: string;
  title: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  contactEmail: string;
  contactPhone: string;
  profilePicture: string;
  profileVisibility: 'PUBLIC' | 'PRIVATE' | 'TEAM_ONLY';
  profileCompleteness: number;
  lastUpdated: string;
  coverImage: string;
  displayName: string;
  notificationPreferences: {
    email: boolean;
    inApp: boolean;
  };
  // privacySettings: {
  //   profileVisibility: 'PUBLIC' | 'PRIVATE' | 'CONNECTIONS';
  //   showEmail: boolean;
  //   showPhone: boolean;
  //   showAddress: boolean;
  // };
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
  // preferences: any;
  audioIntroduction: string;
  createdAt: string;
  updatedAt: string;
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
