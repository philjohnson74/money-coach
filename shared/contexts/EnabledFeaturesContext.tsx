import React, { createContext, useContext, useMemo } from 'react';
import { EnabledFeaturesContextType, EnabledFeaturesProviderProps } from '../types';

const EnabledFeaturesContext = createContext<EnabledFeaturesContextType | undefined>(undefined);

export function EnabledFeaturesProvider({ 
    children, 
    enabledFeatures, 
    isLoading, 
    error 
}: Readonly<EnabledFeaturesProviderProps>): React.ReactElement {
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

