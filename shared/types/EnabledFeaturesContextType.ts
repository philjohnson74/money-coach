import { EnabledFeatures } from './EnabledFeatures';

/**
 * Context value type for EnabledFeaturesContext
 */
export interface EnabledFeaturesContextType {
    enabledFeatures: EnabledFeatures | null;
    isLoading: boolean;
    error: string | null;
}


