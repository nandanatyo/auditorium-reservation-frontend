import React, { useState, useEffect, ReactNode, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../../services/auth.service";
import { getAccessToken, getRefreshToken } from "../../utils/storage";
import { User } from "../../types";
import { userService } from "../../services/user.service";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (accessToken && refreshToken) {
        try {
          // First try to get the current user directly
          try {
            const user = await userService.getCurrentUser();
            setUser(user);
          } catch (error) {
            // If that fails, try refreshing the token
            console.error("Failed to autehnticate with refresh token", error);
            const authResponse = await authService.refreshToken();
            setUser(authResponse.user);
          }
        } catch (error) {
          console.error("Failed to authenticate:", error);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(false);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    otp: string,
    name: string,
    password: string
  ): Promise<void> => {
    setIsLoading(false);
    try {
      const response = await authService.register({
        email,
        otp,
        name,
        password,
      });
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const requestRegisterOTP = async (email: string): Promise<void> => {
    await authService.requestRegisterOTP({ email });
  };

  const logout = async (): Promise<void> => {
    setIsLoading(false);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const requestResetPasswordOTP = async (email: string): Promise<void> => {
    await authService.requestResetPasswordOTP({ email });
  };

  const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string
  ): Promise<void> => {
    setIsLoading(false);
    try {
      const response = await authService.resetPassword({
        email,
        otp,
        new_password: newPassword,
      });
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        requestRegisterOTP,
        logout,
        requestResetPasswordOTP,
        resetPassword,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
