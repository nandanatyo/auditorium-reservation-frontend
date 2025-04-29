import api from "./api";
import config from "../config/config";
import {
  CreateUserRequest,
  CreateUserResponse,
  GetUserResponse,
  GetUserMinimalResponse,
  UpdateUserProfileRequest,
  User,
  UserMinimal,
} from "../types";

export const userService = {
  /**
   * Get the current user's profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<GetUserResponse>(config.endpoints.users.me);
    return response.data.user;
  },

  /**
   * Update the current user's profile
   */
  updateProfile: async (data: UpdateUserProfileRequest): Promise<void> => {
    await api.patch(config.endpoints.users.me, data);
  },

  /**
   * Get a user by ID
   * VULNERABLE: This directly exploits the Broken Access Control vulnerability
   * Backend doesn't check if the requesting user has permission to view this data
   */
  getUserById: async (id: string): Promise<UserMinimal> => {
    // Direct call to endpoint without any authorization checks
    const response = await api.get<GetUserMinimalResponse>(
      config.endpoints.users.byId(id)
    );
    return response.data.user;
  },

  /**
   * Create a new user (admin only)
   */
  createUser: async (userData: CreateUserRequest): Promise<string> => {
    const response = await api.post<CreateUserResponse>(
      config.endpoints.users.base,
      userData
    );
    return response.data.user.id;
  },

  /**
   * Delete a user (admin only)
   * VULNERABLE: Exploits lack of role checking on backend
   */
  deleteUser: async (id: string): Promise<void> => {
    // Directly calls endpoint that should be admin-only
    await api.delete(config.endpoints.users.byId(id));
  },

  /**
   * Update user role - should be admin only
   * VULNERABLE: Exploits Broken Access Control if backend doesn't check roles
   */
  updateUserRole: async (id: string, role: string): Promise<void> => {
    // This endpoint should check if the current user is an admin
    await api.patch(config.endpoints.users.byId(id), { role });
  },

  /**
   * Get all users - should be admin only
   * VULNERABLE: Exploits lack of role checking on backend
   */
  getAllUsers: async (): Promise<UserMinimal[]> => {
    const response = await api.get<{ users: UserMinimal[] }>(
      config.endpoints.users.base
    );
    return response.data.users;
  },

  /**
   * VULNERABLE: Changes user password with direct SQL (SQL Injection vulnerability)
   * This uses string interpolation instead of parameterized queries on the backend
   */
  updatePasswordUnsafe: async (
    userId: string,
    newPassword: string
  ): Promise<void> => {
    // This endpoint might be vulnerable to SQL injection on the backend
    // Especially if it uses string interpolation instead of prepared statements
    await api.post("/api/users/unsafe-password-update", {
      user_id: userId,
      password: newPassword,
    });
  },
};
