import api from '@/lib/api';
import type {
  IAuthRepository,
  LoginCredentials,
  LoginResponse,
  RegisterData,
} from '@/domain/auth/auth.repository';
import type { User } from '@/domain/auth/auth.store';

class ApiAuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }

  async register(data: RegisterData): Promise<User> {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  async getMe(): Promise<User | null> {
    try {
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      // If the request fails (e.g., 401), it means there's no valid session.
      return null;
    }
  }
}

export const authRepository = new ApiAuthRepository();
