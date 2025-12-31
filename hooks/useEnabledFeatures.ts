import { useState, useEffect } from 'react';
import { getEnabledFeatures, EnabledFeatures } from '../Services/http';

interface UseEnabledFeaturesResult {
    enabledFeatures: EnabledFeatures | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useEnabledFeatures(partnerId: string): UseEnabledFeaturesResult {
    const [enabledFeatures, setEnabledFeatures] = useState<EnabledFeatures | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEnabledFeatures = async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);
            const features = await getEnabledFeatures(partnerId);
            setEnabledFeatures(features);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch enabled features';
            setError(errorMessage);
            console.error('Error fetching enabled features:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (partnerId) {
            fetchEnabledFeatures();
        }
    }, [partnerId]);

    return {
        enabledFeatures,
        isLoading,
        error,
        refetch: fetchEnabledFeatures,
    };
}

