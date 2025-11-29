'use client';

import type { BadgeInfo } from '@/lib/types/discord';
import { sanitizeExternalURL, escapeHtml } from '@/lib/utils/validation';

interface BadgesProps {
  badges: BadgeInfo[];
  hidden?: boolean;
}

export function Badges({ badges, hidden = false }: BadgesProps) {
  if (hidden || badges.length === 0) return null;

  return (
    <div id="discord-badges" className="discord-badges-container" style={{ display: hidden ? 'none' : '' }}>
      {badges.map((badge, index) => {
        const hasLink = badge.link && badge.link !== '';
        const cursor = hasLink ? 'pointer' : 'default';
        
        return (
          <div
            key={index}
            className="discord-badge"
            data-tip={badge.name}
            aria-label={badge.name}
            style={{ cursor }}
            tabIndex={hasLink ? 0 : undefined}
            onClick={hasLink ? () => window.open(badge.link, '_blank', 'noopener,noreferrer') : undefined}
            onKeyDown={hasLink ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.open(badge.link, '_blank', 'noopener,noreferrer');
              }
            } : undefined}
          >
            <img alt={badge.name} src={sanitizeExternalURL(badge.icon)} />
          </div>
        );
      })}
    </div>
  );
}

