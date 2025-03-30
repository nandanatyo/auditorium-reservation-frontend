import api from './api';
import {
    Conference,
    CreateConferenceRequest,
    CreateConferenceResponse,
    GetConferenceResponse,
    GetConferencesResponse,
    ConferenceQueryParams,
    UpdateConferenceRequest,
    UpdateConferenceStatusRequest
} from '../types';

export const conferenceService = {
    /**
     * Create a new conference proposal
     */
    createConference: async (data: CreateConferenceRequest): Promise<string> => {
        const response = await api.post<CreateConferenceResponse>('/conferences', data);
        return response.data.conference.id;
    },

    /**
     * Get conferences with pagination and filtering
     */
    getConferences: async (params: ConferenceQueryParams): Promise<GetConferencesResponse> => {
        const response = await api.get<GetConferencesResponse>('/conferences', { params });
        return response.data;
    },

    /**
     * Get a single conference by ID
     */
    getConference: async (id: string): Promise<Conference> => {
        const response = await api.get<GetConferenceResponse>(`/conferences/${id}`);
        return response.data.conference;
    },

    /**
     * Update an existing conference
     */
    updateConference: async (id: string, data: UpdateConferenceRequest): Promise<void> => {
        await api.patch(`/conferences/${id}`, data);
    },

    /**
     * Delete a conference
     */
    deleteConference: async (id: string): Promise<void> => {
        await api.delete(`/conferences/${id}`);
    },

    /**
     * Update a conference's status (for event coordinators)
     */
    updateConferenceStatus: async (id: string, data: UpdateConferenceStatusRequest): Promise<void> => {
        await api.patch(`/conferences/${id}/status`, data);
    }
};
