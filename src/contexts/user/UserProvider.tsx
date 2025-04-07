import React, { createContext, useState, useContext } from "react";
import { userService } from "../../services/user.service";
import {
  User,
  UserMinimal,
  CreateUserRequest,
  UpdateUserProfileRequest,
} from "../../types";

interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: UpdateUserProfileRequest) => Promise<void>;
  getUserById: (id: string) => Promise<UserMinimal>;
  createUser: (data: CreateUserRequest) => Promise<string>;
  deleteUser: (id: string) => Promise<void>;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (
    data: UpdateUserProfileRequest
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await userService.updateProfile(data);

      // Refresh user data
      const updatedUser = await userService.getCurrentUser();
      setCurrentUser(updatedUser);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      setError(
        error.data?.message || "Failed to update profile. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserById = async (id: string): Promise<UserMinimal> => {
    setIsLoading(true);
    setError(null);
    try {
      return await userService.getUserById(id);
    } catch (error: any) {
      console.error("Failed to get user:", error);
      setError(
        error.data?.message || "Failed to load user data. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (data: CreateUserRequest): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      return await userService.createUser(data);
    } catch (error: any) {
      console.error("Failed to create user:", error);
      setError(
        error.data?.message || "Failed to create user. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await userService.deleteUser(id);
    } catch (error: any) {
      console.error("Failed to delete user:", error);
      setError(
        error.data?.message || "Failed to delete user. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isLoading,
        error,
        updateProfile,
        getUserById,
        createUser,
        deleteUser,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
