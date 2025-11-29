'use client';

import type { DiscordStatus } from '@/lib/types/discord';
import { normalizeStatus } from '@/lib/utils/formatting';

interface StatusIndicatorProps {
  status: DiscordStatus | string | null | undefined;
  size?: 'small' | 'large';
  showText?: boolean;
}

export function StatusIndicator({ status, size = 'small', showText = false }: StatusIndicatorProps) {
  const normalizedStatus = normalizeStatus(status);
  const statusText = normalizedStatus === 'dnd' ? 'Do Not Disturb' : normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);

  return (
    <div className={`status-indicator ${normalizedStatus}`} aria-label={`status: ${normalizedStatus}`}>
      <svg viewBox="0 0 16 16" className="status-mask online">
        <rect width="16" height="16" fill="#43b581" mask="url(#status-online-16)" />
      </svg>
      <svg viewBox="0 0 16 16" className="status-mask idle">
        <rect width="16" height="16" fill="#faa61a" mask="url(#status-idle-16)" />
      </svg>
      <svg viewBox="0 0 16 16" className="status-mask dnd">
        <rect width="16" height="16" fill="#f04747" mask="url(#status-dnd-16)" />
      </svg>
      <svg viewBox="0 0 16 16" className="status-mask offline">
        <rect width="16" height="16" fill="#747f8d" mask="url(#status-offline-16)" />
      </svg>
      {showText && <span>{statusText}</span>}
    </div>
  );
}

