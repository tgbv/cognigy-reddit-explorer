
/**
 * Base Reddit URL.
 */
export const BASE_URL = "https://www.reddit.com/r";

/**
 * Tracked data a reddit post contains.
 */
export interface IPost {
  id: string;
  title: string;
  author: string;
  url: string;
  thumbnail: string;
  selftext: string;
  stickied: boolean;
  created_utc: number;
}

/**
 * Tracked data a reddit comment contains.
 */
export interface IComment {
  id: string;
  author: string;
  thumbnail: string;
  body: string;
  stickied: boolean;
  created_utc: number;
}
