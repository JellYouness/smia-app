import { useState, useEffect, useRef } from 'react';

const MIN_SIDEBAR = 240;
const MAX_SIDEBAR = 600;
const HIDDEN_WIDTH = 40;
const DEFAULT_LAYOUT = { left: 300, right: 300, hideLeft: false, hideRight: false };

const getKey = (projectId: number) => `workspace-layout:${projectId}`;

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

const useWorkspaceLayout = (projectId: number) => {
  const [layout, setLayout] = useState(DEFAULT_LAYOUT);
  const layoutRef = useRef(DEFAULT_LAYOUT);
  const key = getKey(projectId);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    const newLayout = { ...DEFAULT_LAYOUT, ...saved };
    setLayout(newLayout);
    layoutRef.current = newLayout;
  }, [projectId, key]);

  // Update ref when layout changes
  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  const save = (newLayout: typeof DEFAULT_LAYOUT) => {
    setLayout(newLayout);
    layoutRef.current = newLayout;
    localStorage.setItem(key, JSON.stringify(newLayout));
  };

  const toggle = (side: 'left' | 'right') => {
    const newLayout = { ...layout };
    if (side === 'left') {
      if (newLayout.hideLeft) {
        // Show the pane with a reasonable width
        newLayout.hideLeft = false;
        newLayout.left = 300;
      } else {
        // Hide the pane
        newLayout.hideLeft = true;
      }
    } else if (newLayout.hideRight) {
      // Show the pane with a reasonable width
      newLayout.hideRight = false;
      newLayout.right = 300;
    } else {
      // Hide the pane
      newLayout.hideRight = true;
    }
    save(newLayout);
  };

  const drag = (side: 'left' | 'right', delta: number) => {
    const currentLayout = layoutRef.current;
    const { left, right, hideLeft, hideRight } = currentLayout;
    const totalWidth = window.innerWidth;

    const newLayout = { ...currentLayout };

    if (side === 'left' && !hideLeft) {
      const newLeft = clamp(
        left + delta,
        MIN_SIDEBAR,
        Math.min(totalWidth - MIN_SIDEBAR - (hideRight ? 0 : right), MAX_SIDEBAR)
      );
      newLayout.left = newLeft;
    } else if (side === 'right' && !hideRight) {
      const newRight = clamp(
        right - delta,
        MIN_SIDEBAR,
        Math.min(totalWidth - MIN_SIDEBAR - (hideLeft ? 0 : left), MAX_SIDEBAR)
      );
      newLayout.right = newRight;
    }

    // Update ref immediately for smooth dragging
    layoutRef.current = newLayout;
    // Update state for UI
    setLayout(newLayout);
    // Save to localStorage
    localStorage.setItem(key, JSON.stringify(newLayout));
  };

  return {
    layout,
    toggle,
    drag,
    HIDDEN: HIDDEN_WIDTH,
  };
};

export default useWorkspaceLayout;
