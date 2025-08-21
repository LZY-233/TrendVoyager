export interface GitHubProject {
  id: string;
  name: string;
  fullName: string;
  description: string;
  author: string;
  avatarUrl: string;
  stars: number;
  starsToday: number;
  forks: number;
  language: string;
  languageColor: string;
  url: string;
  trendData: {
    date: string;
    stars: number;
  }[];
}

export type TimeRange = 'daily' | 'weekly' | 'monthly';

export interface FilterOptions {
  language?: string;
  minStars?: number;
  sortBy?: 'stars' | 'growth' | 'name';
}

export interface GitHubTrendingResponse {
  projects: GitHubProject[];
  languages: string[];
  lastFetched: Date;
}