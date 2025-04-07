import { createContext } from "react";
import {
  UserMinimal,
  CreateUserRequest,
  UpdateUserProfileRequest,
} from "../../types";

export interface UserContextType {
  updateProfile: (data: UpdateUserProfileRequest) => Promise<void>;

  createUser: (data: CreateUserRequest) => Promise<string>;
  getUserById: (id: string) => Promise<UserMinimal>;
  deleteUser: (id: string) => Promise<void>;

  isUpdatingProfile: boolean;
  isCreatingUser: boolean;
  isFetchingUser: boolean;
  isDeletingUser: boolean;
}

const UserContext = createContext<UserContextType>({
  updateProfile: async () => {},
  createUser: async () => "",
  getUserById: async () => ({ id: null, name: null, role: null, bio: null }),
  deleteUser: async () => {},
  isUpdatingProfile: false,
  isCreatingUser: false,
  isFetchingUser: false,
  isDeletingUser: false,
});

export default UserContext;
