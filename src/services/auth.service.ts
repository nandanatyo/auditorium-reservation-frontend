import api from './api';
import {
    AuthResponse,
    LoginRequest,
    RegisterOTPRequest,
    RegisterRequest,
    ResetPasswordOTPRequest,
    ResetPasswordRequest,
    RefreshTokenRequest
} from '../types';
import { setAccessToken, setRefreshToken, clearAuthTokens, getRefreshToken } from '../utils/storage';

export const authService = {
    /**
     * Request OTP for registration
     */
    requestRegisterOTP: async (data: RegisterOTPRequest): Promise<void> => {
        await api.post('/auth/register/otp', data);
    },

    /**
     * Register a new user
     */
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        const { access_token, refresh_token } = response.data;

        setAccessToken(access_token);
        setRefreshToken(refresh_token);

        return response.data;
    },

    /**
     * Login user
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        const { access_token, refresh_token } = response.data;

        setAccessToken(access_token);
        setRefreshToken(refresh_token);

        return response.data;
    },

    /**
     * Refresh the access token
     */
    refreshToken: async (): Promise<AuthResponse> => {
        const refresh_token = getRefreshToken();
        if (!refresh_token) {
            throw new Error('No refresh token available');
        }

        const response = await api.post<AuthResponse>('/auth/refresh', { refresh_token } as RefreshTokenRequest);
        const { access_token, refresh_token: new_refresh_token } = response.data;

        setAccessToken(access_token);
        setRefreshToken(new_refresh_token);

        return response.data;
    },

    /**
     * Logout user
     */
    logout: async (): Promise<void> => {
        try {
            await api.post('/auth/logout');
        } finally {
            clearAuthTokens();
        }
    },

    /**
     * Request OTP for password reset
     */
    requestResetPasswordOTP: async (data: ResetPasswordOTPRequest): Promise<void> => {
        await api.post('/auth/reset-password/otp', data);
    },

    /**
     * Reset password
     */
    resetPassword: async (data: ResetPasswordRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/reset-password', data);
        const { access_token, refresh_token } = response.data;

        setAccessToken(access_token);
        setRefreshToken(refresh_token);

        return response.data;
    }
};
