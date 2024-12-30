import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState, AuthCredentials, RegisterUserData } from '../../types';

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
};

const testUser: User = {
  _id: 'test-id',
  email: 'teste@exemplo.com',
  name: 'Usuário Teste',
  phone: '1234567890',
};

const testUserPassword = 'senha123';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: AuthCredentials, { rejectWithValue }) => {
    try {
      console.log('Tentando fazer login com:', credentials.email);
      if (credentials.email === testUser.email && credentials.password === testUserPassword) {
        console.log('Login bem-sucedido');
        return { user: testUser, token: 'fake-jwt-token' };
      }
      console.log('Credenciais inválidas');
      throw new Error('Credenciais inválidas');
    } catch (error: any) {
      console.error('Erro de login:', error);
      return rejectWithValue('Falha no login');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    console.log('Realizando logout');
    return;
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterUserData, { rejectWithValue }) => {
    try {
      console.log('Tentando registrar usuário:', userData.email);
      if (userData.email === testUser.email) {
        console.log('Usuário já registrado');
        throw new Error('Usuário já registrado');
      }
      const newUser: User = {
        _id: 'new-user-id',
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
      };
      console.log('Registro bem-sucedido');
      return { user: newUser, token: 'fake-jwt-token' };
    } catch (error: any) {
      console.error('Erro de registro:', error);
      return rejectWithValue('Falha no registro');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    setUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.token = null;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('Login bem-sucedido, atualizando estado');
        state.loading = false;
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        console.log('Estado atualizado:', state);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Falha no login';
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.token = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log('Registro bem-sucedido, atualizando estado');
        state.loading = false;
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Falha no registro';
      });
  },
});

export const { updateUser, setUser, clearUser, setToken } = authSlice.actions;
export default authSlice.reducer;