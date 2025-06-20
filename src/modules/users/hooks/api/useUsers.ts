import ApiRoutes from '@common/defs/api-routes';
import { ROLE } from '@modules/permissions/defs/types';
import { User } from '@modules/users/defs/types';
import useItems, { UseItems, UseItemsOptions, defaultOptions } from '@common/hooks/useItems';

export interface CreateOneInput {
  email: string;
  password: string;
  role: ROLE;
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  profilePicture?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: string;
  preferredLanguage?: string;
  timezone?: string;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacySettings?: {
    profileVisibility: 'PUBLIC' | 'PRIVATE' | 'CONNECTIONS';
    showEmail: boolean;
    showPhone: boolean;
    showAddress: boolean;
  };
  socialMediaLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  preferences?: {
    theme: 'LIGHT' | 'DARK' | 'SYSTEM';
    language: string;
    notifications: boolean;
  };
}

export interface UpdateOneInput {
  email?: string;
  password?: string;
  role?: ROLE;
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  profilePicture?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: string;
  preferredLanguage?: string;
  timezone?: string;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacySettings?: {
    profileVisibility: 'PUBLIC' | 'PRIVATE' | 'CONNECTIONS';
    showEmail: boolean;
    showPhone: boolean;
    showAddress: boolean;
  };
  socialMediaLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  preferences?: {
    theme: 'LIGHT' | 'DARK' | 'SYSTEM';
    language: string;
    notifications: boolean;
  };
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

const useUsers: UseItems<User, CreateOneInput, UpdateOneInput> = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Users;
  const useItemsHook = useItems<User, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  return useItemsHook;
};

export default useUsers;
