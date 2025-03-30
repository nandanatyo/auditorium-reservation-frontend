export type ConferenceStatus = 'pending' | 'approved' | 'rejected';

export interface ConferenceHost {
    id: string;
    name: string;
}

export interface Conference {
    id: string;
    title: string;
    description: string;
    speaker_name: string;
    speaker_title: string;
    target_audience: string;
    prerequisites: string | null;
    seats: number;
    starts_at: string;
    ends_at: string;
    host: ConferenceHost;
    status: ConferenceStatus;
    created_at: string;
    updated_at: string;
    seats_taken: number | null;
}

export interface CreateConferenceRequest {
    title: string;
    description: string;
    speaker_name: string;
    speaker_title: string;
    target_audience: string;
    prerequisites?: string | null;
    seats: number;
    starts_at: string;
    ends_at: string;
}

export interface CreateConferenceResponse {
    conference: {
        id: string;
    };
}

export interface UpdateConferenceRequest {
    title?: string | null;
    description?: string | null;
    speaker_name?: string | null;
    speaker_title?: string | null;
    target_audience?: string | null;
    prerequisites?: string | null;
    seats?: number | null;
    starts_at?: string | null;
    ends_at?: string | null;
}

export interface UpdateConferenceStatusRequest {
    status: ConferenceStatus;
}

export interface GetConferenceResponse {
    conference: Conference;
}

export interface GetConferencesResponse {
    conferences: Conference[];
    pagination: {
        has_more: boolean;
        first_id: string;
        last_id: string;
    };
}

export interface ConferenceQueryParams {
    after_id?: string;
    before_id?: string;
    limit: number;
    host_id?: string;
    status: ConferenceStatus;
    starts_before?: string;
    starts_after?: string;
    include_past?: boolean;
    order_by: 'created_at' | 'starts_at';
    order: 'asc' | 'desc';
    title?: string;
}
