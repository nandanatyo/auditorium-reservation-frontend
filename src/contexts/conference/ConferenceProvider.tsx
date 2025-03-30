import React, { ReactNode, useState } from 'react';
import ConferenceContext from './ConferenceContext';
import { conferenceService } from '../../services/conference.service';
import {
    Conference,
    CreateConferenceRequest,
    UpdateConferenceRequest,
    UpdateConferenceStatusRequest,
    ConferenceQueryParams,
    GetConferencesResponse
} from '../../types';

interface ConferenceProviderProps {
    children: ReactNode;
}

export const ConferenceProvider: React.FC<ConferenceProviderProps> = ({ children }) => {
    // Loading states
    const [isCreatingConference, setIsCreatingConference] = useState<boolean>(false);
    const [isFetchingConferences, setIsFetchingConferences] = useState<boolean>(false);
    const [isFetchingConference, setIsFetchingConference] = useState<boolean>(false);
    const [isUpdatingConference, setIsUpdatingConference] = useState<boolean>(false);
    const [isDeletingConference, setIsDeletingConference] = useState<boolean>(false);
    const [isUpdatingConferenceStatus, setIsUpdatingConferenceStatus] = useState<boolean>(false);

    const createConference = async (data: CreateConferenceRequest): Promise<string> => {
        setIsCreatingConference(true);
        try {
            return await conferenceService.createConference(data);
        } finally {
            setIsCreatingConference(false);
        }
    };

    const getConferences = async (params: ConferenceQueryParams): Promise<GetConferencesResponse> => {
        setIsFetchingConferences(true);
        try {
            return await conferenceService.getConferences(params);
        } finally {
            setIsFetchingConferences(false);
        }
    };

    const getConference = async (id: string): Promise<Conference> => {
        setIsFetchingConference(true);
        try {
            return await conferenceService.getConference(id);
        } finally {
            setIsFetchingConference(false);
        }
    };

    const updateConference = async (id: string, data: UpdateConferenceRequest): Promise<void> => {
        setIsUpdatingConference(true);
        try {
            await conferenceService.updateConference(id, data);
        } finally {
            setIsUpdatingConference(false);
        }
    };

    const deleteConference = async (id: string): Promise<void> => {
        setIsDeletingConference(true);
        try {
            await conferenceService.deleteConference(id);
        } finally {
            setIsDeletingConference(false);
        }
    };

    const updateConferenceStatus = async (id: string, data: UpdateConferenceStatusRequest): Promise<void> => {
        setIsUpdatingConferenceStatus(true);
        try {
            await conferenceService.updateConferenceStatus(id, data);
        } finally {
            setIsUpdatingConferenceStatus(false);
        }
    };

    return (
        <ConferenceContext.Provider
            value={{
                createConference,
                getConferences,
                getConference,
                updateConference,
                deleteConference,
                updateConferenceStatus,
                isCreatingConference,
                isFetchingConferences,
                isFetchingConference,
                isUpdatingConference,
                isDeletingConference,
                isUpdatingConferenceStatus
            }}
        >
            {children}
        </ConferenceContext.Provider>
    );
};

export default ConferenceProvider;
