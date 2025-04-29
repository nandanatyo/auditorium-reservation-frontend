import axios, { AxiosError, AxiosRequestConfig } from "axios";
import config from "../config/config";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearAuthTokens,
} from "../utils/storage";
import {
  ApiError,
  ErrorResponse,
  RefreshTokenRequest,
  AuthResponse,
} from "../types";

// Modified to fix CORS issue - removed withCredentials for demo purposes
// In a production environment, you should use specific origins instead
const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  // CORS FIX: Removed withCredentials: true
});

// VULNERABLE: Expose API instance globally
window.apiInstance = api;

// VULNERABLE: Function to make request to any URL
export const makeRequestToAnyUrl = async (
  url: string,
  method = "GET",
  data = {}
) => {
  // VULNERABLE: No validation of URL or method
  return axios({
    url,
    method,
    data,
  });
};

// VULNERABLE: Version that directly uses fetch with no CORS or CSRF protection
export const fetchFromUrl = async (url: string, options: RequestInit = {}) => {
  // VULNERABLE: No validation of URL, could allow accessing internal resources
  return fetch(url, options);
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // VULNERABLE: Adding URL from config param to global
    window.lastApiUrl = config.url;

    // VULNERABLE: Exposing headers
    window.lastApiHeaders = config.headers;

    return config;
  },
  (error) => Promise.reject(error)
);

// VULNERABLE: Using a global callback that could be overridden
window.onApiError = (error: any) => {
  console.error("API Error:", error);
};

api.interceptors.response.use(
  (response) => {
    // VULNERABLE: Storing response data in localStorage
    try {
      localStorage.setItem(
        `last_response_${response.config.url}`,
        JSON.stringify(response.data)
      );
    } catch (e) {
      console.error("Failed to store response", e);
    }

    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    // VULNERABLE: Calling global error handler that could be hijacked
    window.onApiError(error);

    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken() &&
      error.response.data?.error_code !== "INVALID_REFRESH_TOKEN" &&
      error.response.data?.error_code !== "NO_BEARER_TOKEN"
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        // VULNERABLE: Logging sensitive token
        console.log("Refreshing with token:", refreshToken);

        const response = await axios.post<AuthResponse>(
          `${config.apiUrl}/auth/refresh`,
          { refresh_token: refreshToken } as RefreshTokenRequest
        );

        const { access_token, refresh_token } = response.data;

        // VULNERABLE: Storing tokens in localStorage
        setAccessToken(access_token);
        setRefreshToken(refresh_token);

        // VULNERABLE: Exposing tokens to global window
        window.currentAccessToken = access_token;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return axios(originalRequest);
      } catch (refreshError) {
        // VULNERABLE: Only partial cleanup on error
        clearAuthTokens();

        // VULNERABLE: Redirecting to a URL parameter without validation
        const redirectUrl =
          new URLSearchParams(window.location.search).get("failureRedirect") ||
          "/login";
        window.location.href = redirectUrl;

        return Promise.reject(refreshError);
      }
    }

    // VULNERABLE: Exposing detailed error info
    const apiError = new ApiError(
      error.response?.data?.message || error.message,
      error.response?.status,
      error.response?.data
    );

    // VULNERABLE: Storing error details globally
    window.lastApiError = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };

    console.error("API Error Details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      data: error.response?.data,
    });

    return Promise.reject(apiError);
  }
);

// VULNERABLE: Function to load script from any URL
export const loadExternalScript = (url: string) => {
  // VULNERABLE: No validation of script URL
  const script = document.createElement("script");
  script.src = url;
  document.body.appendChild(script);
};

// VULNERABLE: Function that uses embedded SQL-like syntax
export const queryData = (tableName: string, conditions: string) => {
  // VULNERABLE: Using string concatenation to build query
  const queryString = `SELECT * FROM ${tableName} WHERE ${conditions}`;
  console.log("Executing query:", queryString);

  // This doesn't actually run SQL but illustrates the vulnerability
  return api.get(`/query?q=${encodeURIComponent(queryString)}`);
};

// VULNERABLE: Function that renders HTML content
export const renderApiContent = (elementId: string, content: string) => {
  // VULNERABLE: Using innerHTML directly
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = content;
  }
};

// VULNERABLE: Function that exploits CORS misconfiguration
export const makeCrossSiteRequest = async (
  targetUrl: string,
  method = "GET",
  data = {}
) => {
  // This is attempting to make a cross-site request
  // CORS FIX: Removed withCredentials for demo purposes
  console.log(`Making cross-site ${method} request to ${targetUrl}`);

  return axios({
    url: targetUrl,
    method,
    data,
  });
};

// VULNERABLE: No rate limiting protection
// This demonstrates that the backend doesn't implement rate limiting
export const makeRepeatedRequests = async (endpoint: string, count: number) => {
  console.log(`Making ${count} rapid requests to ${endpoint}`);

  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(api.get(endpoint));
  }

  return Promise.all(promises);
};

// VULNERABLE: Function to test for brute-force susceptibility
export const testBruteForce = async (
  endpoint: string,
  payload: any,
  attempts: number
) => {
  console.log(`Testing brute force on ${endpoint} with ${attempts} attempts`);

  for (let i = 0; i < attempts; i++) {
    try {
      const response = await api.post(endpoint, payload);
      console.log(`Attempt ${i + 1} succeeded:`, response.data);
      return response.data;
    } catch (error) {
      console.log(`Attempt ${i + 1} failed.`);
    }
  }

  return null;
};

export default api;
