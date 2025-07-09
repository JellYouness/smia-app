import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Any } from '@common/defs/types';

interface JsonDataRendererProps {
  data: string | Any[];
  renderItem: (item: Any, index: number) => React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

const JsonDataRenderer: React.FC<JsonDataRendererProps> = ({
  data,
  renderItem,
  fallback = <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2 }} />,
  errorFallback = <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2 }} />,
}) => {
  let parsedData: Any[] = [];

  try {
    if (data) {
      parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      parsedData = parsedData.map((item) =>
        typeof item === 'string' ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item
      );
    }
  } catch (error) {
    console.error('Error parsing JSON data:', error);
    return <>{errorFallback}</>;
  }

  return Array.isArray(parsedData) && parsedData.length > 0 ? (
    <>{parsedData.map(renderItem)}</>
  ) : (
    <>{fallback}</>
  );
};

export default JsonDataRenderer;
