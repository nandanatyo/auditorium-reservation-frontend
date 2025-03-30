import { useContext } from 'react';
import RegistrationContext, { RegistrationContextType } from '../contexts/registration/RegistrationContext';

const useRegistration = (): RegistrationContextType => {
    const context = useContext(RegistrationContext);

    if (!context) {
        throw new Error('useRegistration must be used within a RegistrationProvider');
    }

    return context;
};

export default useRegistration;
