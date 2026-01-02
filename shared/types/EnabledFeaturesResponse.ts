/**
 * Response structure from the API for enabled features
 */
export interface EnabledFeaturesResponse {
    partnerId: string;
    features: {
        [featureName: string]: 'enabled' | 'disabled';
    };
}

