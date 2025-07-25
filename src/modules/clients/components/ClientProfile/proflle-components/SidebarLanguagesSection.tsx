import React from 'react';
import UserLanguages from '@common/components/UserLanguages';

interface SidebarLanguagesSectionProps {
  languagesData: Array<{
    language: string;
    proficiency: string;
  }>;
  onEdit: () => void;
  readOnly?: boolean;
}

const SidebarLanguagesSection = ({
  languagesData,
  onEdit,
  readOnly,
}: SidebarLanguagesSectionProps) => {
  return <UserLanguages languages={languagesData} onEdit={onEdit} editable={!readOnly} />;
};

export default SidebarLanguagesSection;
