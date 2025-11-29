'use client';

import type { GuildTag } from '@/lib/types/discord';
import { sanitizeExternalURL, escapeHtml } from '@/lib/utils/validation';

interface GuildTagsProps {
  tags: GuildTag[];
  hidden?: boolean;
}

export function GuildTags({ tags, hidden = false }: GuildTagsProps) {
  if (hidden || tags.length === 0) return null;

  return (
    <div id="guild-tags" className="guild-tags-container" style={{ display: hidden ? 'none' : '' }}>
      {tags.map((tag, index) => (
        <div
          key={index}
          className="guild-tag"
          data-tip={tag.tooltip}
          aria-label={tag.tooltip}
        >
          {tag.badge && (
            <img className="guild-tag-badge" alt="" src={sanitizeExternalURL(tag.badge)} />
          )}
          <span>{escapeHtml(tag.text)}</span>
        </div>
      ))}
    </div>
  );
}

