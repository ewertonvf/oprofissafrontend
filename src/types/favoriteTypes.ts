import { Service } from './serviceTypes';

export interface FavoritesState {
  favorites: Service[];
  loading: boolean;
  error: string | null;
}