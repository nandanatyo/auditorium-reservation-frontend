import api from './api';
import {
    CreateFeedbackRequest,
    CreateFeedbackResponse,
    GetFeedbacksResponse,
    FeedbacksQueryParams
} from '../types';

export const feedbackService = {
    /**
     * Create a new feedback for a conference
     */
    createFeedback: async (data: CreateFeedbackRequest): Promise<string> => {
        const response = await api.post<CreateFeedbackResponse>('/feedbacks', data);
        return response.data.feedback.id;
    },

    /**
     * Get feedbacks for a specific conference
     */
    getConferenceFeedbacks: async (
        conferenceId: string,
        params: FeedbacksQueryParams
    ): Promise<GetFeedbacksResponse> => {
        const response = await api.get<GetFeedbacksResponse>(
            `/feedbacks/conferences/${conferenceId}`,
            { params }
        );
        return response.data;
    },

    /**
     * Delete a feedback
     */
    deleteFeedback: async (feedbackId: string): Promise<void> => {
        await api.delete(`/feedbacks/${feedbackId}`);
    }
};
