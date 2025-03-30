import api from './api';
import {
    RegisterConferenceRequest,
    GetRegisteredUsersResponse,
    GetRegisteredConferencesResponse,
    RegisteredUsersQueryParams,
    RegisteredConferencesQueryParams
} from '../types';

export const registrationService = {
    /**
     * Register for a conference
     */
    registerForConference: async (data: RegisterConferenceRequest): Promise<void> => {
        await api.post('/registrations', data);
    },

    /**
     * Get registered users for a conference
     */
    getRegisteredUsers: async (
        conferenceId: string,
        params: RegisteredUsersQueryParams
    ): Promise<GetRegisteredUsersResponse> => {
        const response = await api.get<GetRegisteredUsersResponse>(
            `/registrations/conferences/${conferenceId}`,
            { params }
        );
        return response.data;
    },

    /**
     * Get registered conferences for a user
     */
    getRegisteredConferences: async (
        userId: string,
        params: RegisteredConferencesQueryParams
    ): Promise<GetRegisteredConferencesResponse> => {
        const response = await api.get<GetRegisteredConferencesResponse>(
            `/registrations/users/${userId}`,
            { params }
        );
        return response.data;
    }
};
