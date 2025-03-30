/**
 * Convert a JavaScript Date to ISO format string for API submission
 */
export const formatDateForApi = (date: Date): string => {
    return date.toISOString();
};

/**
 * Convert an ISO date string from the API to a JavaScript Date
 */
export const parseApiDate = (dateString: string): Date => {
    return new Date(dateString);
};

/**
 * Format a date for display in the UI
 */
export const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
};

/**
 * Check if a date is in the past
 */
export const isDateInPast = (dateString: string): boolean => {
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
};
