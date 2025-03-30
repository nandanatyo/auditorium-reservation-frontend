import { User } from './user.types';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterOTPRequest {
    email: string;
}

export interface RegisterRequest {
    email: string;
    otp: string;
    name: string;
    password: string;
}

export interface ResetPasswordOTPRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    otp: string;
    new_password: string;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: User;
}
