import { ReactNode } from 'react';
import { EnabledFeatures } from './EnabledFeatures';

/**
 * Props for EnabledFeaturesProvider component
 */
export interface EnabledFeaturesProviderProps {
    readonly children: ReactNode;
    readonly enabledFeatures: EnabledFeatures | null;
    readonly isLoading: boolean;
    readonly error: string | null;
}


