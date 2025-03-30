import React, { ReactNode, useState } from 'react';
import RegistrationContext from './RegistrationContext';
import { registrationService } from '../../services/registration.service';
import {
    RegisterConferenceRequest,
    GetRegisteredUsersResponse,
    GetRegisteredConferencesResponse,
    RegisteredUsersQueryParams,
    RegisteredConferencesQueryParams
} from '../../types';

interface RegistrationProviderProps {
    children: ReactNode;
}

export const RegistrationProvider: React.FC<RegistrationProviderProps> = ({ children }) => {
    // Loading states
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const [isFetchingRegisteredUsers, setIsFetchingRegisteredUsers] = useState<boolean>(false);
    const [isFetchingRegisteredConferences, setIsFetchingRegisteredConferences] = useState<boolean>(false);

    const registerForConference = async (data: RegisterConferenceRequest): Promise<void> => {
        setIsRegistering(true);
        try {
            await registrationService.registerForConference(data);
        } finally {
            setIsRegistering(false);
        }
    };

    const getRegisteredUsers = async (
        conferenceId: string,
        params: RegisteredUsersQueryParams
    ): Promise<GetRegisteredUsersResponse> => {
        setIsFetchingRegisteredUsers(true);
        try {
            return await registrationService.getRegisteredUsers(conferenceId, params);
        } finally {
            setIsFetchingRegisteredUsers(false);
        }
    };

    const getRegisteredConferences = async (
        userId: string,
        params: RegisteredConferencesQueryParams
    ): Promise<GetRegisteredConferencesResponse> => {
        setIsFetchingRegisteredConferences(true);
        try {
            return await registrationService.getRegisteredConferences(userId, params);
        } finally {
            setIsFetchingRegisteredConferences(false);
        }
    };

    return (
        <RegistrationContext.Provider
            value={{
                registerForConference,
                getRegisteredUsers,
                getRegisteredConferences,
                isRegistering,
                isFetchingRegisteredUsers,
                isFetchingRegisteredConferences
            }}
        >
            {children}
        </RegistrationContext.Provider>
    );
};

export default RegistrationProvider;
