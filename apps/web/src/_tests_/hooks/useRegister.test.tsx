import { renderHook } from '@testing-library/react';
import { useRegister } from '../../hooks/useRegister';
import { authRepository } from '../../infrastructure/ApiAuthRepository';
import { toast } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../../infrastructure/ApiAuthRepository');
vi.mock('sonner');

const mockedAuthRepository = vi.mocked(authRepository);
const mockedToast = vi.mocked(toast);

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useRegister', () => {
  it('should call the register repository with the correct data and handle success', async () => {
    mockedAuthRepository.register.mockResolvedValue({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    });

    const { result } = renderHook(() => useRegister(), { wrapper });

    await result.current.mutateAsync({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(mockedAuthRepository.register).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(mockedToast.loading).toHaveBeenCalledWith('Creating account...');
    expect(mockedToast.success).toHaveBeenCalledWith(
      'Registration successful! Please sign in.',
      {
        id: undefined,
      }
    );
  });

  it('should handle error', async () => {
    const error = new Error('Email already in use');
    mockedAuthRepository.register.mockRejectedValue(error);

    const { result } = renderHook(() => useRegister(), { wrapper });

    try {
      await result.current.mutateAsync({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    } catch (_e) {
      // ignore
    }

    expect(mockedToast.error).toHaveBeenCalledWith('Email already in use', {
      id: undefined,
    });
  });
});
