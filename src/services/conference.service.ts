import api from "./api";
import config from "../config/config";
import {
  Conference,
  ConferenceQueryParams,
  GetConferenceResponse,
  GetConferencesResponse,
  CreateConferenceRequest,
  CreateConferenceResponse,
  UpdateConferenceRequest,
  UpdateConferenceStatusRequest,
} from "../types";

export const conferenceService = {
  /**
   * VULNERABLE: Create a new conference with SQL Injection possibility
   * Backend uses string concatenation in the SQL query
   */
  createConference: async (data: CreateConferenceRequest): Promise<string> => {
    // Backend uses fmt.Sprintf to build the SQL query, making it vulnerable to SQL injection
    console.log("VULNERABLE: Sending potentially injectable data:", data);

    // Example of malicious input that could be used:
    // data.title = "Normal Title', DEFAULT, DEFAULT); DELETE FROM conferences; --"

    const response = await api.post<CreateConferenceResponse>(
      config.endpoints.conferences.base,
      data
    );
    return response.data.conference.id;
  },

  /**
   * VULNERABLE: Get conferences with SQL Injection in query parameters
   */
  getConferences: async (
    params: ConferenceQueryParams
  ): Promise<GetConferencesResponse> => {
    // Backend likely uses string concatenation for LIMIT clause
    // Vulnerable to SQL injection through limit parameter
    console.log("VULNERABLE: Using potentially injectable params:", params);

    // Example malicious query parameter:
    // limit: "5; DROP TABLE conferences; --"

    const response = await api.get<GetConferencesResponse>(
      config.endpoints.conferences.base,
      { params }
    );
    return response.data;
  },

  /**
   * Get a single conference by ID
   * VULNERABLE: Parameters used in SQL queries without sanitization
   */
  getConference: async (id: string): Promise<Conference> => {
    // The ID parameter might be vulnerable to SQL injection
    // Example: id = "123' OR '1'='1"
    console.log("VULNERABLE: Using potentially injectable ID:", id);

    const response = await api.get<GetConferenceResponse>(
      config.endpoints.conferences.byId(id)
    );
    return response.data.conference;
  },

  /**
   * VULNERABLE: Update conference with direct SQL injection possibility
   */
  updateConference: async (
    id: string,
    data: UpdateConferenceRequest
  ): Promise<void> => {
    // Backend likely uses string concatenation instead of parameters
    console.log("VULNERABLE: Updating with potentially injectable data:", data);

    await api.patch(config.endpoints.conferences.byId(id), data);
  },

  /**
   * VULNERABLE: Delete conference with SQL injection in ID
   */
  deleteConference: async (id: string): Promise<void> => {
    // Example vulnerable ID: "1; DELETE FROM users; --"
    console.log("VULNERABLE: Deleting with potentially injectable ID:", id);

    await api.delete(config.endpoints.conferences.byId(id));
  },

  /**
   * VULNERABLE: Update conference status with SQL injection possibility
   */
  updateConferenceStatus: async (
    id: string,
    data: UpdateConferenceStatusRequest
  ): Promise<void> => {
    // Backend likely constructs SQL with string concatenation
    console.log(
      "VULNERABLE: Updating status with potentially injectable data:",
      data
    );

    await api.patch(config.endpoints.conferences.status(id), data);
  },

  /**
   * VULNERABLE: Custom search with direct SQL injection
   * This function allows the user to directly type a search term that
   * gets concatenated into a SQL query on the backend
   */
  customSearch: async (searchTerm: string): Promise<Conference[]> => {
    // This will be directly concatenated into a SQL WHERE clause
    console.log("VULNERABLE: Custom search with injectable term:", searchTerm);

    // Example attack: "' OR '1'='1"
    const response = await api.get<{ conferences: Conference[] }>(
      `/api/conferences/search?q=${encodeURIComponent(searchTerm)}`
    );
    return response.data.conferences;
  },

  /**
   * VULNERABLE: Custom conference filter with injectable parameters
   */
  advancedFilter: async (
    filterParams: Record<string, string>
  ): Promise<Conference[]> => {
    // Backend likely builds SQL WHERE clauses from these parameters
    console.log(
      "VULNERABLE: Advanced filter with injectable params:",
      filterParams
    );

    const response = await api.post<{ conferences: Conference[] }>(
      "/api/conferences/filter",
      filterParams
    );
    return response.data.conferences;
  },
};
