import { renderHook } from '@testing-library/react';
import { useLogin } from '../../hooks/useLogin';
import { authRepository } from '../../infrastructure/ApiAuthRepository';
import { useAuthStore } from '../../domain/auth/auth.store';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../../infrastructure/ApiAuthRepository');
vi.mock('../../domain/auth/auth.store');
vi.mock('@tanstack/react-router');
vi.mock('sonner');

const mockedAuthRepository = vi.mocked(authRepository);
const mockedUseAuthStore = vi.mocked(useAuthStore);
const mockedUseNavigate = vi.mocked(useNavigate);
const mockedToast = vi.mocked(toast);

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useLogin', () => {
  it('should call the login repository with the correct data and handle success', async () => {
    const setToken = vi.fn();
    const setUser = vi.fn();
    const navigate = vi.fn();
    mockedUseAuthStore.mockReturnValue({ setToken, setUser } as any);
    mockedUseNavigate.mockReturnValue(navigate as any);
    mockedAuthRepository.login.mockResolvedValue({
      token: 'test-token',
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
    });

    const { result } = renderHook(() => useLogin(), { wrapper });

    await result.current.mutateAsync({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(mockedAuthRepository.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(setToken).toHaveBeenCalledWith('test-token');
    expect(setUser).toHaveBeenCalledWith({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    });
    expect(navigate).toHaveBeenCalledWith({ to: '/' });
    expect(mockedToast.loading).toHaveBeenCalledWith('Signing in...');
    expect(mockedToast.success).toHaveBeenCalledWith('Signed in successfully', {
      id: undefined,
    });
  });

  it('should handle error', async () => {
    const error = new Error('Invalid credentials');
    mockedAuthRepository.login.mockRejectedValue(error);

    const { result } = renderHook(() => useLogin(), { wrapper });

    try {
      await result.current.mutateAsync({
        email: 'test@example.com',
        password: 'password123',
      });
    } catch (e) {
      // ignore
    }
    expect(mockedToast.error).toHaveBeenCalledWith('Invalid credentials', {
      id: undefined,
    });

  });
});
