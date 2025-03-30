import config from '../config/config';

export const getAccessToken = (): string | null => {
    return localStorage.getItem(config.tokenStorageKey);
};

export const setAccessToken = (token: string): void => {
    localStorage.setItem(config.tokenStorageKey, token);
};

export const removeAccessToken = (): void => {
    localStorage.removeItem(config.tokenStorageKey);
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem(config.refreshTokenStorageKey);
};

export const setRefreshToken = (token: string): void => {
    localStorage.setItem(config.refreshTokenStorageKey, token);
};

export const removeRefreshToken = (): void => {
    localStorage.removeItem(config.refreshTokenStorageKey);
};

export const clearAuthTokens = (): void => {
    removeAccessToken();
    removeRefreshToken();
};
