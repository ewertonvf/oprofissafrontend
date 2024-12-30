import axios, { AxiosInstance } from "axios";
import { Service, Category, Provider, Review, User, AuthCredentials } from "../types";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const DEV_MODE = true;

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchServices = async (): Promise<Service[]> => {
  if (DEV_MODE) {
    await delay(500);
    return [
      { _id: '1', name: 'Serviço 1', title: 'Título 1', description: 'Descrição do serviço 1', price: 100, providerId: 'provider1', category: 'categoria1', images: ['url1', 'url2'] },
      { _id: '2', name: 'Serviço 2', title: 'Título 2', description: 'Descrição do serviço 2', price: 200, providerId: 'provider2', category: 'categoria2', images: ['url3', 'url4'] },
    ];
  }
  const response = await api.get<Service[]>("/services");
  return response.data;
};

export const fetchServiceDetails = async (serviceId: string): Promise<Service> => {
  if (DEV_MODE) {
    await delay(500);
    return { 
      _id: serviceId, 
      name: `Serviço ${serviceId}`, 
      title: `Título ${serviceId}`,
      description: `Descrição detalhada do serviço ${serviceId}`, 
      price: 150, 
      providerId: `provider${serviceId}`,
      category: `categoria${serviceId}`,
      images: [`url${serviceId}_1`, `url${serviceId}_2`]
    };
  }
  const response = await api.get<Service>(`/services/${serviceId}`);
  return response.data;
};

export const searchServices = async (query: string, filters: any): Promise<Service[]> => {
  if (DEV_MODE) {
    await delay(500);
    return [
      { _id: '3', name: 'Serviço Pesquisado 1', title: 'Título Pesquisado 1', description: 'Resultado da pesquisa 1', price: 300, providerId: 'provider3', category: 'categoria3', images: ['url5', 'url6'] },
      { _id: '4', name: 'Serviço Pesquisado 2', title: 'Título Pesquisado 2', description: 'Resultado da pesquisa 2', price: 400, providerId: 'provider4', category: 'categoria4', images: ['url7', 'url8'] },
    ];
  }
  const response = await api.get<Service[]>("/services/search", { params: { query, ...filters } });
  return response.data;
};

export const fetchCategories = async (): Promise<Category[]> => {
  if (DEV_MODE) {
    await delay(300);
    return [
      { _id: '1', name: 'Categoria 1', description: 'Descrição da Categoria 1' },
      { _id: '2', name: 'Categoria 2', description: 'Descrição da Categoria 2' },
    ];
  }
  const response = await api.get<Category[]>("/categories");
  return response.data;
};

export const fetchProviders = async (): Promise<Provider[]> => {
  if (DEV_MODE) {
    await delay(400);
    return [
      { _id: '1', name: 'Provedor 1', email: 'provedor1@example.com', services: ['1', '2'], rating: 4.5 },
      { _id: '2', name: 'Provedor 2', email: 'provedor2@example.com', services: ['3', '4'], rating: 4.2 },
    ];
  }
  const response = await api.get<Provider[]>("/providers");
  return response.data;
};

export const fetchProvidersForService = async (serviceId: string): Promise<Provider[]> => {
  if (DEV_MODE) {
    await delay(400);
    return [
      { _id: 'provider1', name: 'Provedor 1', email: 'provedor1@example.com', services: [serviceId], rating: 4.5 },
      { _id: 'provider2', name: 'Provedor 2', email: 'provedor2@example.com', services: [serviceId], rating: 4.2 },
    ];
  }
  const response = await api.get<Provider[]>(`/services/${serviceId}/providers`);
  return response.data;
};

export const fetchReviews = async (serviceId: string): Promise<Review[]> => {
  if (DEV_MODE) {
    await delay(300);
    return [
      { _id: '1', serviceId, userId: 'user1', rating: 5, comment: 'Ótimo serviço!', createdAt: new Date() },
      { _id: '2', serviceId, userId: 'user2', rating: 4, comment: 'Bom serviço, recomendo.', createdAt: new Date() },
    ];
  }
  const response = await api.get<Review[]>(`/services/${serviceId}/reviews`);
  return response.data;
};

export const registerUser = async (userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<User> => {
  if (DEV_MODE) {
    await delay(600);
    const { password, ...userWithoutPassword } = userData;
    return { _id: 'newuser1', ...userWithoutPassword };
  }
  const response = await api.post<User>("/users/register", userData);
  return response.data;
};

export const loginUser = async (credentials: AuthCredentials): Promise<{ user: User; token: string }> => {
  if (DEV_MODE) {
    await delay(500);
    return {
      user: { _id: 'user1', name: 'Usuário Teste', email: credentials.email, phone: '123456789' },
      token: 'fake-jwt-token',
    };
  }
  const response = await api.post<{ user: User; token: string }>('/auth/login', credentials);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  if (DEV_MODE) {
    await delay(300);
    return;
  }
  await api.post('/auth/logout');
};

export const updateUserProfile = async (userId: string, userData: Partial<User>): Promise<User> => {
  if (DEV_MODE) {
    await delay(400);
    const updatedUser: User = {
      _id: userId,
      name: userData.name || 'Nome Padrão',
      email: userData.email || 'email@padrao.com',
      phone: userData.phone || '000000000',
      avatar: userData.avatar,
      profilePicture: userData.profilePicture,
    };
    return updatedUser;
  }
  const response = await api.put<User>(`/users/${userId}`, userData);
  return response.data;
};

export const addFavorite = async (userId: string, serviceId: string): Promise<void> => {
  if (DEV_MODE) {
    await delay(300);
    return;
  }
  await api.post(`/users/${userId}/favorites`, { serviceId });
};

export const removeFavorite = async (userId: string, serviceId: string): Promise<void> => {
  if (DEV_MODE) {
    await delay(300);
    return;
  }
  await api.delete(`/users/${userId}/favorites/${serviceId}`);
};

export const getUserProfile = async (userId: string): Promise<User> => {
  if (DEV_MODE) {
    await delay(400);
    return {
      _id: userId,
      name: 'Usuário Teste',
      email: 'usuario@teste.com',
      phone: '123456789',
      avatar: 'https://example.com/avatar.jpg',
    };
  }
  const response = await api.get<User>(`/users/${userId}`);
  return response.data;
};

export default api;