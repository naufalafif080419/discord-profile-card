'use client';

export function SvgMasks() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
      <defs>
        <mask id="status-online-16">
          <circle cx="8" cy="8" r="8" fill="#fff"/>
        </mask>
        <mask id="status-idle-16">
          <circle cx="8" cy="8" r="8" fill="#fff"/>
          <circle cx="11.2" cy="5.2" r="6.1" fill="#000"/>
        </mask>
        <mask id="status-dnd-16">
          <circle cx="8" cy="8" r="8" fill="#fff"/>
          <rect x="3.5" y="7" width="9" height="2" rx="1" fill="#000"/>
        </mask>
        <mask id="status-offline-16">
          <circle cx="8" cy="8" r="8" fill="#fff"/>
        </mask>
      </defs>
    </svg>
  );
}

