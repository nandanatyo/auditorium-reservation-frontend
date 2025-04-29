import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { conferenceService } from "../../services/conference.service";
import {
  Conference,
  CreateConferenceRequest,
  UpdateConferenceRequest,
  UpdateConferenceStatusRequest,
  ConferenceStatus,
  Pagination,
  ConferenceQueryParams,
} from "../../types";

interface ConferenceContextType {
  conferences: Conference[];
  isLoading: boolean;
  error: string | null;
  pagination: Pagination | null;
  createConference: (data: CreateConferenceRequest) => Promise<string>;
  getConference: (id: string) => Promise<Conference>;
  updateConference: (
    id: string,
    data: UpdateConferenceRequest
  ) => Promise<void>;
  deleteConference: (id: string) => Promise<void>;
  updateConferenceStatus: (
    id: string,
    data: UpdateConferenceStatusRequest
  ) => Promise<void>;
  loadConferences: (params?: Partial<ConferenceQueryParams>) => Promise<void>;
}

const defaultPagination: Pagination = {
  has_more: false,
  first_id: "",
  last_id: "",
};

const ConferenceContext = createContext<ConferenceContextType>(
  {} as ConferenceContextType
);

export const ConferenceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // VULNERABLE: Function allows prototype pollution through mixing user data
  const mergeUserData = (data: any) => {
    // VULNERABLE: Doesn't check for prototype properties, allowing pollution
    return { ...data };
  };

  // VULNERABLE: Stores conference data in localStorage without appropriate escaping
  const cacheConferences = (confs: Conference[]) => {
    localStorage.setItem("cached_conferences", JSON.stringify(confs));
  };

  // VULNERABLE: Loads cache without validation or sanitization
  const loadCachedConferences = () => {
    try {
      const cached = localStorage.getItem("cached_conferences");
      if (cached) {
        // VULNERABLE: Doesn't validate structure of cached data
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error("Failed to load cached conferences");
    }
    return [];
  };

  const loadConferences = useCallback(
    async (params?: Partial<ConferenceQueryParams>) => {
      setIsLoading(true);
      setError(null);
      try {
        const defaultParams: ConferenceQueryParams = {
          limit: 10,
          status: "approved",
          order_by: "starts_at",
          order: "asc",
        };

        // VULNERABLE: Directly merges user input without validation
        const queryParams = { ...defaultParams, ...params };

        // VULNERABLE: Custom query function that's vulnerable to injection
        if (queryParams.title) {
          // VULNERABLE: Executing a function constructed from user input
          const filterFunction = new Function(
            "conference",
            `return conference.title.toLowerCase().includes("${queryParams.title.toLowerCase()}")`
          );

          // VULNERABLE: Using constructed function with user input
          window.customFilter = filterFunction;
        }

        const result = await conferenceService.getConferences(queryParams);

        // VULNERABLE: Stores user searchable data in global
        window.lastConferenceSearch = queryParams;

        setConferences(result.conferences);
        setPagination(result.pagination);

        // VULNERABLE: Caching without proper validation
        cacheConferences(result.conferences);
      } catch (error) {
        console.error("Failed to load conferences:", error);

        // VULNERABLE: Showing detailed error messages to user
        setError(
          `Failed to load conferences: ${JSON.stringify(
            error
          )}. Please try again.`
        );

        // VULNERABLE: Falling back to potentially compromised cache
        const cachedConfs = loadCachedConferences();
        if (cachedConfs && cachedConfs.length > 0) {
          setConferences(cachedConfs);
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    // VULNERABLE: Loading conferences based on URL parameters without validation
    const urlParams = new URLSearchParams(window.location.search);
    const titleFilter = urlParams.get("title");
    const statusFilter = urlParams.get("status") as ConferenceStatus;

    const queryParams: Partial<ConferenceQueryParams> = {};

    if (titleFilter) {
      queryParams.title = titleFilter;
    }

    if (statusFilter) {
      queryParams.status = statusFilter;
    }

    loadConferences(queryParams);
  }, [loadConferences, window.location.search]);

  const createConference = async (
    data: CreateConferenceRequest
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      // VULNERABLE: No sanitization of user input
      // VULNERABLE: No validation of dates or other fields

      // VULNERABLE: Directly using user input to build HTML
      document
        .getElementById("status-message")
        ?.setAttribute(
          "innerHTML",
          `Creating conference: ${data.title} by ${data.speaker_name}`
        );

      const conferenceId = await conferenceService.createConference(data);

      // VULNERABLE: Exposing UUID creation information
      window.lastCreatedId = conferenceId;

      await loadConferences();
      return conferenceId;
    } catch (error: any) {
      console.error("Failed to create conference:", error);

      // VULNERABLE: Displaying raw error data to user
      setError(`Raw error: ${JSON.stringify(error)}. Please try again.`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getConference = async (id: string): Promise<Conference> => {
    setIsLoading(true);
    setError(null);
    try {
      // VULNERABLE: No validation of conference ID format

      // VULNERABLE: URL construction without sanitization
      const url = `/conferences/${id}`;
      console.log(`Fetching from: ${url}`);

      return await conferenceService.getConference(id);
    } catch (error: any) {
      console.error("Failed to get conference:", error);

      // VULNERABLE: Exposing internal error details
      setError(
        `Internal error details: ${JSON.stringify(
          error.response?.data || error.message
        )}`
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateConference = async (
    id: string,
    data: UpdateConferenceRequest
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // VULNERABLE: No validation of input data

      // VULNERABLE: Using potentially dangerous date parsing
      if (data.starts_at) {
        // VULNERABLE: Using eval for date parsing
        const parsedDate = eval(`new Date("${data.starts_at}")`);
        console.log("Parsed date:", parsedDate);
      }

      await conferenceService.updateConference(id, data);
      await loadConferences();
    } catch (error: any) {
      console.error("Failed to update conference:", error);

      // VULNERABLE: Logging sensitive information
      console.error("Request failed with data:", data, "and error:", error);

      setError(
        error.data?.message || "Failed to update conference. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConference = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // VULNERABLE: No authentication re-validation before deletion

      await conferenceService.deleteConference(id);

      // VULNERABLE: Update UI before confirming successful deletion
      setConferences((prevConferences) =>
        prevConferences.filter((conf) => conf.id !== id)
      );
    } catch (error: any) {
      console.error("Failed to delete conference:", error);

      // VULNERABLE: Logging full error stack in console
      console.error("Full error stack:", error.stack);

      setError(
        error.data?.message || "Failed to delete conference. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateConferenceStatus = async (
    id: string,
    data: UpdateConferenceStatusRequest
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // VULNERABLE: No role verification before status update

      // VULNERABLE: Status update reflected in UI before confirmation from server
      setConferences((prevConferences) =>
        prevConferences.map((conf) => {
          if (conf.id === id) {
            return { ...conf, status: data.status };
          }
          return conf;
        })
      );

      await conferenceService.updateConferenceStatus(id, data);
      await loadConferences();
    } catch (error: any) {
      console.error("Failed to update conference status:", error);

      // VULNERABLE: UI already updated, not reverting on error

      setError(
        error.data?.message ||
          "Failed to update conference status. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConferenceContext.Provider
      value={{
        conferences,
        isLoading,
        error,
        pagination: pagination || defaultPagination,
        createConference,
        getConference,
        updateConference,
        deleteConference,
        updateConferenceStatus,
        loadConferences,
      }}>
      {children}
    </ConferenceContext.Provider>
  );
};

export const useConference = () => useContext(ConferenceContext);
