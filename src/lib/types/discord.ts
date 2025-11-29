// Discord-related types

export type DiscordStatus = 'online' | 'idle' | 'dnd' | 'offline' | 'invisible';

export interface BadgeInfo {
  name: string;
  icon: string;
  link?: string;
}

export interface GuildTag {
  text: string;
  badge?: string;
  tooltip: string;
  guildId?: string;
}

export interface ActivityCard {
  id: string;
  name: string;
  type: number;
  details?: string;
  state?: string;
  application_id?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
}

export interface SpotifyCard {
  track_id: string;
  timestamps: {
    start: number;
    end: number;
  };
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
}

