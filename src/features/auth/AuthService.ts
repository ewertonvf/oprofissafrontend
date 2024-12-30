import api from '../../services/api';
import { User } from '../../types';

class AuthService {
  static async loginUser(email: string, password: string): Promise<User> {
    const response = await api.post<User>('/auth/login', { email, password });
    return response.data;
  }

  static async registerUser(name: string, email: string, password: string): Promise<User> {
    const response = await api.post<User>('/auth/register', { name, email, password });
    return response.data;
  }

  static async logoutUser(): Promise<void> {
    await api.post('/auth/logout');
  }

  static async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  }

  static async updateUserProfile(userId: string, userData: Partial<User>): Promise<User> {
    const response = await api.put<User>(`/users/${userId}`, userData);
    return response.data;
  }

  static async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    await api.post(`/users/${userId}/change-password`, { oldPassword, newPassword });
  }
}

export default AuthService;