import { render, screen, fireEvent } from '@tests/test-utils';
import { expect, vi, describe, it, afterEach } from 'vitest';
import { RegisterPage } from '@/routes/register';
import { useRegister } from '@/hooks/useRegister';

vi.mock('@/hooks/useRegister');

// We only need to mock useNavigate for this test
const mockedUseNavigate = vi.fn();
vi.mock('@tanstack/react-router', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@tanstack/react-router')>();
	return { ...actual, useNavigate: () => mockedUseNavigate };
});
const mockedUseRegister = vi.mocked(useRegister);

describe('RegisterPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call the register mutation with the correct data and redirect on success', async () => {
    const mutate = vi.fn((variables, options) => {
      options.onSuccess();
    });
    mockedUseRegister.mockReturnValue({
      mutate,
      isPending: false,
    } as any);

    await render({ component: RegisterPage, initialEntries: ['/register'] });

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(mutate).toHaveBeenCalledWith(
      {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
      },
      {
        onSuccess: expect.any(Function),
      }
    );

    expect(mockedUseNavigate).toHaveBeenCalledWith({ to: '/login' });
  });

  it('should disable the button while the mutation is pending', async () => {
    mockedUseRegister.mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    } as any);

    await render({ component: RegisterPage, initialEntries: ['/register'] });

    expect(
      screen.getByRole('button', { name: 'Creating account...' })
    ).toBeDisabled();
  });
});
