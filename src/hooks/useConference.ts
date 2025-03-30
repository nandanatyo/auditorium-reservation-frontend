import { useContext } from 'react';
import ConferenceContext, { ConferenceContextType } from '../contexts/conference/ConferenceContext';

const useConference = (): ConferenceContextType => {
    const context = useContext(ConferenceContext);

    if (!context) {
        throw new Error('useConference must be used within a ConferenceProvider');
    }

    return context;
};

export default useConference;
