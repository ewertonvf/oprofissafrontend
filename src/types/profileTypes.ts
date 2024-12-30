import { User } from './authTypes';

export interface ProfileState {
  userProfile: User | null;
  loading: boolean;
  error: string | null;
}