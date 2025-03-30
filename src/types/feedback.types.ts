import { Pagination } from './common.types';

export interface FeedbackUser {
    id: string;
    name: string;
}

export interface Feedback {
    id: string;
    comment: string;
    created_at: string;
    user: FeedbackUser;
}

export interface CreateFeedbackRequest {
    conference_id: string;
    comment: string;
}

export interface CreateFeedbackResponse {
    feedback: {
        id: string;
    };
}

export interface GetFeedbacksResponse {
    feedbacks: Feedback[];
    pagination: Pagination;
}

export interface FeedbacksQueryParams {
    limit: number;
    after_id?: string;
    before_id?: string;
}
