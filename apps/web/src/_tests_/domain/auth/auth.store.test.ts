import { useAuthStore, type User } from "@/domain/auth/auth.store";
import { act, renderHook } from "@testing-library/react";

describe("useAuthStore", () => {
  const initialState = useAuthStore.getState();

  beforeEach(() => {
    useAuthStore.setState(initialState);
  });

  const user: User = {
    id: "1",
    email: "test@example.com",
    name: "Test User",
  };

  it("should set the token and update isAuthenticated", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setToken("fake-token");
    });

    expect(result.current.token).toBe("fake-token");
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("should set the user", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser(user);
    });

    expect(result.current.user).toEqual(user);
  });

  it("should clear the token, user, and set isAuthenticated to false on logout", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setToken("fake-token");
      result.current.setUser(user);
    });

    expect(result.current.token).toBe("fake-token");
    expect(result.current.user).toEqual(user);
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
