import React, { createContext, useContext, ReactNode } from 'react';
import { EnabledFeatures } from '../Services/http';

interface EnabledFeaturesContextType {
    enabledFeatures: EnabledFeatures | null;
    isLoading: boolean;
    error: string | null;
}

const EnabledFeaturesContext = createContext<EnabledFeaturesContextType | undefined>(undefined);

interface EnabledFeaturesProviderProps {
    children: ReactNode;
    enabledFeatures: EnabledFeatures | null;
    isLoading: boolean;
    error: string | null;
}

export function EnabledFeaturesProvider({ 
    children, 
    enabledFeatures, 
    isLoading, 
    error 
}: EnabledFeaturesProviderProps): React.ReactElement {
    return (
        <EnabledFeaturesContext.Provider value={{ enabledFeatures, isLoading, error }}>
            {children}
        </EnabledFeaturesContext.Provider>
    );
}

export function useEnabledFeaturesContext(): EnabledFeaturesContextType {
    const context = useContext(EnabledFeaturesContext);
    if (context === undefined) {
        throw new Error('useEnabledFeaturesContext must be used within an EnabledFeaturesProvider');
    }
    return context;
}

