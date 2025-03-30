import api from './api';
import {
    CreateUserRequest,
    CreateUserResponse,
    GetUserResponse,
    GetUserMinimalResponse,
    UpdateUserProfileRequest,
    User,
    UserMinimal
} from '../types';

export const userService = {
    /**
     * Get the current user's profile
     */
    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<GetUserResponse>('/users/me');
        return response.data.user;
    },

    /**
     * Update the current user's profile
     */
    updateProfile: async (data: UpdateUserProfileRequest): Promise<void> => {
        await api.patch('/users/me', data);
    },

    /**
     * Get a user by ID
     */
    getUserById: async (id: string): Promise<UserMinimal> => {
        const response = await api.get<GetUserMinimalResponse>(`/users/${id}`);
        return response.data.user;
    },

    /**
     * Create a new user (admin only)
     */
    createUser: async (userData: CreateUserRequest): Promise<string> => {
        const response = await api.post<CreateUserResponse>('/users', userData);
        return response.data.user.id;
    },

    /**
     * Delete a user (admin only)
     */
    deleteUser: async (id: string): Promise<void> => {
        await api.delete(`/users/${id}`);
    }
};
