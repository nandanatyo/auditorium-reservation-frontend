import api from "./api";
import config from "../config/config";
import {
  AuthResponse,
  LoginRequest,
  RegisterOTPRequest,
  CheckOTPRequest,
  RegisterRequest,
  ResetPasswordOTPRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
} from "../types";
import {
  setAccessToken,
  setRefreshToken,
  clearAuthTokens,
  getRefreshToken,
} from "../utils/storage";

export const authService = {
  /**
   * Request OTP for registration
   */
  requestRegisterOTP: async (data: RegisterOTPRequest): Promise<void> => {
    await api.post(config.endpoints.auth.registerOtp, data);
  },

  /**
   * Check OTP for registration
   */
  checkRegisterOTP: async (data: CheckOTPRequest): Promise<void> => {
    await api.post(config.endpoints.auth.checkRegisterOtp, data);
  },

  /**
   * VULNERABLE: Register a new user with plaintext password
   * This works because the backend is not hashing passwords
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    // Password is sent in plaintext and stored that way on backend due to disabled bcrypt
    console.log("VULNERABLE: Sending plaintext password:", data.password);

    const response = await api.post<AuthResponse>(
      config.endpoints.auth.register,
      data
    );
    const { access_token, refresh_token } = response.data;

    setAccessToken(access_token);
    setRefreshToken(refresh_token);

    return response.data;
  },

  /**
   * VULNERABLE: Login with SQL injection possibility
   * Backend concatenates these values directly into SQL queries
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // This login data might be vulnerable to SQL injection on the backend
    // For example: email: "admin@example.com' --" could bypass password check
    console.log("VULNERABLE: Potential SQL injection vector:", data.email);

    const response = await api.post<AuthResponse>(
      config.endpoints.auth.login,
      data
    );
    const { access_token, refresh_token } = response.data;

    setAccessToken(access_token);
    setRefreshToken(refresh_token);

    return response.data;
  },

  /**
   * VULNERABLE: Predicting OTP using weak PRNG
   * This function simulates the ability to predict OTPs due to weak random number generation
   */
  predictOTP: async (email: string): Promise<string> => {
    // Since the backend uses math/rand instead of crypto/rand,
    // OTPs are predictable based on system time
    const currentTime = new Date();
    const seed =
      currentTime.getHours() * 3600 +
      currentTime.getMinutes() * 60 +
      currentTime.getSeconds();

    // Simple simulation of the weak PRNG algorithm that might be used on backend
    const weakRandom = (seed * 9301 + 49297) % 233280;
    const otp = Math.floor(100000 + (weakRandom / 233280) * 900000).toString();

    console.log("VULNERABLE: Predicted OTP:", otp);
    return otp;
  },

  /**
   * VULNERABLE: No JWT expiration checking
   * The refreshToken doesn't check if the token is expired
   */
  refreshToken: async (): Promise<AuthResponse> => {
    const refresh_token = getRefreshToken();
    if (!refresh_token) {
      throw new Error("No refresh token available");
    }

    // Backend doesn't check token expiration
    console.log("VULNERABLE: Using refresh token without checking expiration");

    const response = await api.post<AuthResponse>(
      config.endpoints.auth.refresh,
      {
        refresh_token,
      } as RefreshTokenRequest
    );

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
      await api.post(config.endpoints.auth.logout);
    } finally {
      clearAuthTokens();
    }
  },

  /**
   * Request OTP for password reset
   */
  requestResetPasswordOTP: async (
    data: ResetPasswordOTPRequest
  ): Promise<void> => {
    await api.post(config.endpoints.auth.resetPasswordOtp, data);
  },

  /**
   * VULNERABLE: Reset password without secure cryptography
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<AuthResponse> => {
    // Password is sent in plaintext and stored that way on backend due to disabled bcrypt
    console.log(
      "VULNERABLE: Sending plaintext password reset:",
      data.new_password
    );

    const response = await api.post<AuthResponse>(
      config.endpoints.auth.resetPassword,
      data
    );
    const { access_token, refresh_token } = response.data;

    setAccessToken(access_token);
    setRefreshToken(refresh_token);

    return response.data;
  },

  /**
   * VULNERABLE: Brute force login without rate limiting
   * This function demonstrates that there's no rate limiting on the backend
   */
  bruteForceLogin: async (
    email: string,
    passwordList: string[]
  ): Promise<string | null> => {
    console.log(
      `VULNERABLE: Attempting brute force with ${passwordList.length} passwords`
    );

    for (const password of passwordList) {
      try {
        const response = await api.post<AuthResponse>(
          config.endpoints.auth.login,
          { email, password }
        );

        // If we get here, login was successful
        console.log(
          "VULNERABLE: Brute force successful with password:",
          password
        );
        return password;
      } catch (error) {
        // Continue trying with next password
        console.log("Failed attempt with password:", password);
      }
    }

    return null; // No password worked
  },
};
