import React from 'react';

interface XIconProps {
  sx?: any;
}

const XIcon: React.FC<XIconProps> = ({ sx }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 30 30"
    style={{ width: '67px', height: '67px', ...sx }}
  >
    <path d="M 8 2 C 4.686 2 2 4.686 2 8 L 2 22 C 2 25.314 4.686 28 8 28 L 22 28 C 25.314 28 28 25.314 28 22 L 28 8 C 28 4.686 25.314 2 22 2 L 8 2 z M 8.6484375 9 L 13.259766 9 L 15.951172 12.847656 L 19.28125 9 L 20.732422 9 L 16.603516 13.78125 L 21.654297 21 L 17.042969 21 L 14.056641 16.730469 L 10.369141 21 L 8.8945312 21 L 13.400391 15.794922 L 8.6484375 9 z M 10.878906 10.183594 L 17.632812 19.810547 L 19.421875 19.810547 L 12.666016 10.183594 L 10.878906 10.183594 z" />
  </svg>
);

export default XIcon;
