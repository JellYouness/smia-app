import React from 'react';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import { Edit } from '@mui/icons-material';
import Link from 'next/link';

interface SectionCardProps {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
  editLink?: string;
  readOnly?: boolean;
  titleSize?: 'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1';
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  onEdit,
  children,
  editLink,
  readOnly,
  titleSize = 'h4',
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: 3,
        // mb: 3,
        position: 'relative',
        borderBottom: `2px solid ${theme.palette.divider}`,
        //  borderRadius: 2, border: '1px solid #e0e0e0'
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Typography
          variant={titleSize}
          sx={{
            fontWeight: 600,
            flexGrow: 1,
          }}
        >
          <span
            style={
              {
                // borderBottom: `1px solid ${theme.palette.primary.main}`,
                // paddingBottom: '2px',
              }
            }
          >
            {title}
          </span>
        </Typography>
        {!readOnly && (
          <>
            {editLink ? (
              <IconButton component={Link} href={editLink} aria-label={`Edit ${title}`}>
                <Edit
                  color="primary"
                  fontSize="large"
                  sx={{
                    border: '1px solid',
                    borderColor: 'primary.main',
                    borderRadius: '50%',
                    p: 1,
                  }}
                />
              </IconButton>
            ) : (
              <IconButton onClick={onEdit} aria-label={`Edit ${title}`}>
                <Edit
                  color="primary"
                  fontSize="large"
                  sx={{
                    border: '1px solid',
                    borderColor: 'primary.main',
                    borderRadius: '50%',
                    p: 1,
                  }}
                />
              </IconButton>
            )}
          </>
        )}
      </Box>
      {children}
    </Box>
  );
};

export default SectionCard;
