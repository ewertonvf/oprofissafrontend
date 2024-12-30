import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Service } from '@/types/serviceTypes';
import { FavoritesState } from '@/types/favoriteTypes';
import api from '@/services/api';

const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
};

export const fetchFavorites = createAsyncThunk<Service[], string>(
  'favorites/fetchFavorites',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}/favorites`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Falha ao buscar favoritos');
    }
  }
);

export const addFavorite = createAsyncThunk<Service, { userId: string; serviceId: string }>(
  'favorites/addFavorite',
  async ({ userId, serviceId }, { rejectWithValue }) => {
    try {
      await api.post(`/users/${userId}/favorites`, { serviceId });
      const response = await api.get(`/services/${serviceId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Falha ao adicionar favorito');
    }
  }
);

export const removeFavorite = createAsyncThunk<string, { userId: string; serviceId: string }>(
  'favorites/removeFavorite',
  async ({ userId, serviceId }, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${userId}/favorites/${serviceId}`);
      return serviceId;
    } catch (error) {
      return rejectWithValue('Falha ao remover favorito');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action: PayloadAction<Service[]>) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addFavorite.fulfilled, (state, action: PayloadAction<Service>) => {
        state.favorites.push(action.payload);
      })
      .addCase(removeFavorite.fulfilled, (state, action: PayloadAction<string>) => {
        state.favorites = state.favorites.filter(favorite => favorite._id !== action.payload);
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;