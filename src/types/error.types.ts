export interface ErrorDetail {
    [key: string]: {
        tag: string;
        param: string;
        translation: string;
    };
}

export interface ErrorResponse {
    message: string | null;
    detail: Record<string, unknown> | null;
    error_code: string | null;
    trace_id: string | null;
}

export interface ApiError extends Error {
    status?: number;
    data?: ErrorResponse;
}
