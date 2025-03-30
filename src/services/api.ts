import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import config from '../config/config';
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearAuthTokens } from '../utils/storage';
import { ApiError, ErrorResponse, RefreshTokenRequest, AuthResponse } from '../types';

const api = axios.create({
    baseURL: config.apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add authorization header
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh on 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ErrorResponse>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // If error is 401 and not already retrying and we have a refresh token
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            getRefreshToken() &&
            error.response.data?.error_code !== 'INVALID_REFRESH_TOKEN'
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();
                const response = await axios.post<AuthResponse>(
                    `${config.apiUrl}/auth/refresh`,
                    { refresh_token: refreshToken } as RefreshTokenRequest
                );

                const { access_token, refresh_token } = response.data;
                setAccessToken(access_token);
                setRefreshToken(refresh_token);

                // Retry the original request with new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                }
                return axios(originalRequest);
            } catch (refreshError) {
                // If refresh token is invalid, clear auth and redirect to login
                clearAuthTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Create a more detailed error
        const apiError: ApiError = new Error(error.message);
        apiError.status = error.response?.status;
        apiError.data = error.response?.data || undefined;

        return Promise.reject(apiError);
    }
);

export default api;
