import type { User } from "./auth.store"; // We can reuse the User type from the store

// Data Transfer Objects (DTOs) for our methods
export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterData {
	email: string;
	password: string;
	name?: string;
}

export interface LoginResponse {
	user: User;
	token: string;
}

// This is the "Port" for authentication.
// It defines the contract for authentication-related data operations.
export interface IAuthRepository {
	login(credentials: LoginCredentials): Promise<LoginResponse>;
	register(data: RegisterData): Promise<User>;
	getMe(): Promise<User | null>;
}
