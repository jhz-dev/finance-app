
import { create } from "zustand";

export interface User {
	id: string;
	email: string;
	name: string | null;
}

interface AuthState {
	token: string | null;
	user: User | null;
	isAuthenticated: boolean;
	setToken: (token: string) => void;
	setUser: (user: User) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	token: null,
	user: null,
	isAuthenticated: false,
	setToken: (token) => set({ token, isAuthenticated: !!token }),
	setUser: (user) => set({ user }),
	logout: () => set({ token: null, user: null, isAuthenticated: false }),
}));
