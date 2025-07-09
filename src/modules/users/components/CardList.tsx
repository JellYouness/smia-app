import React from 'react';
import { Box, Card } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import JsonDataRenderer from './JsonDataRenderer';
import { Any } from '@common/defs/types';

interface CardListProps {
  items: Any[] | string;
  renderCard: (item: Any, index: number) => React.ReactNode;
  fallback?: React.ReactNode;
}

const CardList: React.FC<CardListProps> = ({
  items,
  renderCard,
  fallback = <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />,
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
