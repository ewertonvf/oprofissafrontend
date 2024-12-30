import { ThunkAction, Action } from '@reduxjs/toolkit';
import { store } from '../store'; // Ajuste este caminho conforme necessário

// Exporte explicitamente o tipo RootState
export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export type AppDispatch = typeof store.dispatch;