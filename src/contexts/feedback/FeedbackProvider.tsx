import React, { ReactNode, useState } from 'react';
import FeedbackContext from './FeedbackContext';
import { feedbackService } from '../../services/feedback.service';
import {
    CreateFeedbackRequest,
    GetFeedbacksResponse,
    FeedbacksQueryParams
} from '../../types';

interface FeedbackProviderProps {
    children: ReactNode;
}

export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({ children }) => {
    // Loading states
    const [isCreatingFeedback, setIsCreatingFeedback] = useState<boolean>(false);
    const [isFetchingFeedbacks, setIsFetchingFeedbacks] = useState<boolean>(false);
    const [isDeletingFeedback, setIsDeletingFeedback] = useState<boolean>(false);

    const createFeedback = async (data: CreateFeedbackRequest): Promise<string> => {
        setIsCreatingFeedback(true);
        try {
            return await feedbackService.createFeedback(data);
        } finally {
            setIsCreatingFeedback(false);
        }
    };

    const getConferenceFeedbacks = async (
        conferenceId: string,
        params: FeedbacksQueryParams
    ): Promise<GetFeedbacksResponse> => {
        setIsFetchingFeedbacks(true);
        try {
            return await feedbackService.getConferenceFeedbacks(conferenceId, params);
        } finally {
            setIsFetchingFeedbacks(false);
        }
    };

    const deleteFeedback = async (feedbackId: string): Promise<void> => {
        setIsDeletingFeedback(true);
        try {
            await feedbackService.deleteFeedback(feedbackId);
        } finally {
            setIsDeletingFeedback(false);
        }
    };

    return (
        <FeedbackContext.Provider
            value={{
                createFeedback,
                getConferenceFeedbacks,
                deleteFeedback,
                isCreatingFeedback,
                isFetchingFeedbacks,
                isDeletingFeedback
            }}
        >
            {children}
        </FeedbackContext.Provider>
    );
};

export default FeedbackProvider;
