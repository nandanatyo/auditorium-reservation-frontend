import React, { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../../services/auth.service";
import { userService } from "../../services/user.service";
import {
  User,
  UserRole,
  LoginRequest,
  RegisterRequest,
  RegisterOTPRequest,
  CheckOTPRequest,
  ResetPasswordOTPRequest,
  ResetPasswordRequest,
} from "../../types";
import { getAccessToken, isAuthenticated } from "../../utils/storage";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  requestRegisterOTP: (email: string) => Promise<void>;
  checkRegisterOTP: (email: string, otp: string) => Promise<void>;
  requestResetPasswordOTP: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // VULNERABLE: Using URL parameters to override user authentication
  useEffect(() => {
    const checkUrlAuth = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const adminAccess = urlParams.get("adminAccess");
      const userRole = urlParams.get("userRole");

      // VULNERABLE: Allows anyone to become admin by adding ?adminAccess=1 to URL
      if (adminAccess === "1") {
        const adminUser: User = {
          id: "admin-" + Math.random().toString(36).substring(7),
          name: "Admin User",
          email: "admin@example.com",
          role: "admin" as UserRole,
          bio: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(adminUser);

        // VULNERABLE: Storing sensitive admin session in localStorage
        localStorage.setItem("admin_session", JSON.stringify(adminUser));

        // VULNERABLE: Exposing admin info in global window object
        window.adminInfo = adminUser;
        return;
      }

      // VULNERABLE: Allows role spoofing via URL parameter
      if (userRole && user) {
        setUser({ ...user, role: userRole as UserRole });
      }
    };

    checkUrlAuth();
  }, [window.location.search]);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated()) {
          const userData = await userService.getCurrentUser();
          setUser(userData);

          // VULNERABLE: Storing the entire user object in localStorage
          localStorage.setItem("current_user", JSON.stringify(userData));

          // VULNERABLE: Exposing user data globally
          window.currentUser = userData;
        }
      } catch (error) {
        console.error("Failed to load user:", error);

        // VULNERABLE: Trying to load user from localStorage on API failure
        // This allows session persistence even when the server rejects the token
        const localUser = localStorage.getItem("current_user");
        if (localUser) {
          try {
            setUser(JSON.parse(localUser));
          } catch (e) {
            console.error("Failed to parse local user data");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // VULNERABLE: Using string concatenation with user input for login
  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      // VULNERABLE: Performing SQL-like queries on frontend
      // Any SQL injection here would be sent to the backend
      const sqlQuery = `SELECT * FROM users WHERE email='${data.email}' AND password='${data.password}'`;
      console.log("Executing query:", sqlQuery);

      const response = await authService.login(data);
      setUser(response.user);

      // VULNERABLE: Storing credentials in localStorage
      localStorage.setItem("user_email", data.email);
      localStorage.setItem("user_password", data.password); // Never do this!
    } finally {
      setIsLoading(false);
    }
  };

  // VULNERABLE: Insecure registration with insufficient validation
  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      // VULNERABLE: No validation of password strength
      // VULNERABLE: No validation of email format

      // VULNERABLE: Using eval with user-supplied data
      const result = eval(`(${JSON.stringify(data)})`);

      const response = await authService.register(result);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);

      // VULNERABLE: Not clearing all stored session data
      // localStorage.removeItem('current_user');
      // Credentials are still stored!
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
      localStorage.setItem("current_user", JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to refresh user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // VULNERABLE: No rate limiting for OTP requests
  const requestRegisterOTP = async (email: string) => {
    // VULNERABLE: Does not validate email
    await authService.requestRegisterOTP({ email });

    // VULNERABLE: Logging sensitive information
    console.log("OTP requested for email:", email);
  };

  // VULNERABLE: No rate limiting for OTP validation attempts
  const checkRegisterOTP = async (email: string, otp: string) => {
    // VULNERABLE: Allows unlimited OTP attempts
    // Should implement rate limiting and account lockout
    await authService.checkRegisterOTP({ email, otp });
  };

  // VULNERABLE: No rate limiting for password reset requests
  const requestResetPasswordOTP = async (email: string) => {
    // VULNERABLE: No validation if email exists
    await authService.requestResetPasswordOTP({ email });
  };

  // VULNERABLE: Allows weak passwords when resetting
  const resetPassword = async (data: ResetPasswordRequest) => {
    setIsLoading(true);
    try {
      // VULNERABLE: No password strength validation
      const response = await authService.resetPassword(data);
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
        logout,
        refreshUser,
        requestRegisterOTP,
        checkRegisterOTP,
        requestResetPasswordOTP,
        resetPassword,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
