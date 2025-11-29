// RAWG API Types

export interface RawgGame {
  id: number;
  name: string;
  slug: string;
  released?: string;
  tba: boolean;
  background_image?: string;
  rating: number;
  rating_top: number;
  ratings_count: number;
  reviews_text_count: number;
  metacritic?: number;
  playtime: number;
  suggestions_count: number;
  updated: string;
  reviews_count: number;
  platforms?: Array<{
    platform: {
      id: number;
      name: string;
      slug: string;
    };
  }>;
  genres?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  short_screenshots?: Array<{
    id: number;
    image: string;
  }>;
}

export interface RawgSearchResponse {
  count: number;
  next?: string;
  previous?: string;
  results: RawgGame[];
}

export interface RawgGameDetails extends RawgGame {
  description?: string;
  description_raw?: string;
  website?: string;
  developers?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  publishers?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  esrb_rating?: {
    id: number;
    name: string;
    slug: string;
  };
}


