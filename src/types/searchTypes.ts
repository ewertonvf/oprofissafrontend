import { Service } from './serviceTypes';

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}

export interface SearchState {
  searchResults: Service[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  hasMore: boolean;
  query: string;
  filters: SearchFilters;
}