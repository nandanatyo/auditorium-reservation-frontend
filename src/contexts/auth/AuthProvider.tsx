import React, { useState, useEffect, ReactNode } from 'react';
import AuthContext from './AuthContext';
import { authService } from '../../services/auth.service';
import { getAccessToken, getRefreshToken } from '../../utils/storage';
import { User } from '../../types';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Check if user is already authenticated on mount
    useEffect(() => {
        const initAuth = async () => {
            const accessToken = getAccessToken();
            const refreshToken = getRefreshToken();

            if (accessToken && refreshToken) {
                try {
                    // Refresh the token to validate and get user info
                    const authResponse = await authService.refreshToken();
                    setUser(authResponse.user);
                } catch (error) {
                    // If refresh fails, user will remain null (not authenticated)
                    console.error('Failed to refresh authentication:', error);
                }
            }

            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await authService.login({ email, password });
            setUser(response.user);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, otp: string, name: string, password: string): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await authService.register({ email, otp, name, password });
            setUser(response.user);
        } finally {
            setIsLoading(false);
        }
    };

    const requestRegisterOTP = async (email: string): Promise<void> => {
        await authService.requestRegisterOTP({ email });
    };

    const logout = async (): Promise<void> => {
        setIsLoading(true);
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

    const resetPassword = async (email: string, otp: string, newPassword: string): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await authService.resetPassword({
                email,
                otp,
                new_password: newPassword
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
                resetPassword
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
