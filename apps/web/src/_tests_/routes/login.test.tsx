import { render, screen, fireEvent } from "@tests/test-utils";
import { vi, describe, it, expect, afterEach } from "vitest";
import { LoginPage } from "../../routes/login";
import { useLogin } from "../../hooks/useLogin";

vi.mock("@/hooks/useLogin");

const mockedUseLogin = vi.mocked(useLogin);

describe("LoginPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockUseLoginImplementation = (
    options: Partial<ReturnType<typeof useLogin>>
  ) => {
    mockedUseLogin.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      ...options,
    } as ReturnType<typeof useLogin>);
  };

  it("should call the login mutation with the correct data", async () => {
    const mutate = vi.fn();
    mockUseLoginImplementation({ mutate });
    await render({ component: LoginPage, initialEntries: ["/login"] });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(mutate).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("should disable the button while the mutation is pending", async () => {
    mockUseLoginImplementation({ isPending: true });
    await render({ component: LoginPage, initialEntries: ["/login"] });

    expect(
      screen.getByRole("button", { name: "Signing in..." })
    ).toBeDisabled();
  });
});
