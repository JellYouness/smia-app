import { Box } from '@mui/material';
import UpdatesPane from './UpdatesPane';
import BoardPane from './BoardPane';
import AssetsPane from './AssetsPane';
import PaneHeader from './PaneHeader';
import Splitter from './WorkspaceSplitter';
import { useEffect } from 'react';
import useWorkspaceLayout from '../hooks/useWorkspaceLayout';

interface ProjectWorkshopProps {
  projectId: number;
}

const ProjectWorkshop = ({ projectId }: ProjectWorkshopProps) => {
  const { layout, toggle, drag, HIDDEN } = useWorkspaceLayout(projectId);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.style.display = 'none';
    }

    return () => {
      const footer = document.querySelector('footer');
      if (footer) {
        footer.style.display = '';
      }
    };
  }, []);

  const getGridColumns = () => {
    const leftCol = layout.hideLeft ? `${HIDDEN}px` : `${layout.left}px`;
    const leftSplitter = layout.hideLeft ? '' : ' 4px';
    const rightSplitter = layout.hideRight ? '' : ' 4px';
    const rightCol = layout.hideRight ? `${HIDDEN}px` : `${layout.right}px`;

    return `${leftCol}${leftSplitter} 1fr${rightSplitter} ${rightCol}`;
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 64,
        left: 0,
        height: 'calc(100vh - 64px)',
        width: '100vw',
        display: 'grid',
        gridTemplateColumns: getGridColumns(),
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #F9FAFB 0%, #F2F4F8 25%, #E8F2FF 50%, #F9FAFB 100%)',
      }}
    >
      {/* Updates Pane */}
      <Box
        sx={{
          overflow: 'hidden',
          background:
            'linear-gradient(180deg, rgba(32, 101, 209, 0.02) 0%, rgba(32, 101, 209, 0.08) 100%)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid',
          borderColor: 'rgba(32, 101, 209, 0.12)',
          boxShadow: (theme) => `inset -1px 0 0 ${theme.palette.primary.lighter}`,
        }}
      >
        <PaneHeader title="Updates" hidden={layout.hideLeft} onToggle={() => toggle('left')} />
        {!layout.hideLeft && (
          <Box
            sx={{
              height: 'calc(100% - 60px)',
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px 0 0 0',
              boxShadow: (theme) => theme.customShadows.z4,
              margin: '8px 0 0 8px',
            }}
          >
            <UpdatesPane projectId={projectId} />
          </Box>
        )}
      </Box>

      {/* Left Splitter */}
      {!layout.hideLeft && <Splitter side="left" hidden={false} onDrag={(d) => drag('left', d)} />}

      {/* Board Pane - The Star of the Show */}
      <Box
        sx={{
          minWidth: 0,
          overflow: 'hidden',
          background:
            'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(32, 101, 209, 0.03) 50%, rgba(255, 255, 255, 0.95) 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 50% 50%, rgba(32, 101, 209, 0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          },
        }}
      >
        <PaneHeader title="Board" hidden={false} onToggle={() => {}} />
        <Box
          sx={{
            height: 'calc(100% - 60px)',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            boxShadow: (theme) => theme.customShadows.primary,
            margin: '8px',
            border: '1px solid',
            borderColor: 'rgba(32, 101, 209, 0.08)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <BoardPane projectId={projectId} />
        </Box>
      </Box>

      {/* Right Splitter */}
      {!layout.hideRight && (
        <Splitter side="right" hidden={false} onDrag={(d) => drag('right', d)} />
      )}

      {/* Assets Pane */}
      <Box
        sx={{
          overflow: 'hidden',
          background:
            'linear-gradient(180deg, rgba(118, 176, 241, 0.03) 0%, rgba(118, 176, 241, 0.12) 100%)',
          backdropFilter: 'blur(10px)',
          borderLeft: '1px solid',
          borderColor: 'rgba(118, 176, 241, 0.2)',
          boxShadow: (theme) => `inset 1px 0 0 ${theme.palette.primary.lighter}`,
        }}
      >
        <PaneHeader title="Files" hidden={layout.hideRight} onToggle={() => toggle('right')} />
        {!layout.hideRight && (
          <Box
            sx={{
              height: 'calc(100% - 60px)',
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '0 12px 0 0',
              boxShadow: (theme) => theme.customShadows.z8,
              margin: '8px 8px 0 0',
            }}
          >
            <AssetsPane />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProjectWorkshop;
