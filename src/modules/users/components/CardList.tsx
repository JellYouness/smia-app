import React from 'react';
import { Box, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import JsonDataRenderer from './JsonDataRenderer';
import { Any } from '@common/defs/types';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface CardListProps {
  items: Any[] | string;
  renderCard: (item: Any, index: number) => React.ReactNode;
  fallback?: React.ReactNode;
}

const CardList: React.FC<CardListProps> = ({
  items,
  renderCard,
  fallback = (
    <Box
      sx={{
        p: 4,
        textAlign: 'center',
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'grey.50',
      }}
    >
      <InfoOutlinedIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
      <Typography variant="body2" color="text.secondary">
        No items to display.
      </Typography>
    </Box>
  ),
}) => {
  return (
    <JsonDataRenderer
      data={items}
      renderItem={(item, index) => <Box key={index}>{renderCard(item, index)}</Box>}
      fallback={fallback}
    />
  );
};

export default CardList;
