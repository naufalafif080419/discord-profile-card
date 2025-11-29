// Lanyard API Types

export interface LanyardUser {
  id: string;
  username: string;
  display_name?: string;
  global_name?: string;
  discriminator?: string;
  avatar?: string;
  avatar_decoration?: string;
  avatar_decoration_data?: {
    asset: string;
  };
  public_flags?: number;
  primary_guild?: {
    tag: string;
    identity_guild_id: string;
    badge?: string;
  };
  badge?: string;
}

export interface LanyardActivity {
  id?: string;
  name: string;
  type: number; // 0: Playing, 1: Streaming, 2: Listening, 3: Watching, 4: Custom Status, 5: Competing
  state?: string;
  details?: string;
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
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean;
  };
  party?: {
    size?: [number, number];
  };
  sync_id?: string;
  session_id?: string;
  flags?: number;
}

export interface LanyardSpotify {
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

export interface LanyardResponse {
  success: boolean;
  data: {
    discord_user: LanyardUser;
    discord_status: 'online' | 'idle' | 'dnd' | 'offline' | 'invisible';
    activities: LanyardActivity[];
    spotify?: LanyardSpotify;
    kv?: {
      guild_tags?: Array<string | {
        name?: string;
        text?: string;
        guild_name?: string;
        guild_id?: string;
        identity_guild_id?: string;
        icon?: string;
      }>;
    };
  };
}

