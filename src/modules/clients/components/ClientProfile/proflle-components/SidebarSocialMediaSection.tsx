import React from 'react';
import UserSocialMedia from '@common/components/UserSocialMedia';
import { Any } from '@common/defs/types';

interface SidebarSocialMediaSectionProps {
  user: Any;
  onEdit: () => void;
  readOnly?: boolean;
}

const SidebarSocialMediaSection = ({ user, onEdit, readOnly }: SidebarSocialMediaSectionProps) => {
  return (
    <UserSocialMedia
      socialMediaLinks={user?.profile?.socialMediaLinks || {}}
      onEdit={onEdit}
      editable={!readOnly}
    />
  );
};

export default SidebarSocialMediaSection;
