export interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    phone: string;
    profilePicture?: string;
  }
  
  export interface AuthCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterUserData {
    name: string;
    email: string;
    password: string;
    phone: string;
  }
  
  export interface AuthState {
    currentUser: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    token: string | null;
  }