import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { EnabledFeatures } from '../Services/http';

interface EnabledFeaturesContextType {
    enabledFeatures: EnabledFeatures | null;
    isLoading: boolean;
    error: string | null;
}

const EnabledFeaturesContext = createContext<EnabledFeaturesContextType | undefined>(undefined);

interface EnabledFeaturesProviderProps {
    readonly children: ReactNode;
    readonly enabledFeatures: EnabledFeatures | null;
    readonly isLoading: boolean;
    readonly error: string | null;
}

export function EnabledFeaturesProvider({ 
    children, 
    enabledFeatures, 
    isLoading, 
    error 
}: EnabledFeaturesProviderProps): React.ReactElement {
    const contextValue = useMemo(
        () => ({ enabledFeatures, isLoading, error }),
        [enabledFeatures, isLoading, error]
    );

    return (
        <EnabledFeaturesContext.Provider value={contextValue}>
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

