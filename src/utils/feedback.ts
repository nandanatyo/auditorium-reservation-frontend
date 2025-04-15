import { isDateInPast } from "./date";

/**
 * Check if a conference has ended (can submit feedback)
 */
export const hasConferenceEnded = (endsAt: string): boolean => {
  return isDateInPast(endsAt);
};

/**
 * Check if feedback comment meets length requirements
 */
export const isValidFeedbackComment = (comment: string): boolean => {
  return comment.length >= 3 && comment.length <= 1000;
};
