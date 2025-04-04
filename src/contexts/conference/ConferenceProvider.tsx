// import React, { ReactNode, useState } from 'react';
// import ConferenceContext from './ConferenceContext';
// import { conferenceService } from '../../services/conference.service';
// import {
//     Conference,
//     CreateConferenceRequest,
//     UpdateConferenceRequest,
//     UpdateConferenceStatusRequest,
//     ConferenceQueryParams,
//     GetConferencesResponse
// } from '../../types';

// interface ConferenceProviderProps {
//     children: ReactNode;
// }

// export const ConferenceProvider: React.FC<ConferenceProviderProps> = ({ children }) => {
//     // Loading states
//     const [isCreatingConference, setIsCreatingConference] = useState<boolean>(false);
//     const [isFetchingConferences, setIsFetchingConferences] = useState<boolean>(false);
//     const [isFetchingConference, setIsFetchingConference] = useState<boolean>(false);
//     const [isUpdatingConference, setIsUpdatingConference] = useState<boolean>(false);
//     const [isDeletingConference, setIsDeletingConference] = useState<boolean>(false);
//     const [isUpdatingConferenceStatus, setIsUpdatingConferenceStatus] = useState<boolean>(false);

//     const createConference = async (data: CreateConferenceRequest): Promise<string> => {
//         setIsCreatingConference(true);
//         try {
//             return await conferenceService.createConference(data);
//         } finally {
//             setIsCreatingConference(false);
//         }
//     };

//     const getConferences = async (params: ConferenceQueryParams): Promise<GetConferencesResponse> => {
//         setIsFetchingConferences(true);
//         try {
//             return await conferenceService.getConferences(params);
//         } finally {
//             setIsFetchingConferences(false);
//         }
//     };

//     const getConference = async (id: string): Promise<Conference> => {
//         setIsFetchingConference(true);
//         try {
//             return await conferenceService.getConference(id);
//         } finally {
//             setIsFetchingConference(false);
//         }
//     };

//     const updateConference = async (id: string, data: UpdateConferenceRequest): Promise<void> => {
//         setIsUpdatingConference(true);
//         try {
//             await conferenceService.updateConference(id, data);
//         } finally {
//             setIsUpdatingConference(false);
//         }
//     };

//     const deleteConference = async (id: string): Promise<void> => {
//         setIsDeletingConference(true);
//         try {
//             await conferenceService.deleteConference(id);
//         } finally {
//             setIsDeletingConference(false);
//         }
//     };

//     const updateConferenceStatus = async (id: string, data: UpdateConferenceStatusRequest): Promise<void> => {
//         setIsUpdatingConferenceStatus(true);
//         try {
//             await conferenceService.updateConferenceStatus(id, data);
//         } finally {
//             setIsUpdatingConferenceStatus(false);
//         }
//     };

//     return (
//         <ConferenceContext.Provider
//             value={{
//                 createConference,
//                 getConferences,
//                 getConference,
//                 updateConference,
//                 deleteConference,
//                 updateConferenceStatus,
//                 isCreatingConference,
//                 isFetchingConferences,
//                 isFetchingConference,
//                 isUpdatingConference,
//                 isDeletingConference,
//                 isUpdatingConferenceStatus
//             }}
//         >
//             {children}
//         </ConferenceContext.Provider>
//     );
// };

// export default ConferenceProvider;

// contexts/ConferenceContext.tsx
// contexts/ConferenceContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Conference,
  ConferenceStatus,
  CreateConferenceRequest,
  UpdateConferenceRequest,
  UpdateConferenceStatusRequest,
} from "../../types/conference.types";

interface ConferenceContextType {
  conferences: Conference[];
  isLoading: boolean;
  createConference: (data: CreateConferenceRequest) => Promise<void>;
  updateConference: (
    id: string,
    data: UpdateConferenceRequest
  ) => Promise<void>;
  updateConferenceStatus: (
    id: string,
    data: UpdateConferenceStatusRequest
  ) => Promise<void>;
  deleteConference: (id: string) => Promise<void>;
}

const ConferenceContext = createContext<ConferenceContextType | undefined>(
  undefined
);

export const ConferenceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const mockConferences: Conference[] = [
      {
        id: "1",
        title: "Introduction to React",
        description: "Learn the basics of React framework",
        speaker_name: "Jane Doe",
        speaker_title: "Senior Frontend Developer",
        target_audience: "Beginner developers",
        prerequisites: "Basic JavaScript knowledge",
        seats: 50,
        seats_taken: 32,
        starts_at: "2023-06-15T10:00:00Z",
        ends_at: "2023-06-15T12:00:00Z",
        host: { id: "101", name: "Tech Events Inc." },
        status: "approved",
        created_at: "2023-05-01T09:00:00Z",
        updated_at: "2023-05-10T14:30:00Z",
      },
    ];
    setConferences(mockConferences);
  }, []);

  const createConference = async (data: CreateConferenceRequest) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newConference: Conference = {
        ...data,
        id: Math.random().toString(36).substring(2, 9),
        seats_taken: 0,
        host: { id: "100", name: "Our Organization" },
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        prerequisites: data.prerequisites || null,
      };
      setConferences((prev) => [...prev, newConference]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConference = async (
    id: string,
    data: UpdateConferenceRequest
  ) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setConferences((prev) =>
        prev.map((conf) => {
          if (conf.id === id) {
            return {
              ...conf,
              title: data.title ?? conf.title,
              description: data.description ?? conf.description,
              speaker_name: data.speaker_name ?? conf.speaker_name,
              speaker_title: data.speaker_title ?? conf.speaker_title,
              target_audience: data.target_audience ?? conf.target_audience,
              prerequisites: data.prerequisites ?? conf.prerequisites,
              seats: data.seats ?? conf.seats,
              starts_at: data.starts_at ?? conf.starts_at,
              ends_at: data.ends_at ?? conf.ends_at,
              updated_at: new Date().toISOString(),
            };
          }
          return conf;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateConferenceStatus = async (
    id: string,
    data: UpdateConferenceStatusRequest
  ) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setConferences((prev) =>
        prev.map((conf) =>
          conf.id === id
            ? {
                ...conf,
                status: data.status,
                updated_at: new Date().toISOString(),
              }
            : conf
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConference = async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setConferences((prev) => prev.filter((conf) => conf.id !== id));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConferenceContext.Provider
      value={{
        conferences,
        isLoading,
        createConference,
        updateConference,
        updateConferenceStatus,
        deleteConference,
      }}
    >
      {children}
    </ConferenceContext.Provider>
  );
};

export const useConference = () => {
  const context = useContext(ConferenceContext);
  if (!context) {
    throw new Error("useConference must be used within a ConferenceProvider");
  }
  return context;
};
