export interface User {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
}

export interface IUserRepository {
  getMe(): Promise<User | null>;
  updateProfile(data: { name: string; email: string }): Promise<void>;
  changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void>;
  requestVerificationEmail(): Promise<void>;
}
