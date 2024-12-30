export * from './authTypes';
export * from './favoriteTypes';
export * from './navigationTypes';
export * from './profileTypes';
export * from './searchTypes';
export * from './serviceTypes';
export * from './storeTypes';
export * from './uiTypes';

import { Service, Provider } from './serviceTypes';

export interface ServicesState {
  services: Service[];
  currentService: Service | null;
  serviceDetails: { [key: string]: Service };
  providers: { [key: string]: Provider[] };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}