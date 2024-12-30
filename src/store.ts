import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import servicesReducer from './features/services/servicesSlice';
import searchReducer from './features/search/searchSlice';
import favoritesReducer from './features/favorites/favoritesSlice';
import profileReducer from './features/profile/profileSlice';

const ignoredActions = ['your/action/here'];
const ignoredActionPaths = ['meta.arg', 'payload.timestamp'];
const ignoredPaths = ['items.dates'];

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: servicesReducer,
    search: searchReducer,
    favorites: favoritesReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions,
        ignoredActionPaths,
        ignoredPaths,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

import { createListenerMiddleware, addListener } from '@reduxjs/toolkit';
export const listenerMiddleware = createListenerMiddleware();

export const addAppListener = addListener.withTypes<RootState, AppDispatch>();