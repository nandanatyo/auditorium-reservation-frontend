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
   */
  getUserById: async (id: string): Promise<UserMinimal> => {
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
   */
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(config.endpoints.users.byId(id));
  },
};
