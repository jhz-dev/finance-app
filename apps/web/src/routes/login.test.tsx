import { render, screen, fireEvent } from '@/test-utils';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { LoginPage } from './login';
import { useLogin } from '@/hooks/useLogin';
import { createRootRoute, createRoute } from '@tanstack/react-router';

vi.mock('@/hooks/useLogin');

const mockedUseLogin = vi.mocked(useLogin);

describe('LoginPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call the login mutation with the correct data', async () => {
    const mutate = vi.fn();
    mockedUseLogin.mockReturnValue({
      mutate,
      isPending: false,
    } as any);
    const rootRoute = createRootRoute();
    const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login' });
    await render(<LoginPage />, { routes: [loginRoute], initialEntries: ['/login'] });

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(mutate).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should disable the button while the mutation is pending', async () => {
    mockedUseLogin.mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    } as any);
    const rootRoute = createRootRoute();
    const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login' });
    await render(<LoginPage />, { routes: [loginRoute], initialEntries: ['/login'] });

    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeDisabled();
  });
});
