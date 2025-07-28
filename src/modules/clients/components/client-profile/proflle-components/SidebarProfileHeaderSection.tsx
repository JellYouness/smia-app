import React from 'react';
import UserProfileHeader from '@common/components/UserProfileHeader';
import { Any } from '@common/defs/types';

interface SidebarProfileHeaderSectionProps {
  user: Any;
  profilePicture: string | null;
  handleUploadPicture: (file: File) => Promise<void>;
  handleDeletePicture: () => Promise<void>;
  readOnly?: boolean;
}

const SidebarProfileHeaderSection = ({
  user,
  profilePicture,
  handleUploadPicture,
  handleDeletePicture,
  readOnly,
}: SidebarProfileHeaderSectionProps) => (
  <UserProfileHeader
    profilePicture={profilePicture}
    firstName={user?.firstName}
    lastName={user?.lastName}
    city={user?.profile?.city}
    country={user?.profile?.country}
    onUploadPicture={handleUploadPicture}
    onDeletePicture={handleDeletePicture}
    userRole="client"
    user={user}
    editable={!readOnly}
  />
);

export default SidebarProfileHeaderSection;
