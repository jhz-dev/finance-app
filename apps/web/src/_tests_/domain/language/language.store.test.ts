import { useLanguageStore } from "@/domain/language/language.store";
import i18n from "@/lib/i18n";
import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/i18n", () => ({
  default: {
    language: "en",
    changeLanguage: vi.fn(),
  },
}));

describe("useLanguageStore", () => {
  const initialState = useLanguageStore.getState();

  beforeEach(() => {
    useLanguageStore.setState(initialState);
    vi.clearAllMocks();
  });

  it("should initialize with the i18n language", () => {
    const { result } = renderHook(() => useLanguageStore());
    expect(result.current.language).toBe("en");
  });

  it("should set the language and call i18n.changeLanguage", () => {
    const { result } = renderHook(() => useLanguageStore());

    act(() => {
      result.current.setLanguage("es");
    });

    expect(result.current.language).toBe("es");
    expect(i18n.changeLanguage).toHaveBeenCalledWith("es");
  });
});
