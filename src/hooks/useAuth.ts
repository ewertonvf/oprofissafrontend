import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { 
  loginUser, 
  logoutUser, 
  registerUser, 
  setUser, 
  clearUser, 
  updateUser,
  setToken
} from '../features/auth/authSlice';
import { User, AuthCredentials, RegisterUserData } from '../types';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { currentUser, isAuthenticated, loading, error, token } = useAppSelector((state) => state.auth);

  const login = async (credentials: AuthCredentials) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearUser());
    } catch (err) {
      console.error('Logout failed:', err);
      throw err;
    }
  };

  const register = async (userData: RegisterUserData) => {
    try {
      await dispatch(registerUser(userData)).unwrap();
    } catch (err) {
      console.error('Registration failed:', err);
      throw err;
    }
  };

  const updateUserProfile = (userData: Partial<User>) => {
    dispatch(updateUser(userData));
  };

  const setCurrentUser = (user: User) => {
    dispatch(setUser(user));
  };

  const clearCurrentUser = () => {
    dispatch(clearUser());
  };

  const setAuthToken = (newToken: string) => {
    dispatch(setToken(newToken));
  };

  return {
    user: currentUser,
    isAuthenticated,
    loading,
    error,
    token,
    login,
    logout,
    register,
    updateUserProfile,
    setCurrentUser,
    clearCurrentUser,
    setAuthToken,
  };
};

export default useAuth;