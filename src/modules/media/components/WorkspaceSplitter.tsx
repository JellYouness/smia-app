import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import type { Theme } from '@mui/material/styles';

interface SplitterProps {
  side: 'left' | 'right';
  hidden: boolean;
  onDrag: (delta: number) => void;
}

export default function Splitter({ side, hidden, onDrag }: SplitterProps) {
  const [hover, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);
  const lastX = useRef(0);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) {
        return;
      }
      document.body.style.userSelect = 'none';
      document.body.style.pointerEvents = 'none';
      const delta = e.clientX - lastX.current;
      lastX.current = e.clientX;
      onDrag(delta);
    };

    const onMouseUp = () => {
      if (draggingRef.current) {
        draggingRef.current = false;
        setDragging(false);
        document.body.style.userSelect = '';
        document.body.style.pointerEvents = '';
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.userSelect = '';
      document.body.style.pointerEvents = '';
    };
  }, [onDrag]);

  const getStyles = (theme: Theme) => {
    const baseStyles = {
      width: 4,
      cursor: 'col-resize',
      zIndex: 10,
      height: '100%',
      position: 'relative' as const,
      transition: 'all 0.2s ease-in-out',
      background: 'transparent',
    };

    if (dragging) {
      return {
        ...baseStyles,
        background: `linear-gradient(90deg, 
          ${theme.palette.primary.main}20 0%, 
          ${theme.palette.primary.main}60 50%, 
          ${theme.palette.primary.main}20 100%)`,
        boxShadow: `0 0 20px ${theme.palette.primary.main}40`,
        transform: 'scaleX(1.5)',
      };
    }

    if (hover) {
      return {
        ...baseStyles,
        background: `linear-gradient(90deg, 
          ${theme.palette.primary.light}30 0%, 
          ${theme.palette.primary.light}50 50%, 
          ${theme.palette.primary.light}30 100%)`,
        boxShadow: `0 0 10px ${theme.palette.primary.light}30`,
        transform: 'scaleX(1.2)',
      };
    }

    return {
      ...baseStyles,
      background: `linear-gradient(90deg, 
        rgba(32, 101, 209, 0.08) 0%, 
        rgba(32, 101, 209, 0.15) 50%, 
        rgba(32, 101, 209, 0.08) 100%)`,
      backdropFilter: 'blur(10px)',
    };
  };

  if (hidden) {
    return null;
  }

  return (
    <Box
      sx={(theme) => getStyles(theme)}
      onMouseDown={(e) => {
        draggingRef.current = true;
        lastX.current = e.clientX;
        setDragging(true);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Grip indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 2,
          height: 20,
          background: dragging || hover ? 'rgba(32, 101, 209, 0.6)' : 'rgba(32, 101, 209, 0.2)',
          borderRadius: 1,
          transition: 'all 0.2s ease-in-out',
        }}
      />
    </Box>
  );
}
