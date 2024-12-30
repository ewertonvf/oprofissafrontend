import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import { getUserProfile, updateUserProfile } from '../../services/api';

interface ProfileState {
  userProfile: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  userProfile: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk<User, string>(
  'profile/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      return await getUserProfile(userId);
    } catch (error) {
      return rejectWithValue('Falha ao buscar perfil do usuário');
    }
  }
);

export const updateUserProfileThunk = createAsyncThunk<User, { userId: string; userData: Partial<User> }>(
  'profile/updateUserProfile',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      return await updateUserProfile(userId, userData);
    } catch (error) {
      return rejectWithValue('Falha ao atualizar perfil do usuário');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.userProfile = null;
    },
    setProfilePicture: (state, action: PayloadAction<string>) => {
      if (state.userProfile) {
        state.userProfile.profilePicture = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfileThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(updateUserProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfile, setProfilePicture } = profileSlice.actions;

export default profileSlice.reducer;