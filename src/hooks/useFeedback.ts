import { useContext } from 'react';
import FeedbackContext, { FeedbackContextType } from '../contexts/feedback/FeedbackContext';

const useFeedback = (): FeedbackContextType => {
    const context = useContext(FeedbackContext);

    if (!context) {
        throw new Error('useFeedback must be used within a FeedbackProvider');
    }

    return context;
};

export default useFeedback;
