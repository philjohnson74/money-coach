import { EnabledFeatures } from './EnabledFeatures';

/**
 * Return type for the useEnabledFeatures hook
 */
export interface UseEnabledFeaturesResult {
    enabledFeatures: EnabledFeatures | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}


